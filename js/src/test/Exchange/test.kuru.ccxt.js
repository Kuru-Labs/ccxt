// eslint-disable-next-line no-shadow
import { setTimeout } from 'timers/promises';
import ccxt from '../../../ccxt';
class TradingBot {
    constructor(exchangeId, _config) {
        this.lastPrice = 0;
        this.inPosition = false;
        this.exchange = new ccxt[exchangeId]({
            'walletAddress': '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
            'privateKey': '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
        });
        this.config = _config;
    }
    async fetchOHLCV() {
        try {
            const startTime = 1726251093172;
            const ohlcv = await this.exchange.fetchOHLCV('ETH/BTC', '1m', startTime, 10, { 'marketAddress': '0x6620454f509ce29875953ecdb1765E8Bf54422CC' });
            return ohlcv;
        }
        catch (error) {
            console.error('Error fetching OHLCV:', error);
            return [];
        }
    }
    calculateRSI(closePrices) {
        let gains = 0;
        let losses = 0;
        for (let i = 1; i < closePrices.length; i++) {
            const difference = closePrices[i] - closePrices[i - 1];
            if (difference >= 0) {
                gains += difference;
            }
            else {
                losses -= difference;
            }
        }
        const avgGain = gains / this.config.rsiPeriod;
        const avgLoss = losses / this.config.rsiPeriod;
        if (avgLoss === 0) {
            return 100;
        }
        const rs = avgGain / avgLoss;
        return 100 - (100 / (1 + rs));
    }
    async placeBuyOrder() {
        console.log('Placing Buy Order');
        try {
            const order = await this.exchange.createOrder('ETH/BTC', 'market', 'sell', 1000, undefined, { 'marketAddress': '0x6620454f509ce29875953ecdb1765E8Bf54422CC',
                'isMargin': false,
                'isFillOrKill': true,
                'minAmountOut': 0 });
            console.log('Buy order placed:', order);
            this.inPosition = true;
        }
        catch (error) {
            console.error('Error placing buy order:', error);
        }
    }
    async placeSellOrder() {
        console.log('Placing Sell Order');
        try {
            const order = await this.exchange.createOrder(this.config.symbol, 'market', 'sell', this.config.tradeAmount, undefined, { 'marketAddress': '0x6620454f509ce29875953ecdb1765E8Bf54422CC', 'isMargin': false, 'isFillOrKill': true, 'minAmountOut': 0 });
            console.log('Sell order placed:', order);
            this.inPosition = false;
        }
        catch (error) {
            console.error('Error placing sell order:', error);
        }
    }
    async start() {
        console.log('Starting trading bot...');
        // eslint-disable-next-line no-constant-condition
        while (true) {
            try {
                const ohlcv = await this.fetchOHLCV();
                if (ohlcv.length === 0)
                    continue;
                const closePrices = ohlcv.map((candle) => candle[4]);
                const currentPrice = closePrices[closePrices.length - 1];
                const rsi = this.calculateRSI(closePrices);
                console.log(`Current price: ${currentPrice}, RSI: ${rsi}`);
                if (rsi < this.config.rsiOversold && !this.inPosition) {
                    console.log('Oversold - Placing buy order');
                    await this.placeBuyOrder();
                }
                else if (rsi > this.config.rsiOverbought && this.inPosition) {
                    console.log('Overbought - Placing sell order');
                    await this.placeSellOrder();
                }
                this.lastPrice = currentPrice;
                await setTimeout(1000); // Wait for 1 minute before next iteration
            }
            catch (error) {
                console.error('Error in main loop:', error);
                await setTimeout(1000);
            }
        }
    }
}
// Example usage
const config = {
    "symbol": 'BTC/USDT',
    "timeframe": '5m',
    "rsiPeriod": 14,
    "rsiOverbought": 0,
    "rsiOversold": 1000,
    "tradeAmount": 100,
    "tradePrice": 1000,
};
// Create and start the bot
const bot = new TradingBot('kuru', config);
bot.start().catch(console.error);
