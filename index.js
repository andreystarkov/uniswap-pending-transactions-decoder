const Web3 = require('web3');
const Contract = require('web3-eth-contract')
const wsLocalProviderAddress = 'ws://[::]:8546' 
const uniswapV2RouterAbi = require('./transport/uniswap/abi.json')
const uniswapV2RouterAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
const web3UniswapV2ContractProvider = new Contract(uniswapV2RouterAbi)

const infuraNodeAddress = 'https://mainnet.infura.io/v3/ff07ae588b834604b3ff84320349fc60'
const INFURA_WS_PROVIDER = 'wss://mainnet.infura.io/ws/v3/ff07ae588b834604b3ff84320349fc60'
const uniswapAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'

const web3LocalProvider = new Web3.providers.WebsocketProvider(wsLocalProviderAddress)
// const infuraLocalProvider = new Web3.providers.WebsocketProvider(infuraNodeAddress)
const web3 = new Web3(web3LocalProvider)
// console.log({ web3 })

console.log({ web3UniswapV2ContractProvider })

const defaultRPCQueryParams = { module: 'proxy', action: 'eth_getTransactionByHash' }

const etherscanApiAddress = 'https://api.etherscan.io/api'
const etherscanApiKey = 'EBE8TMKV2KDY19QBKISQAEQR89M5RBVZAD'

const getTransactionByApi = (txhash, apikey) => axios.get(etherscanApiAddress, { ...defaultRPCQueryParams, txhash, apikey })
const getTransactionByEtherscanApi = (txhash) =>    
    axios.get(etherscanApiAddress, { ...defaultRPCQueryParams, txhash, apikey: etherscanApiKey })
 

async function watchEtherTransfers () {
    const subscription = web3.eth.subscribe('pendingTransactions')
    console.log({ subscription })
    const pendingTransactions = await web3.eth.getPendingTransactions()
    // const p = await pendingTransactions()
    const pTransactions = web3.eth.pendingTransactions

    // const p = await pendingTransactions()
    console.log({ pendingTransactions, pTransactions })
    subscription.subscribe((error, result) => {
        if (error) console.log('Subscription error', { error })
    }).on('data', async (txHash) => {
            try {
                // const web3Http = new Web3(web3UniswapV2ContractProvider)
                const trx = await web3.eth.getTransaction(txHash)
                if (trx.to === uniswapV2RouterAddress) {
                    console.log({ trx })
                    const uniswapTransactionRoutes = web3UniswapV2ContractProvider.abi.decodeParameter('address[]', trx.input)
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
