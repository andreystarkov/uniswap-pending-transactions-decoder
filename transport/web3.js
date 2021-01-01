const Web3 = require('web3');
const Contract = require('web3-eth-contract')
const { uniswapV2RouterAbiPath, web3LocalAddress, infuraNodeAddress } = require('./config.js')

const web3LocalProvider = new Web3.providers.WebsocketProvider(web3LocalAddress)
const infuraLocalProvider = new Web3.providers.WebsocketProvider(infuraNodeAddress)
const web3 = new Web3(web3LocalProvider)
const uniswapContract = new Contract(require(uniswapV2RouterAbiPath))
