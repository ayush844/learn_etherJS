

## 🧩 1. Imports and environment setup

```js
require("dotenv").config()
const { ethers } = require("ethers")
const { promptForKey } = require("../helpers/prompt.js")
```

### ✅ Purpose:

* `dotenv` loads sensitive data (like your Tenderly RPC URL) from `.env`.
* `ethers` gives blockchain access.
* `promptForKey()` securely asks you to **type your private key** instead of hardcoding it.

---

## 🌐 2. Setup provider (connection to blockchain)

```js
const URL = process.env.TENDERLY_RPC_URL
const provider = new ethers.JsonRpcProvider(URL)
```

* `provider` is your connection to the blockchain (via Tenderly fork / mainnet RPC).
* It allows you to **read** blockchain state and **send transactions**.

Think of the provider as your **internet connection to Ethereum**.

---

## ⚙️ 3. Define the contract interface (ABI)

```js
const ERC20_ABI = [
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)",
];
```

### ✅ What this means:

You define the **minimal ABI** — only the functions you plan to use.
Each line is a human-readable representation of how the smart contract functions are structured.

| Function                 | Type         | Description                                    |
| ------------------------ | ------------ | ---------------------------------------------- |
| `decimals()`             | `view`       | Returns how many decimal places the token uses |
| `balanceOf(address)`     | `view`       | Reads balance for an address                   |
| `transfer(address,uint)` | `nonpayable` | Executes a token transfer                      |

These are **standard ERC20 functions**, available in all ERC20 tokens (like USDC, DAI, etc).

---

## 🧱 4. Create a contract instance

```js
const ERC20_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" // USDC Contract
const contract = new ethers.Contract(ERC20_ADDRESS, ERC20_ABI, provider)
```

This line creates a **Contract object**, meaning:

> You can now call any of the listed functions on that deployed contract.

The `provider` here is read-only, but you’ll later attach a **wallet** to enable write operations.

---

## 👥 5. Define the receiver

```js
const RECIEVER = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
```

This is the address you’re sending USDC to.

---

## ⚙️ 6. Main function — setup and read balances

```js
const privateKey = await promptForKey()
const wallet = new ethers.Wallet(privateKey, provider)
```

* Creates a **signer wallet** from your private key.
* Connects it to the provider → now this wallet can **sign transactions**.

Then you check balances:

```js
const senderBalanceBefore = await contract.balanceOf(wallet.address)
const recieverBalanceBefore = await contract.balanceOf(RECIEVER)
```

These are **on-chain reads**, free to execute since they’re `view` functions.

---

## 💰 7. Setup amount to transfer

```js
const decimals = await contract.decimals()
const amount = ethers.parseUnits("2", decimals)
```

* `decimals` for USDC = 6
* So `ethers.parseUnits("2", 6)` → converts `2.0 USDC` → `2000000` (in micro-units)

Ethers always works in **wei-like smallest units**, so you must convert before sending.

---

## 🚀 8. Sending the transaction

```js
const transaction = await contract.connect(wallet).transfer(RECIEVER, amount)
await transaction.wait();
```

### Let’s unpack this:

* `contract.connect(wallet)` → attaches your signer (wallet) to the contract, giving it permission to **write**.
* `.transfer(to, amount)` → calls the smart contract function and signs it with your private key.
* `await transaction.wait()` → waits for it to be **mined** and included in a block.

### ⚙️ What actually happens under the hood:

Ethers encodes this as:

```
data: 0xa9059cbb000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb9226600000000000000000000000000000000000000000000000000000000001e8480
```

This is how Ethereum handles smart contract calls.

Breaking it down:

```
0xa9059cbb                                  ← function selector (transfer(address,uint256))
000000000000000000000000f39fd6e51aad88f6... ← 32-byte recipient address
000000000000000000000000000000000000000000... ← 32-byte amount (0x1e8480 = 2000000)
```

So your transaction is:

```
transfer(0xf39Fd6e..., 2000000)
```

---

## 📜 9. Transaction object

Ethers returns this object immediately:

```js
ContractTransactionResponse {
  to: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  from: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
  hash: '0xab883c09fe7b7e9...',
  data: '0xa9059cbb...0001e8480',
  value: 0n,          // ERC20 transfers don't send ETH
  type: 2,            // EIP-1559 transaction
  maxFeePerGas: 3n,
  maxPriorityFeePerGas: 1n,
}
```

### After it’s mined:

```js
await transaction.wait();
```

You’ll get the receipt, confirming that it succeeded.

---

## 📊 10. Reading balances again

```js
const senderBalanceAfter = await contract.balanceOf(wallet.address)
const recieverBalanceAfter = await contract.balanceOf(RECIEVER)
```

Output:

```
Sender balance before: 10000000
Receiver balance before: 0
Sender balance after: 8000000
Receiver balance after: 2000000
```

✅ Perfect — the sender lost 2,000,000 (2 USDC)
✅ Receiver gained 2,000,000 (2 USDC)

---

## 🧠 TL;DR Summary

| Step                      | Action                                          | Ethers.js Concept |
| ------------------------- | ----------------------------------------------- | ----------------- |
| Connect to blockchain     | `new ethers.JsonRpcProvider()`                  |                   |
| Create contract interface | `new ethers.Contract(address, abi, provider)`   |                   |
| Create wallet             | `new ethers.Wallet(privateKey, provider)`       |                   |
| Read data                 | `contract.balanceOf(address)`                   |                   |
| Write data                | `contract.connect(wallet).transfer(to, amount)` |                   |
| Wait for confirmation     | `transaction.wait()`                            |                   |

---

## ⚡ Bonus: Understanding the encoded data (deep dive)

| Field                                                              | Bytes | Meaning                                               |
| ------------------------------------------------------------------ | ----- | ----------------------------------------------------- |
| `0xa9059cbb`                                                       | 4     | Function selector for `transfer(address,uint256)`     |
| `000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266` | 32    | Padded recipient address                              |
| `00000000000000000000000000000000000000000000000000000000001e8480` | 32    | Padded amount (2 USDC = 2 × 10⁶ = 2000000 = 0x1e8480) |

This encoding follows the **Ethereum ABI specification**, which ensures all contract calls are encoded the same way.

---

## ⚠️ Important Notes

1. **USDC is a real token**, so use **Tenderly / Sepolia testnet** for practice — not mainnet keys.
2. If using Tenderly Forks, the transaction executes instantly, with simulated balances.
3. Always `parseUnits()` with the correct number of decimals (use `contract.decimals()`).

---

