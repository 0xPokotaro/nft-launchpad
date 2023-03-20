// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "erc721a/contracts/extensions/ERC721AQueryable.sol";
import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "operator-filter-registry/src/DefaultOperatorFilterer.sol";

contract MyToken is
    ERC721AQueryable,
    Ownable,
    DefaultOperatorFilterer,
    ERC2981,
    ReentrancyGuard
{
    address payable public developerFund;
    address payable public ownerFund;

    bytes32 private _presaleMerkleRoot;

    uint256 public constant MAX_SUPPLY = 5000;
    uint256 public constant MINT_LIMIT_PER_ADDRESS = 3;
    uint256 public MINT_PRICE = 0.1 ether;

    bool public operatorFilteringEnabled;
    bool public publicSaleActive = false;
    bool public preSaleActive = false;
    string private _baseTokenURI;
    mapping(address => uint256) public userMinted;

    event UpdateBaseURI(string baseURI);
    event UpdateSalePrice(uint256 _price);
    event UpdatePresaleStatus(bool _preSale);
    event UpdateSaleStatus(bool _publicSale);
    event UpdatePresaleMerkleRoot(bytes32 merkleRoot);

    constructor(
        string memory _name,
        string memory _symbol,
        address _developerFund,
        address _ownerFund,
        address _defaultRoyalty
    )
        ERC721A(_name, _symbol)
    {
        require(_developerFund != address(0) && _ownerFund != address(0), "AddressCannotBeZero");

        developerFund = payable(_developerFund);
        ownerFund = payable(_ownerFund);

        _setDefaultRoyalty(_defaultRoyalty, 500);
    }

    // Modifiers
    modifier callerIsUser() {
        require(tx.origin == msg.sender, "CallerIsAContract");
        _;
    }

    modifier requireCorrectEth(uint256 _quantity) {
        require(msg.value == MINT_PRICE * _quantity, "IncorrectETHSent");
        _;
    }

    // Minting Functions
    function mint(uint256 quantity)
        external
        payable
        callerIsUser
        nonReentrant
        requireCorrectEth(quantity)
    {
        require(publicSaleActive, "SaleNotActive");
        require(totalSupply() + quantity <= MAX_SUPPLY, "ExceedsMaxSupply");
        require(userMinted[msg.sender] + quantity <= MINT_LIMIT_PER_ADDRESS, "MintLimitReached");

        userMinted[msg.sender] += quantity;
        _mint(msg.sender, quantity);
    }

    // Presale Mint Function
    function presaleMint(bytes32[] calldata _merkleProof, uint256 quantity)
        external
        payable
        callerIsUser
        nonReentrant
        requireCorrectEth(quantity)
    {
        require(preSaleActive, "SaleNotActive");

        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(MerkleProof.verifyCalldata(_merkleProof, _presaleMerkleRoot, leaf), "Unauthorized");

        require(totalSupply() + quantity <= MAX_SUPPLY, "ExceedsMaxSupply");

        require(_getAux(msg.sender) == 0, "TxnLimitReached");

        require(userMinted[msg.sender] + quantity <= MINT_LIMIT_PER_ADDRESS, "MintLimitReached");

        userMinted[msg.sender] += quantity;
        _setAux(msg.sender, 1);
        _mint(msg.sender, quantity);
    }

    // Dev Mint Function
    function devMint(address _to, uint256 quantity) external payable onlyOwner {
        require(totalSupply() + quantity <= MAX_SUPPLY, "ExceedsMaxSupply");
        _mint(_to, quantity);
    }

    // Base URI Function
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    // Setter Functions
    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
        emit UpdateBaseURI(baseURI);
    }

    function setSalePrice(uint256 _price) external onlyOwner {
        MINT_PRICE = _price;
        emit UpdateSalePrice(_price);
    }

    function setPresaleStatus(bool _preSale) external onlyOwner {
        preSaleActive = _preSale;
        emit UpdatePresaleStatus(_preSale);
    }

    function setSaleStatus(bool _publicSale) external onlyOwner {
        publicSaleActive = _publicSale;
        emit UpdateSaleStatus(_publicSale);
    }

    function setPresaleMerkleRoot(bytes32 merkleRoot) external onlyOwner {
        _presaleMerkleRoot = merkleRoot;
        emit UpdatePresaleMerkleRoot(merkleRoot);
    }

    // ETH Withdrawal
    function withdraw() external onlyOwner nonReentrant {
        uint256 currentBalance = address(this).balance;
        uint256 amount1 = (currentBalance * 5.5e19) / 1e21;
        uint256 amount2 = currentBalance - amount1;

        (bool success1, ) = payable(developerFund).call{value: amount1}("");
        require(success1, "ETHTransferFailDev");

        (bool success2, ) = payable(ownerFund).call{value: amount2}("");
        require(success2, "ETHTransferFailOwner");
    }

    // Operator Filtering
    function setApprovalForAll(address operator, bool approved)
        public
        override(IERC721A, ERC721A)
        onlyAllowedOperatorApproval(operator)
    {
        super.setApprovalForAll(operator, approved);
    }

    function approve(address operator, uint256 tokenId)
        public
        payable
        override(IERC721A, ERC721A)
        onlyAllowedOperatorApproval(operator)
    {
        super.approve(operator, tokenId);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public payable override(IERC721A, ERC721A) onlyAllowedOperator(from) {
        super.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId)
        public payable
        override(IERC721A, ERC721A)
        onlyAllowedOperator(from)
    {
        super.safeTransferFrom(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data)
        public payable
        override(IERC721A, ERC721A)
        onlyAllowedOperator(from)
    {
        super.safeTransferFrom(from, to, tokenId, data);
    }

    function setOperatorFilteringEnabled(bool value) external onlyOwner {
        operatorFilteringEnabled = value;
    }

    // ERC2981 Implementation
    function setDefaultRoyalty(address receiver, uint96 feeNumerator)
        external
        onlyOwner
    {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    // SupportsInterface
    function supportsInterface(bytes4 interfaceId)
        public view virtual
        override(IERC721A, ERC721A, ERC2981)
        returns (bool)
    {
        // Supported interface IDs:
        // - IERC165: 0x01ffc9a7
        // - IERC721: 0x80ac58cd
        // - IERC721Metadata: 0x5b5e139f
        // - IERC2981: 0x2a55205a
        return ERC721A.supportsInterface(interfaceId) || ERC2981.supportsInterface(interfaceId);
    }

    function _startTokenId() internal view virtual override returns (uint256) {
        return 1;
    }
}
