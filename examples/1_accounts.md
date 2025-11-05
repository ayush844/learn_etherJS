
## 🧩 1. Importing dependencies

```js
require('dotenv').config()
const { ethers } = require('ethers')
```

### What’s happening:

* `dotenv` allows you to load environment variables from a `.env` file into `process.env`.
  👉 It’s useful to store sensitive info like **private keys or API URLs** securely.
* `ethers` is the main Ethereum library. It lets you:

  * Connect to blockchain networks
  * Read/write smart contracts
  * Manage wallets and transactions

---

## 🌐 2. Setting up the connection

```js
const URL = `https://eth-mainnet.g.alchemy.com/v2/cp49ioiaRPKXyNy73BuFM`
const provider = new ethers.JsonRpcProvider(URL)
```

### What’s happening:

* The URL is your **Alchemy endpoint** — a node that connects to the **Ethereum mainnet**.

  * It’s how your code talks to the blockchain.
* `new ethers.JsonRpcProvider(URL)` creates a **provider**.

### Think of a provider as:

> “Your blockchain connection interface”
> It lets you **read** data (like balances, blocks, transactions, etc.) from the blockchain.

---

## 👤 3. Setting the target address

```js
const ADDRESS = "0x396343362be2A4dA1cE0C1C210945346fb82Aa49"
```

This is the **Ethereum wallet address** whose balance you want to check.

---

## ⚙️ 4. Main function

```js
async function main() {
  // Get balance
  const balance = await provider.getBalance(ADDRESS)
```

### What happens here:

* `provider.getBalance(address)` is an **asynchronous** call.
* It returns the **ETH balance of the address** in **wei** (the smallest unit of ETH).

> 1 ETH = 1e18 wei

So if someone has `23.5496... ETH`, the actual number in wei is:
`23549600706125768371`

---

## 🧮 5. Formatting balance

```js
console.log(`Balance of address ${ADDRESS} is: ${ethers.formatEther(balance)} ETH`)
console.log(`Balance is: ${ethers.formatUnits(balance, "wei")} wei`);
console.log(`Balance is: ${ethers.formatUnits(balance, 18)} ETH`);
```

Here’s what each does:

| Function                             | Description                                 | Output                     |
| ------------------------------------ | ------------------------------------------- | -------------------------- |
| `ethers.formatEther(balance)`        | Converts from wei → ether (divides by 1e18) | `23.5496... ETH`           |
| `ethers.formatUnits(balance, "wei")` | Formats the balance in **wei** units        | `23549600706125768371 wei` |
| `ethers.formatUnits(balance, 18)`    | Same as formatEther — also divides by 10¹⁸  | `23.5496... ETH`           |

Basically:

* Wei = smallest unit (integer value)
* Ether = human-readable (decimal value)

---

## 🚀 6. Run the function

```js
main()
```

Since `main()` is an async function, it returns a Promise, but since we’re not `await`ing it here (top-level await not used), Node just runs it normally.

---

## 🧾 7. Output explained

```
Balance of address 0x3963... is: 23.549600706125768371 ETH
Balance is: 23549600706125768371 wei
Balance is: 23.549600706125768371 ETH
```

So:

* This wallet has **23.5496 ETH**
* Which equals **23,549,600,706,125,768,371 wei**

---

## 🧠 TL;DR Summary

| Step                     | Concept                        | Ethers.js Method |
| ------------------------ | ------------------------------ | ---------------- |
| Connect to Ethereum node | `new ethers.JsonRpcProvider()` |                  |
| Fetch wallet balance     | `provider.getBalance(address)` |                  |
| Convert from wei to ETH  | `ethers.formatEther(balance)`  |                  |

---

If you want to make this script **more secure**, you can move your Alchemy URL to a `.env` file:

```env
ALCHEMY_URL=https://eth-mainnet.g.alchemy.com/v2/your-api-key
```

and then:

```js
const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_URL)
```

---

