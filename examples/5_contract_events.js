require("dotenv").config()
const { ethers } = require("ethers")

// Setup connection
const URL = `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
const provider = new ethers.JsonRpcProvider(URL)

// Define "Application Binary Interface"
const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",

  "event Transfer(address indexed from, address indexed to, uint amount)"
  // uint is an alias for uint256
  // indexed parameters make it easier to search for events from these arguments, these indexed parameters are stored in a special data structure called "topics"
  // you can index up to 3 parameters
  // topic[0] is always the event signature(it is automatically indexed and is hash of the event name and parameter types)

];

// Setup contract
const ERC20_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' // USDC Contract
const contract = new ethers.Contract(ERC20_ADDRESS, ERC20_ABI, provider)

const main = async () => {
  // Get block number
  const block = await provider.getBlockNumber()
  console.log("Current block number:", block)

  // Query events
  const transferEvents = await contract.queryFilter("Transfer", block - 1, block);
  console.log(`Found ${transferEvents.length} Transfer events in block ${block}:`);
  console.log(transferEvents[0]);
}

main()


//// OUTPUT:

// ❯ node examples/5_contract_events.js      
// Current block number: 23729788
// Found 113 Transfer events in block 23729788:
// EventLog {
//   provider: JsonRpcProvider {},
//   transactionHash: '0x20d4c7e56b30f04cd7fec55356a50361631c211bfa3ede6075205872fed3d495',
//   blockHash: '0x60cdd98e978e22d09a3131767409345fa3015b9d6b10bffeb7c8352990d5d2f7',
//   blockNumber: 23729787,
//   removed: false,
//   address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
//   data: '0x00000000000000000000000000000000000000000000000000000905ed4a1802',
//   topics: [
//     '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
//     '0x000000000000000000000000a69babef1ca67a37ffaf7a485dfff3382056e78c',
//     '0x000000000000000000000000e0554a476a092703abdb3ef35c80e0d76d32939f'
//   ],
//   index: 9,
//   transactionIndex: 3,
//   interface: Interface {
//     fragments: [
//       [FunctionFragment],
//       [FunctionFragment],
//       [FunctionFragment],
//       [FunctionFragment],
//       [EventFragment]
//     ],
//     deploy: ConstructorFragment {
//       type: 'constructor',
//       inputs: [],
//       payable: false,
//       gas: null
//     },
//     fallback: null,
//     receive: false
//   },
//   fragment: EventFragment {
//     type: 'event',
//     inputs: [ [ParamType], [ParamType], [ParamType] ],
//     name: 'Transfer',
//     anonymous: false
//   },
//   args: Result(3) [
//     '0xA69babEF1cA67A37Ffaf7a485DfFF3382056e78C',
//     '0xE0554a476A092703abdB3Ef35c80e0D76d32939F',
//     9921060542466n
//   ]
// }

//  ~/Desktop/learn_ether_js  starter_code !5 ······································································································· system ⬢  06:50:44 
// ❯ 