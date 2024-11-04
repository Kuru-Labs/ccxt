import kuru from "../../kuru";
import { parseEther } from "../../static_dependencies/ethers/utils";
// eslint-disable-next-line no-undef
async function kuruTest() {
    const exchange = new kuru({
        'walletAddress': '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        'privateKey': '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
    });
    // await fetchMarketsTest (exchange);
    // await fetchOrderBookTest (exchange);
    // await fetchOHLCVTest (exchange);
    await createMarketOrderTest(exchange);
    // await fetchMyTradesTest (exchange);
    // await fetchOpenOrdersTest (exchange);
    // await testFetchClosedOrders (exchange);
    // await testFetchCancelledOrders (exchange);
    // await testDeposit (exchange);
}
async function fetchMarketsTest(exchange) {
    const markets = await exchange.fetchMarkets();
    console.log('markets:', markets);
}
async function fetchOrderBookTest(exchange) {
    const orderbook = await exchange.fetchOrderBook('ETH/BTC', 50, { 'marketAddress': '0x6620454f509ce29875953ecdb1765E8Bf54422CC' });
    console.log('orderbook:', orderbook);
}
async function fetchOHLCVTest(exchange) {
    const startTime = 1726251093172;
    console.log('startTime:', startTime);
    const ohlcv = await exchange.fetchOHLCV('ETH/BTC', '1m', startTime, 10, { 'marketAddress': '0x6620454f509ce29875953ecdb1765E8Bf54422CC' });
    console.log('ohlcv:', ohlcv);
}
async function createLimitOrderTest(exchange) {
    const createdOrderData = await exchange.createOrder('ETH/BTC', 'limit', 'sell', 1000, 100, { 'marketAddress': '0x6620454f509ce29875953ecdb1765E8Bf54422CC', 'isMargin': false, 'isFillOrKill': true, 'minAmountOut': 0, 'postOnly': false });
    console.log(createdOrderData);
}
async function createMarketOrderTest(exchange) {
    const createdOrderData = await exchange.createOrder('ETH/BTC', 'market', 'sell', 1000, undefined, { 'marketAddress': '0x6620454f509ce29875953ecdb1765E8Bf54422CC', 'isMargin': false, 'isFillOrKill': true, 'minAmountOut': 0 });
    console.log(createdOrderData);
}
async function fetchMyTradesTest(exchange) {
    const startTime = 1726251093172;
    const myTrades = await exchange.fetchMyTrades('ETH/BTC', startTime, 10, { 'marketAddress': '0x6620454f509ce29875953ecdb1765E8Bf54422CC' });
    console.log(myTrades);
}
async function fetchOpenOrdersTest(exchange) {
    const startTime = 1726251093172;
    const openOrders = await exchange.fetchOpenOrders('ETH/BTC', startTime, 50, { 'marketAddress': '0x6620454f509ce29875953ecdb1765E8Bf54422CC' });
    console.log(openOrders);
}
async function testFetchClosedOrders(exchange) {
    const closedOrders = await exchange.fetchClosedOrders('ETH/BTC', 1726251093172, 10, { 'marketAddress': '0x6620454f509ce29875953ecdb1765E8Bf54422CC' });
    console.log(closedOrders);
}
async function testFetchCancelledOrders(exchange) {
    const cancelledOrders = await exchange.fetchCancelledOrders('ETH/BTC', 1726251093172, 10, { 'marketAddress': '0x6620454f509ce29875953ecdb1765E8Bf54422CC' });
    console.log(cancelledOrders);
}
async function testDeposit(exchange) {
    const depositData = await exchange.deposit(BigInt(parseEther('1')), '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', { 'marginAccount': '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318' });
    console.log(depositData);
}
kuruTest().then(console.log);
