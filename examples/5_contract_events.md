

## 🧩 1. What are “Events” in Ethereum?

In Ethereum, **events** are special **log entries** written by smart contracts when a transaction occurs.
They are **not stored as contract state**, but instead stored in the **transaction receipt** and **block logs**.

You can think of them as:

> "On-chain console logs" that are designed to be efficiently searched and filtered later.

---

### ✅ Why events exist:

* Smart contracts cannot directly “print” data to the console.
* But they can **emit events**, which are **indexed** and stored permanently in the blockchain.
* Frontends and off-chain apps (like your script) can **listen** or **query** these events to react to blockchain activity.

---

## ⚙️ 2. Declaring an Event (in Solidity)

Here’s how a typical ERC20 event looks in Solidity:

```solidity
event Transfer(address indexed from, address indexed to, uint256 value);
```

Every time someone transfers tokens, the ERC20 contract executes:

```solidity
emit Transfer(msg.sender, recipient, amount);
```

This writes a **log entry** into the transaction receipt with:

* **Event signature** (hash of event name + parameter types)
* **Indexed parameters** (`from`, `to`)
* **Data parameters** (`value`)

---

## 🔍 3. Indexed parameters & Topics explained

Each event log has **topics** — think of them like “searchable tags”.

* Up to **3 parameters** can be `indexed`.
* These indexed parameters are stored in the **topics array**.
* The **first topic (`topic[0]`)** is always the **event signature hash**.

### For example:

For `Transfer(address,address,uint256)`,
the first topic =
`keccak256("Transfer(address,address,uint256)")`
→ `0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef`

That’s exactly what you see in your output 👇

```js
topics: [
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // event signature
  '0x000000000000000000000000a69babef1ca67a37ffaf7a485dfff3382056e78c', // from
  '0x000000000000000000000000e0554a476a092703abdb3ef35c80e0d76d32939f'  // to
]
```

The **non-indexed parameters** (like `value`) are packed in the **data field**:

```js
data: '0x00000000000000000000000000000000000000000000000000000905ed4a1802'
```

---

## 🧠 4. How Ethers.js reads these logs

In your ABI:

```js
"event Transfer(address indexed from, address indexed to, uint amount)"
```

This tells Ethers.js how to **decode** those logs.
Then, when you query events using:

```js
await contract.queryFilter("Transfer", fromBlock, toBlock)
```

Ethers:

1. Looks up the event in your ABI.
2. Uses the topics to **filter only Transfer logs**.
3. Decodes the indexed topics & data field.
4. Returns them as **EventLog** objects.

---

## ⚙️ 5. Code breakdown

### Setup

```js
const URL = `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
const provider = new ethers.JsonRpcProvider(URL)
const contract = new ethers.Contract(ERC20_ADDRESS, ERC20_ABI, provider)
```

You connect to Ethereum Mainnet via Alchemy and load the USDC contract.

---

### Get the current block

```js
const block = await provider.getBlockNumber()
console.log("Current block number:", block)
```

---

### Query events from the last block

```js
const transferEvents = await contract.queryFilter("Transfer", block - 1, block)
```

This line does a lot:

* It tells Ethers to look for logs that match the `Transfer` event signature.
* In the range from `block - 1` to `block`.
* For every log that matches, Ethers decodes and returns an `EventLog` object.

---

### The result

```js
console.log(`Found ${transferEvents.length} Transfer events in block ${block}`);
console.log(transferEvents[0]);
```

So you get something like:

```
Found 113 Transfer events in block 23729788
```

That’s because **USDC has tons of transfers every block** — people, exchanges, bots, DeFi protocols, etc.

---

## 🧾 6. EventLog object explained

Here’s the breakdown of the printed object:

```js
EventLog {
  transactionHash: '0x20d4c7e56b30f04cd7fec55356a50361631c211bfa3ede6075205872fed3d495',
  blockNumber: 23729787,
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC contract
  topics: [ ... ], // event signature, from, to
  data: '0x...',   // amount (encoded)
  args: [
    '0xA69babEF1cA67A37Ffaf7a485DfFF3382056e78C', // from
    '0xE0554a476A092703abdB3Ef35c80e0D76d32939F', // to
    9921060542466n                                // amount
  ]
}
```

That means:

* **USDC tokens moved** from `0xA69b...` to `0xE055...`
* **Amount transferred:** 9921060542466 (≈ 9,921,060,542.466 USDC, because USDC has 6 decimals)

---

## ⚙️ 7. What `queryFilter` actually does under the hood

`queryFilter("Transfer", startBlock, endBlock)` sends an RPC call:

```json
{
  "method": "eth_getLogs",
  "params": [{
    "fromBlock": "0x169a3db",
    "toBlock": "0x169a3dc",
    "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "topics": ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"]
  }]
}
```

Then it decodes the raw logs into readable objects using your ABI.

---

## 🧠 TL;DR Summary

| Concept           | Meaning                                                                              |
| ----------------- | ------------------------------------------------------------------------------------ |
| **Event**         | A log entry emitted by a contract that records something that happened on-chain.     |
| **Emit**          | Smart contracts use `emit EventName(args...)` to record logs.                        |
| **Topics**        | Indexed fields (for efficient filtering/searching). Topic[0] = event signature hash. |
| **Data**          | Non-indexed fields (raw hex data).                                                   |
| **queryFilter()** | Reads past logs and decodes them using the ABI.                                      |

---

## 💡 Bonus: How to listen in real-time

Instead of fetching past logs, you can **subscribe** to events as they happen:

```js
contract.on("Transfer", (from, to, amount, event) => {
  console.log(`Transfer detected: ${from} -> ${to} | Amount: ${ethers.formatUnits(amount, 6)} USDC`);
});
```

That way, your script stays running and reacts live to blockchain activity.

---

## ✅ Final Output Interpretation

```
Found 113 Transfer events in block 23729788:
from: 0xA69babEF1cA67A37Ffaf7a485DfFF3382056e78C
to:   0xE0554a476A092703abdB3Ef35c80e0D76d32939F
amount: 9921060542466 (≈ 9.92 billion USDC)
```

So — your code is **successfully decoding real blockchain logs** for **USDC transfers** that happened in the latest block.

---

