// Require packages
require('dotenv').config()
const {ethers} = require('ethers')

// Setup connection
const URL = `https://eth-mainnet.g.alchemy.com/v2/cp49ioiaRPKXyNy73BuFM`
const provider = new ethers.JsonRpcProvider(URL)

const ADDRESS = "0x396343362be2A4dA1cE0C1C210945346fb82Aa49"

async function main() {
  // Get balance
  const balance = await provider.getBalance(ADDRESS)  // by default balance comes in wei

  // Log balance
  console.log(`Balance of address ${ADDRESS} is: ${ethers.formatEther(balance)} ETH`)
  console.log(`Balance is: ${ethers.formatUnits(balance, "wei")} wei`);
  console.log(`Balance is: ${ethers.formatUnits(balance, 18)} ETH`);

}

main()


//// OUTPUT:

// ❯ node examples/1_accounts.js               
// Balance of address 0x396343362be2A4dA1cE0C1C210945346fb82Aa49 is: 23.549600706125768371 ETH
// Balance is: 23549600706125768371 wei
// Balance is: 23.549600706125768371 ETH