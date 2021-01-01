const Web3 = require('web3');
const Contract = require('web3-eth-contract')
const wsProviderAddress = 'ws://127.0.0.1:31337'
const uniswapV2RouterAbi = require('./uniswap/abi.json')
const uniswapV2RouterAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
const web3UniswapV2ContractProvider = new Contract(uniswapV2RouterAbi)

const infuraNodeAddress = 'https://mainnet.infura.io/v3/ff07ae588b834604b3ff84320349fc60'
const uniswapAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'

const web3LocalProvider = new Web3.providers.WebsocketProvider('ws://127.0.0.0:31337')
// const infuraLocalProvider = new Web3.providers.WebsocketProvider(infuraNodeAddress)
const web3 = new Web3(web3LocalProvider)
console.log({ web3 })

// console.log({ web3UniswapV2ContractProvider })

const defaultRPCQueryParams = { module: 'proxy', action: 'eth_getTransactionByHash' }

const etherscanApiAddress = 'https://api.etherscan.io/api'
const etherscanApiKey = 'EBE8TMKV2KDY19QBKISQAEQR89M5RBVZAD'

const getTransactionByApi = (txhash, apikey) => axios.get(etherscanApiAddress, { ...defaultRPCQueryParams, txhash, apikey })
const getTransactionByEtherscanApi = (txhash) =>    
    axios.get(etherscanApiAddress, { ...defaultRPCQueryParams, txhash, apikey: etherscanApiKey })
 

function watchEtherTransfers () {
    const subscription = web3.eth.subscribe('pendingTransactions')
    subscription.subscribe((error, result) => {
        if (error) console.log('Subscription error', { error })
    }).on('data', async (txHash) => {
            console.log({ txHash })
            try {
                const web3Http = new Web3(web3UniswapV2ContractProvider)
                const trx = await web3.eth.getTransaction(txHash)
                console.log({ trx })
                if (trx.to === uniswapAddress) {
                    const uniswapTransactionRoutes = web3.eth.abi.decodeParameter('address[]', trx.input)
                    const uniswapTransaction = getTransactionByEtherscanApi(txHash)
                    console.log({ uniswapTransactionRoutes, uniswapTransaction })
                }
            }
            catch (error) {
                console.log({ error })
            }
        })
}

watchEtherTransfers()
