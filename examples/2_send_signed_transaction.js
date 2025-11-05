require("dotenv").config()
const { ethers } = require("ethers")

// Import private key helper
const { promptForKey } = require("../helpers/prompt.js")

// Setup connection

const URL = process.env.TENDERLY_RPC_URL
const provider = new ethers.JsonRpcProvider(URL)

const RECEIVER = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

async function main() {
  const privateKey = await promptForKey()

  // Setup wallet
  const wallet = new ethers.Wallet(privateKey, provider);

  // Get balances

  const senderBalanceBefore = await provider.getBalance(wallet.address);
  const receiverBalanceBefore = await provider.getBalance(RECEIVER);

  // Log balances
  console.log(`Sender balance before: ${ethers.formatUnits(senderBalanceBefore, 18)} ETH`);
  console.log(`Receiver balance before: ${ethers.formatUnits(receiverBalanceBefore, 18)} ETH`);

  // Create transaction
  const transaction = await wallet.sendTransaction({
    to: RECEIVER,
    value: ethers.parseUnits("1", 18) // 1 ETH,
  })
  /////////////// parseUnits converts ETH to wei
  /////////////// formatUnits converts wei to ETH

  // Wait transaction
  const receipt = await transaction.wait();
  console.log("Transaction:", transaction);
  console.log("Receipt:",receipt);
  console.log(`Transaction successful with hash: ${receipt.transactionHash}`);

  // Get balances
  const senderBalanceAfter = await provider.getBalance(wallet.address);
  const receiverBalanceAfter = await provider.getBalance(RECEIVER);

  // Log balances
  console.log(`Sender balance after: ${ethers.formatUnits(senderBalanceAfter, 18)} ETH`);
  console.log(`Receiver balance after: ${ethers.formatUnits(receiverBalanceAfter, 18)} ETH`);

}

main()


//// OUTPUT:

// ❯ node examples/2_send_signed_transaction.js
// prompt: Enter Private Key:  
// Sender balance before: 10.999999999999693344 ETH
// Receiver balance before: 1.0 ETH
// Transaction: TransactionResponse {
//   provider: JsonRpcProvider {},
//   blockNumber: null,
//   blockHash: null,
//   index: undefined,
//   hash: '0xa759c26502a8991761f9d3073818473641687686098eabd0ea136aa44d6d730f',
//   type: 2,
//   to: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
//   from: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
//   nonce: 2401,
//   gasLimit: 32646n,
//   gasPrice: undefined,
//   maxPriorityFeePerGas: 1n,
//   maxFeePerGas: 3n,
//   maxFeePerBlobGas: null,
//   data: '0x',
//   value: 1000000000000000000n,
//   chainId: 1n,
//   signature: Signature { r: "0x052753f15a353b7a22c8eb5cd6309f0908a9d94309484381bfeb24239f18341a", s: "0x72b9f02b5e795db3785adedd42f2e5887bc4c044177e3433dc24f8585e12cfc2", yParity: 1, networkV: null },
//   accessList: [],
//   blobVersionedHashes: null
// }
// Receipt: TransactionReceipt {
//   provider: JsonRpcProvider {},
//   to: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
//   from: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
//   contractAddress: null,
//   hash: '0xa759c26502a8991761f9d3073818473641687686098eabd0ea136aa44d6d730f',
//   index: 0,
//   blockHash: '0x0720071ca8df32bc98f21f8b7975bc4643a6d527a5ae2487fbe382fbddaef7af',
//   blockNumber: 23712600,
//   logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
//   gasUsed: 30360n,
//   blobGasUsed: 0n,
//   cumulativeGasUsed: 30360n,
//   gasPrice: 2n,
//   blobGasPrice: null,
//   type: 2,
//   status: 1,
//   root: undefined
// }
// Transaction successful with hash: undefined
// Sender balance after: 9.999999999999632624 ETH
// Receiver balance after: 1.0 ETH

//  ~/Desktop/learn_ether_js  starter_code !5 ································································································· 11s  system ⬢  07:09:06 
// ❯ 