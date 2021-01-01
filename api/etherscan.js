const { etherscanApiAddress, defaultRPCQueryParams } = require('./utils.js')

export const getTransactionByApi = (txhash, apikey) =>
    axios.get(etherscanApiAddress, { ...defaultRPCQueryParams, txhash, apikey })
export const getTransactionByEtherscanApi = (txhash) =>
    axios.get(etherscanApiAddress, { ...defaultRPCQueryParams, txhash, apikey: etherscanApiKey })

