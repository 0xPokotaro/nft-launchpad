import { ethers } from "hardhat";

async function main() {
  const NAME = "MyToken";
  const SYMBOL = "MTKN";
  const devFund = "0x0000000"
  const ownFund = "0x0000000"
  const [deployer] = await ethers.getSigners();

  const MyToken = await ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy(NAME, SYMBOL, devFund, ownFund, deployer.address);

  await myToken.deployed();

  console.log(`Deployed to ${myToken.address}`);
}

(async () => {
  try {
    await main();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
})();
