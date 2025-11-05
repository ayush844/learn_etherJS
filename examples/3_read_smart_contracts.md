

## 🧩 1. Imports & Environment Setup

```js
require("dotenv").config()
const { ethers } = require("ethers")
```

* `dotenv` → loads environment variables (so your API key isn’t hardcoded).
* `ethers` → gives access to Ethereum tools like providers, contracts, and utilities.

---

## 🌐 2. Connecting to the Blockchain

```js
const URL = `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
const provider = new ethers.JsonRpcProvider(URL)
```

* **Alchemy RPC URL** connects to the **Ethereum Mainnet**.
* `ethers.JsonRpcProvider` creates a **provider** object to **read data from the blockchain**.

🔍 Providers are **read-only** connections (unless you attach a wallet).

---

## 📜 3. Defining the Contract Interface (ABI)

```js
const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint)",
]
```

This is a **minimal ABI (Application Binary Interface)** — basically, a “menu” of the smart contract’s available functions that your script wants to use.

You don’t need the entire contract ABI — just the parts you’ll call.

For ERC20 tokens, these standard functions exist:

| Function             | Description                            | Return Type |
| -------------------- | -------------------------------------- | ----------- |
| `name()`             | Returns the token’s full name          | `string`    |
| `symbol()`           | Returns the short ticker symbol        | `string`    |
| `decimals()`         | Returns how many decimal places to use | `uint8`     |
| `totalSupply()`      | Total minted tokens                    | `uint256`   |
| `balanceOf(address)` | Returns balance of a specific account  | `uint256`   |

---

## 🏗️ 4. Connecting to the Smart Contract

```js
const ERC20_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" // USDC
const contract = new ethers.Contract(ERC20_ADDRESS, ERC20_ABI, provider)
```

This line creates a **Contract instance** — think of it like:

> “A local JavaScript object that represents a deployed smart contract on Ethereum.”

* `ERC20_ADDRESS` → contract’s deployed address
* `ERC20_ABI` → tells ethers what methods are available
* `provider` → gives read access to blockchain state

💡 If you wanted to *write* (send transactions), you’d replace `provider` with a **signer (wallet)**.

---

## ⚙️ 5. Reading Contract State

```js
const name = await contract.name()
const symbol = await contract.symbol()
const decimals = await contract.decimals()
const totalSupply = await contract.totalSupply()
```

These calls are **“read” operations** (no gas fee, because they use `view` functions).

Ethers.js automatically encodes your call, sends it via your `provider`, and decodes the returned value.

---

## 📊 6. Formatting and Logging the Results

```js
console.log(`Token Name: ${name}`)
console.log(`Token Symbol: ${symbol}`)
console.log(`Token Decimals: ${decimals}`)
console.log(`Token Total Supply: ${ethers.formatUnits(totalSupply, decimals)} ${symbol}`)
```

* `ethers.formatUnits(totalSupply, decimals)` → converts the raw `uint256` (in smallest units) into a human-readable format.

💡 USDC has **6 decimals**, not 18 like ETH — so:

```
Raw totalSupply = 51194364995322178 (in micro-units)
Formatted totalSupply = 51,194,364,995.322178 USDC
```

---

## 💰 7. Checking a Holder’s Balance

```js
const HOLDER_ADDRESS = "0x38AAEF3782910bdd9eA3566C839788Af6FF9B200"
const balance = await contract.balanceOf(HOLDER_ADDRESS)
```

Same logic — this is a `view` function that reads on-chain data.

It returns the balance in **token’s smallest unit** (like “micro-USDC”).

Then you format it:

```js
console.log(`Balance of Holder (${HOLDER_ADDRESS}): ${ethers.formatUnits(balance, decimals)} ${symbol}`)
```

If balance = `2560196682000000`,
with `decimals = 6`,
you get `2,560,196,682.0 USDC`.

---

## 🧾 8. Output Breakdown

```
Token Name: USD Coin
Token Symbol: USDC
Token Decimals: 6
Token Total Supply: 51194364995.322178 USDC
Balance of Holder: 2560196682.0 USDC
```

So:

* You connected to **USDC’s official ERC20 contract**
* Queried its details directly from **Ethereum mainnet**
* Fetched a real wallet’s token balance

No API other than Alchemy — all data came from the blockchain.

---

## 🧠 TL;DR Summary

| Step                     | Concept                                       | Ethers.js Method |
| ------------------------ | --------------------------------------------- | ---------------- |
| Connect to blockchain    | `new ethers.JsonRpcProvider()`                |                  |
| Define contract ABI      | Minimal list of functions                     |                  |
| Create contract instance | `new ethers.Contract(address, abi, provider)` |                  |
| Read data                | `contract.functionName()`                     |                  |
| Format output            | `ethers.formatUnits(value, decimals)`         |                  |

---

## ⚡ Bonus: How it works under the hood

When you call:

```js
await contract.name()
```

Ethers does:

1. Looks up the ABI entry for `name()`
2. Encodes it to hex (`0x06fdde03`)
3. Sends a JSON-RPC call:

   ```json
   { "method": "eth_call", "params": [{"to": "0xA0b86991...", "data": "0x06fdde03"}, "latest"] }
   ```
4. Gets a hex response and decodes it back to the string “USD Coin”.

---

## 💡 Try modifying it

You can:

* Replace `ERC20_ADDRESS` with any token (like DAI, LINK, UNI, etc.)
* Or log balances of multiple holders in a loop
* Or connect a **Signer** to transfer tokens (write operations)

---
