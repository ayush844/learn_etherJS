require("dotenv").config()
const { ethers } = require("ethers")

// Setup connection
const URL = `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
const provider = new ethers.JsonRpcProvider(URL)

// Define "Application Binary Interface"
const ERC20_ABI = [
  // Some details about the token
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint)",
]

// Setup contract
const ERC20_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" // USDC Contract Address
const contract = new ethers.Contract(
  ERC20_ADDRESS,
  ERC20_ABI,
  provider
)


async function main() {
  // Get contract state
  const name = await contract.name()
  const symbol = await contract.symbol()
  const decimals = await contract.decimals()
  const totalSupply = await contract.totalSupply()

  // Log contract state
  console.log(`Token Name: ${name}`)
  console.log(`Token Symbol: ${symbol}`)
  console.log(`Token Decimals: ${decimals}`)
  console.log(`Token Total Supply: ${ethers.formatUnits(totalSupply, decimals)} ${symbol}`)
  
  // Get ERC20 balance
  const HOLDER_ADDRESS = "0x38AAEF3782910bdd9eA3566C839788Af6FF9B200"
  const balance = await contract.balanceOf(HOLDER_ADDRESS)

  // Log ERC20 balance
  console.log(`Balance of Holder (${HOLDER_ADDRESS}): ${ethers.formatUnits(balance, decimals)} ${symbol}`)

}

main()

//// OUTPUT:
// ❯ node examples/3_read_smart_contracts.js 
// Token Name: USD Coin
// Token Symbol: USDC
// Token Decimals: 6
// Token Total Supply: 51194364995.322178 USDC
// Balance of Holder (0x38AAEF3782910bdd9eA3566C839788Af6FF9B200): 2560196682.0 USDC