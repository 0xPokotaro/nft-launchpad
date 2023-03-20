// import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
// import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyToken", () => {
  const NAME = "MyToken";
  const SYMBOL = "MTKN";

  async function deployMyToken() {
    const [owner, devFund, ownFund] = await ethers.getSigners();

    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy(NAME, SYMBOL, devFund.address, ownFund.address, owner.address);

    return { myToken, owner };
  }

  describe("Deployment", () => {
    it("sets the correct name", async () => {
      const { myToken } = await deployMyToken();
      expect(await myToken.name()).to.equal(NAME);
    });
  });
});
