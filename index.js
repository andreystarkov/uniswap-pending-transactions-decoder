const Web3 = require('web3');

const wsProviderAddress = 'ws://127.0.0.1:31337'
const httpProvider = 'http'
// const web3 = new Web3(wsProvider);


function test () {
    const webSocketProvider = new Web3.providers.WebsocketProvider(wsProviderAddress);

    const web3 = new Web3(webSocketProvider)
    console.log({ web3, ...web3.eth })
    const pending = web3.eth.getPendingTransactions()
    console.log({ pending })
    var subscription = web3.eth.subscribe('logs', {}, function (error, result) {
        if (!error)
            console.log(result);
    })
        .on("connected", function (subscriptionId) {
            console.log({ subscriptionId })
        })
        .on("data", function (log) {
            console.log({ log });
        })
        .on("changed", function (log) {
            console.log('changed', { log })
        });
}

test()
function watchEtherTransfers () {
    // Instantiate web3 with WebSocket provider
    const web3 = new Web3(new Web3.providers.WebsocketProvider(wsProviderAddress))

    // Instantiate subscription object
    const subscription = web3.eth.subscribe('pendingTransactions')
    console.log({ subscription })
    // Subscribe to pending transactions
    subscription.subscribe((error, result) => {
        if (error) console.log(error)
    })
        .on('data', async (txHash) => {
            console.log({ txHash })
            try {
                // Instantiate web3 with HttpProvider
                const web3Http = new Web3('https://rinkeby.infura.io/')

                // Get transaction details
                const trx = await web3Http.eth.getTransaction(txHash)
                console.log({ trx })
                const valid = validateTransaction(trx)
                // If transaction is not valid, simply return
                if (!valid) return

                console.log('Found incoming Ether transaction from ' + process.env.WALLET_FROM + ' to ' + process.env.WALLET_TO);
                console.log('Transaction value is: ' + process.env.AMOUNT)
                console.log('Transaction hash is: ' + txHash + '\n')

                // Initiate transaction confirmation
                confirmEtherTransaction(txHash)

                // Unsubscribe from pending transactions.
                subscription.unsubscribe()
            }
            catch (error) {
                console.log(error)
            }
        })
}
watchEtherTransfers()
// const pendingSubscription = web3.eth.subscribe('pendingTransactions', (error, result) => {
//     console.log({ error, result })
// }).on('data', transaction => {
//     console.log({ transaction })
// })
// const subscription = web3.on('data', data => console.log({ ...data }))

// console.log({ web3, subscription })
// // unsubscribes the subscription
// subscription.unsubscribe(function (error, success) {
//     if (success)
//         console.log('Successfully unsubscribed!');
// });