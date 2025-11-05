

## 🧩 1. Imports and environment setup

```js
require("dotenv").config()
const { ethers } = require("ethers")

// Import private key helper
const { promptForKey } = require("../helpers/prompt.js")
```

### What this does:

* `dotenv` → loads `.env` variables into `process.env`.
* `ethers` → main Ethereum library.
* `promptForKey()` → helper function that securely asks the user for their **private key**.

The helper (`helpers/prompt.js`) looks like this:

```js
const prompt = require('prompt')
const schema = { properties: { privateKey: { message: 'Enter Private Key', required: true, hidden: true } } };

async function promptForKey() {
  prompt.start()
  const result = await prompt.get(schema)
  return result.privateKey
}
```

🔐 This allows you to **type your private key securely** in the terminal (hidden input).

---

## 🌐 2. Connecting to the blockchain

```js
const URL = process.env.TENDERLY_RPC_URL
const provider = new ethers.JsonRpcProvider(URL)
```

* `provider` = your **blockchain connection**.
* `TENDERLY_RPC_URL` → a **Tenderly fork or mainnet RPC endpoint**.

A provider is like your **Ethereum node connection** — it lets you:

* Query balances
* Send transactions
* Interact with smart contracts

---

## 🧾 3. Receiver setup

```js
const RECEIVER = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
```

This is the **recipient address** that will receive the ETH.

---

## ⚙️ 4. Main function

```js
async function main() {
  const privateKey = await promptForKey()
```

You’re securely **prompting for the private key**, not hardcoding it — great practice.

Then:

```js
const wallet = new ethers.Wallet(privateKey, provider);
```

This line does 2 things:

1. Creates a **Wallet object** from your private key.
2. Connects it to the provider → meaning now this wallet can **sign** and **send** transactions through that node.

Think of it like:

> “This wallet represents an Ethereum account with signing ability.”

---

## 💰 5. Checking balances before transaction

```js
const senderBalanceBefore = await provider.getBalance(wallet.address);
const receiverBalanceBefore = await provider.getBalance(RECEIVER);
```

* Fetches **current balances** for both sender and receiver (in wei).
* You then format them to ETH:

```js
console.log(`Sender balance before: ${ethers.formatUnits(senderBalanceBefore, 18)} ETH`);
```

---

## 🚀 6. Creating and sending the transaction

```js
const transaction = await wallet.sendTransaction({
  to: RECEIVER,
  value: ethers.parseUnits("1", 18)
})
```

### What this does:

* You’re **sending 1 ETH** from the wallet to `RECEIVER`.
* `ethers.parseUnits("1", 18)` converts `1 ETH` → `1000000000000000000 wei`.
* `sendTransaction()` automatically:

  1. Builds the transaction object.
  2. Estimates gas.
  3. Signs it with your private key.
  4. Broadcasts it to the connected network.

---

## ⏳ 7. Waiting for the transaction confirmation

```js
const receipt = await transaction.wait();
```

`transaction.wait()` pauses until the transaction is mined and included in a block.
The **receipt** is the proof that it was successful.

---

## 🧠 8. Understanding the outputs

### 🧾 Transaction object (before mined)

```js
TransactionResponse {
  to: '0xf39Fd6e...',
  from: '0x3C44CdD...',
  value: 1000000000000000000n,
  type: 2, // EIP-1559 transaction
  maxPriorityFeePerGas: 1n,
  maxFeePerGas: 3n,
  ...
}
```

This is what gets **sent** to the network — the signed transaction.

### ✅ Receipt (after mined)

```js
TransactionReceipt {
  to: '0xf39Fd6e...',
  from: '0x3C44CdD...',
  blockNumber: 23712600,
  gasUsed: 30360n,
  status: 1
}
```

* `status: 1` → ✅ Success
* `gasUsed` → amount of gas consumed
* `hash` → unique transaction hash
  (you can view it on a block explorer like Tenderly / Etherscan if on public net)

---

## ⚖️ 9. Checking balances after

```js
const senderBalanceAfter = await provider.getBalance(wallet.address);
const receiverBalanceAfter = await provider.getBalance(RECEIVER);
```

Then you log:

```js
Sender balance after: 9.9999999999996 ETH
Receiver balance after: 1.0 ETH
```

This shows:

* Sender lost ~1 ETH + gas fees.
* Receiver balance updated accordingly.

---

## 🧩 10. Conversion helpers

You also noted these correctly:

```js
// parseUnits converts ETH → wei
// formatUnits converts wei → ETH
```

✅ `parseUnits("1", 18)` = `1 * 10^18 wei`
✅ `formatUnits(balance, 18)` = `balance / 10^18 ETH`

---

## ⚙️ 11. Why `transactionHash` is undefined

In your output, this line:

```js
console.log(`Transaction successful with hash: ${receipt.transactionHash}`);
```

gave:

```
Transaction successful with hash: undefined
```

👉 That’s because in **Ethers v6**, the receipt property name changed:

* Old (v5): `receipt.transactionHash`
* New (v6): `receipt.hash`

✅ Fix:

```js
console.log(`Transaction successful with hash: ${receipt.hash}`);
```

---

## 🧠 TL;DR Summary

| Step | Action                    | Function                                       |
| ---- | ------------------------- | ---------------------------------------------- |
| 1    | Load private key securely | `promptForKey()`                               |
| 2    | Connect to blockchain     | `new ethers.JsonRpcProvider()`                 |
| 3    | Create wallet             | `new ethers.Wallet(privateKey, provider)`      |
| 4    | Get balances              | `provider.getBalance(address)`                 |
| 5    | Send signed transaction   | `wallet.sendTransaction({...})`                |
| 6    | Wait for mining           | `transaction.wait()`                           |
| 7    | Format units              | `ethers.formatUnits()` / `ethers.parseUnits()` |

---

## 💡 Tip: Testing safely

When experimenting:

* Use **Tenderly**, **Anvil**, or **Sepolia testnet** instead of mainnet.
* You can simulate everything without losing real ETH.

---

