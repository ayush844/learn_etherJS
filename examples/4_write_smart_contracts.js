require("dotenv").config()
const { ethers } = require("ethers")

// Import private key helper
const { promptForKey } = require("../helpers/prompt.js")

// Setup connection
const URL = process.env.TENDERLY_RPC_URL
const provider = new ethers.JsonRpcProvider(URL)

// Define "Application Binary Interface"
const ERC20_ABI = [
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)",
];

// Setup contract
const ERC20_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" // USDC Contract
const contract = new ethers.Contract(ERC20_ADDRESS, ERC20_ABI, provider)

// Define reciever
const RECIEVER = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" // Your account address 2

async function main() {
  const privateKey = await promptForKey()

  // Setup wallet
  const wallet = new ethers.Wallet(privateKey, provider)

  // Get ERC20 balances
  const senderBalanceBefore = await contract.balanceOf(wallet.address)
  const recieverBalanceBefore = await contract.balanceOf(RECIEVER)

  // Log ERC20 balances
  console.log(`\nReading from ${ERC20_ADDRESS}\n`)
  console.log(`Sender balance before: ${senderBalanceBefore}\n`)
  console.log(`Reciever balance before: ${recieverBalanceBefore}\n`)

  // Setup amount to transfer
  const decimals = await contract.decimals()
  const amount = ethers.parseUnits("2", decimals) // 10 USDC


  // Create transaction
  const transaction = await contract.connect(wallet).transfer(RECIEVER, amount)

  // Wait transaction
  await transaction.wait();

  // Log transaction
  console.log("Transaction:", transaction)

  // Get ERC20 balances
  const senderBalanceAfter = await contract.balanceOf(wallet.address)
  const recieverBalanceAfter = await contract.balanceOf(RECIEVER)

  console.log(`\nBalance of sender: ${senderBalanceAfter}`)
  console.log(`Balance of reciever: ${recieverBalanceAfter}\n`)
}

main()


//// OUTPUT:

// ❯ node examples/4_write_smart_contracts.js
// prompt: Enter Private Key:  

// Reading from 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48

// Sender balance before: 10000000

// Reciever balance before: 0

// Transaction: ContractTransactionResponse {
//   provider: JsonRpcProvider {},
//   blockNumber: null,
//   blockHash: null,
//   index: undefined,
//   hash: '0xab883c09fe7b7e9432d7554a2fdc5a2b68d62449ef7d15ff4a7dd32fe64c5b43',
//   type: 2,
//   to: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
//   from: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
//   nonce: 2400,
//   gasLimit: 62733n,
//   gasPrice: undefined,
//   maxPriorityFeePerGas: 1n,
//   maxFeePerGas: 3n,
//   maxFeePerBlobGas: null,
//   data: '0xa9059cbb000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb9226600000000000000000000000000000000000000000000000000000000001e8480',

///// here:
///// 0xa9059cbb is the function selector for transfer(address,uint256)
///// followed by 32 bytes for the address and 32 bytes for the amount (in hex)

//   value: 0n,
//   chainId: 1n,
//   signature: Signature { r: "0xa2a326ab192d5b5244fe2974b4cb0f97ce658b702b62ee06e67e9d870ac2ae90", s: "0x721f509410a8e78c44b7970e43605891dbbe9a06cffe207b0ec9879ae3be0154", yParity: 1, networkV: null },
//   accessList: [],
//   blobVersionedHashes: null
// }

// Balance of sender: 8000000
// Balance of reciever: 2000000

