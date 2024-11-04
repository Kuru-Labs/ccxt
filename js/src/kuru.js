import Exchange from './abstract/kuru.js';
import { InvalidOrder, OrderNotFound, } from './base/errors.js';
import { DECIMAL_PLACES, } from './base/functions/number.js';
import { keccak_256 as keccak } from './static_dependencies/noble-hashes/sha3.js';
import { secp256k1 } from './static_dependencies/noble-curves/secp256k1.js';
import { ecdsa } from './base/functions/crypto.js';
// eslint-disable-next-line no-shadow
import fetch from './static_dependencies/node-fetch/index.js';
import { Interface } from './static_dependencies/ethers/index.js';
import { hexToBytes } from './static_dependencies/noble-hashes/utils.js';
import { AbiCoder } from './static_dependencies/ethers/abi-coder.js';
export default class kuru extends Exchange {
    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'kuru',
            'name': 'Kuru',
            'countries': [],
            'version': 'v1',
            'rateLimit': 50,
            'certified': false,
            'pro': true,
            'dex': true,
            'has': {
                'CORS': undefined,
                'spot': true,
                'margin': false,
                'swap': false,
                'future': false,
                'option': false,
                'addMargin': false,
                'borrowCrossMargin': false,
                'borrowIsolatedMargin': false,
                'cancelAllOrders': false,
                'cancelAllOrdersAfter': false,
                'cancelOrder': false,
                'cancelOrders': true,
                'cancelOrdersForSymbols': true,
                'closeAllPositions': false,
                'closePosition': false,
                'createMarketBuyOrderWithCost': false,
                'createMarketOrderWithCost': false,
                'createMarketSellOrderWithCost': false,
                'createOrder': false,
                'createOrders': false,
                'createReduceOnlyOrder': true,
                'editOrder': false,
                'fetchAccounts': false,
                'fetchBalance': false,
                'fetchBorrowInterest': false,
                'fetchBorrowRateHistories': false,
                'fetchBorrowRateHistory': false,
                'fetchCanceledAndClosedOrders': false,
                'fetchCanceledOrders': false,
                'fetchClosedOrders': false,
                'fetchCrossBorrowRate': false,
                'fetchCrossBorrowRates': false,
                'fetchCurrencies': false,
                'fetchDepositAddress': false,
                'fetchDepositAddresses': false,
                'fetchDeposits': false,
                'fetchDepositWithdrawFee': 'emulated',
                'fetchDepositWithdrawFees': false,
                'fetchFundingHistory': false,
                'fetchFundingRate': false,
                'fetchFundingRateHistory': false,
                'fetchFundingRates': false,
                'fetchIndexOHLCV': false,
                'fetchIsolatedBorrowRate': false,
                'fetchIsolatedBorrowRates': false,
                'fetchLedger': false,
                'fetchLeverage': false,
                'fetchLeverageTiers': false,
                'fetchLiquidations': false,
                'fetchMarginMode': undefined,
                'fetchMarketLeverageTiers': false,
                'fetchMarkets': true,
                'fetchMarkOHLCV': false,
                'fetchMyLiquidations': false,
                'fetchMyTrades': true,
                'fetchOHLCV': true,
                'fetchOpenInterest': false,
                'fetchOpenInterestHistory': false,
                'fetchOpenOrders': true,
                'fetchOrder': true,
                'fetchOrderBook': true,
                'fetchOrders': true,
                'fetchOrderTrades': false,
                'fetchPosition': true,
                'fetchPositionMode': false,
                'fetchPositions': true,
                'fetchPositionsRisk': false,
                'fetchPremiumIndexOHLCV': false,
                'fetchTicker': 'emulated',
                'fetchTickers': true,
                'fetchTime': false,
                'fetchTrades': true,
                'fetchTradingFee': true,
                'fetchTradingFees': false,
                'fetchTransfer': false,
                'fetchTransfers': false,
                'fetchWithdrawal': false,
                'fetchWithdrawals': true,
                'reduceMargin': true,
                'repayCrossMargin': false,
                'repayIsolatedMargin': false,
                'sandbox': true,
                'setLeverage': true,
                'setMarginMode': true,
                'setPositionMode': false,
                'transfer': true,
                'withdraw': true,
            },
            'timeframes': {
                '1s': '1s',
                '1m': '1m',
                '5m': '5m',
                '15m': '15m',
                '1h': '1h',
                '1d': '1d',
            },
            'hostname': 'kuru.io',
            'urls': {
                'logo': 'https://github.com/ccxt/ccxt/assets/43336371/b371bc6c-4a8c-489f-87f4-20a913dd8d4b',
                'api': {
                    // 'public': 'https://api.{hostname}',
                    // 'private': 'https://api.{hostname}',
                    'public': 'http://127.0.0.1:9090/',
                    'private': 'http://127.0.0.1:9090/',
                },
                'test': {
                    'public': 'http://127.0.0.1:9090/',
                    'private': 'http://127.0.0.1:9090/',
                },
                'www': 'https://kuru.io',
                'doc': 'https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api',
                'fees': 'https://hyperliquid.gitbook.io/hyperliquid-docs/trading/fees',
                'referral': 'https://app.hyperliquid.xyz/',
            },
            'api': {
                'public': {
                    'get': {
                        '/': 1,
                        'fetchMarkets': 1,
                        'fetchOrders': 1,
                        'fetchOrderbook': 1,
                        'fetchOrder': 1,
                        'fetchTrades': 1,
                        'fetchOHLCV': 1,
                    },
                },
                'private': {
                    'get': {
                        'fetchOpenOrders': 1,
                        'fetchClosedOrders': 1,
                        'fetchStatus': 1,
                        'fetchMyTrades': 1,
                    },
                    'post': {
                        'createOrder': 1,
                        'cancelOrder': 1,
                    },
                },
            },
            'fees': {
                'swap': {
                    'taker': this.parseNumber('0.00035'),
                    'maker': this.parseNumber('0.0001'),
                },
                'spot': {
                    'taker': this.parseNumber('0.00035'),
                    'maker': this.parseNumber('0.0001'),
                },
            },
            'requiredCredentials': {
                'apiKey': false,
                'secret': false,
                'walletAddress': true,
                'privateKey': true,
            },
            'exceptions': {
                'exact': {},
                'broad': {
                    'Price must be divisible by tick size.': InvalidOrder,
                    'Order must have minimum value of $10': InvalidOrder,
                    'Insufficient margin to place order.': InvalidOrder,
                    'Reduce only order would increase position.': InvalidOrder,
                    'Post only order would have immediately matched,': InvalidOrder,
                    'Order could not immediately match against any resting orders.': InvalidOrder,
                    'Invalid TP/SL price.': InvalidOrder,
                    'No liquidity available for market order.': InvalidOrder,
                    'Order was never placed, already canceled, or filled.': OrderNotFound,
                    'User or API Wallet ': InvalidOrder,
                    'Order has invalid size': InvalidOrder,
                    'Order price cannot be more than 80% away from the reference price': InvalidOrder,
                },
            },
            'precisionMode': DECIMAL_PLACES,
            'commonCurrencies': {},
            'options': {
                'defaultType': 'swap',
                'sandboxMode': false,
                'defaultSlippage': 0.05,
                // TODO: Change this to testnet/mainnet address
                'kuruForwarder': '0x0165878A594ca255338adfa4d48449f69242Eb8F',
                'chainId': '31337',
            },
        });
    }
    setSandboxMode(enabled) {
        super.setSandboxMode(enabled);
        this.options['sandboxMode'] = enabled;
    }
    async fetchMarkets(params = {}) {
        /**
         * @method
         * @name kuru#fetchMarkets
         * @description retrieves data on all markets for kuru
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {Market[]} an array of objects representing market data
         */
        const markets = await this.fetchData('fetchMarkets', {});
        return this.parseMarkets(markets['data']);
    }
    parseMarkets(apiResponse) {
        const markets = apiResponse.map((marketData) => {
            const market = {
                'id': this.safeString(marketData, 'market_address'),
                'symbol': this.safeString(marketData, 'symbol'),
                'base': this.safeString(marketData, 'base'),
                'quote': this.safeString(marketData, 'quote'),
                'baseId': this.safeString(marketData, 'base_address'),
                'quoteId': this.safeString(marketData, 'quote_address'),
                'settleId': undefined,
                'type': 'spot',
                'subType': undefined,
                'spot': true,
                'margin': false,
                'swap': false,
                'future': false,
                'option': false,
                'contract': false,
                'linear': undefined,
                'inverse': undefined,
                'quanto': false,
                'settle': undefined,
                'contractSize': undefined,
                'expiry': undefined,
                'expiryDatetime': undefined,
                'optionType': undefined,
                'active': true,
                'marginModes': {
                    'isolated': false,
                    'cross': false,
                },
                'taker': this.safeNumber(marketData, 'taker_fee_bps'),
                'maker': this.safeNumber(marketData, 'maker_fee_bps'),
                'percentage': false,
                'tierBased': false,
                'feeSide': undefined,
                'precision': {
                    'price': this.parsePricePrecision(marketData['precision']['price']),
                    'amount': Number(marketData['precision']['price']),
                    'cost': undefined,
                },
                'limits': {
                    'leverage': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'amount': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'price': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'cost': {
                        'min': undefined,
                        'max': undefined,
                    },
                },
                'created': marketData['created'],
                'info': 'none',
                'strike': undefined,
            };
            return market;
        });
        return markets;
    }
    async fetchOrderBook(symbol, limit = undefined, params = {}) {
        const marketAddress = params['marketAddress'];
        if (!marketAddress) {
            throw new Error('marketAddress is required');
        }
        const request = {
            'marketAddress': marketAddress,
            'limit': limit,
        };
        const response = await this.fetchData('/fetchOrderbook', request);
        return this.parseOrderBook(response);
    }
    parseOrderBook(apiResponse) {
        const orderbook = {
            'asks': apiResponse['asks'],
            'bids': apiResponse['bids'],
            'datetime': apiResponse['datetime'],
            'timestamp': apiResponse['timestamp'],
            'symbol': apiResponse['symbol'],
            'nonce': undefined,
        };
        return orderbook;
    }
    async fetchOHLCV(symbol, timeframe = '1m', since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name kuru#fetchOHLCV
         * @description retrieves OHLCV (Open, High, Low, Close, Volume) data for a specific market
         * @param {string} symbol the symbol of the market to fetch OHLCV data for
         * @param {string} [timeframe='1m'] the timeframe to fetch OHLCV data for
         * @param {Int} [since] the timestamp to fetch OHLCV data from
         * @param {Int} [limit] the maximum number of OHLCV data points to fetch
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {OHLCV[]} an array of OHLCV data points
         * @throws {Error} if marketAddress or since is not provided in params
         */
        const marketAddressOHLCV = params['marketAddress'];
        if (!marketAddressOHLCV) {
            throw new Error('marketAddress is required');
        }
        if (!since) {
            throw new Error('since is required');
        }
        const request = {
            'marketAddress': marketAddressOHLCV,
            'timeframe': timeframe,
            'since': since,
        };
        const response = await this.fetchData('/fetchOHLCV', request);
        return this.parseOHLCVData(response);
    }
    parseOHLCVData(apiResponse) {
        const ohlcv = apiResponse.map((ohlcvData) => [ohlcvData['start_time'],
            ohlcvData['open'],
            ohlcvData['high'],
            ohlcvData['low'],
            ohlcvData['close'],
            ohlcvData['volume']]);
        return ohlcv;
    }
    async fetchOrder(id, symbol = undefined, params = {}) {
        /**
         * @method
         * @name kuru#fetchOrder
         * @description retrieves data on a specific order for kuru
         * @param {string} id the ID of the order to fetch
         * @param {string} [symbol] the symbol of the market to fetch the order for
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {Order} an object representing the order data
         * @throws {Error} if marketAddress is not provided in params
         */
        const marketAddress = params['marketAddress'];
        if (!marketAddress) {
            throw new Error('marketAddress is required');
        }
        const request = {
            'marketAddress': marketAddress,
            'orderId': id,
        };
        const response = await this.fetchData('fetchOrder', request);
        return this.parseOrder(response);
    }
    async fetchOpenOrders(symbol, since, limit, params) {
        const marketAddress = params['marketAddress'];
        if (!marketAddress) {
            throw new Error('marketAddress is required');
        }
        const request = {
            'marketAddress': marketAddress,
            'userAddress': this.walletAddress,
            'since': since,
            'limit': limit,
            'offset': params['offset'] ? params['offset'] : 0,
        };
        const response = await this.fetchData('fetchOpenOrders', request);
        const openOrders = response['data'].map((orderData) => this.parseOrder(orderData));
        return openOrders; // TODO: Parse orders
    }
    async fetchClosedOrders(symbol, since, limit, params) {
        /**
         * @method
         * @name kuru#fetchOrder
         * @description retrieves data on a specific order for kuru
         * @param {string} id the ID of the order to fetch
         * @param {string} [symbol] the symbol of the market to fetch the order for
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {Order} an object representing the order data
         * @throws {Error} if marketAddress is not provided in params
         */
        const marketAddress = params['marketAddress'];
        if (!marketAddress) {
            throw new Error('marketAddress is required');
        }
        const request = {
            'marketAddress': marketAddress,
            'userAddress': this.walletAddress,
            'since': since,
            'limit': limit,
            'offset': params['offset'] ? params['offset'] : 0,
        };
        const response = await this.fetchData('fetchClosedOrders', request);
        const closedOrders = response['data'].map((orderData) => this.parseOrder(orderData));
        return closedOrders;
    }
    async fetchCancelledOrders(symbol, since, limit, params) {
        /**
         * @method
         * @name kuru#fetchOrder
         * @description retrieves data on a specific order for kuru
         * @param {string} id the ID of the order to fetch
         * @param {string} [symbol] the symbol of the market to fetch the order for
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {Order} an object representing the order data
         * @throws {Error} if marketAddress is not provided in params
         */
        const marketAddress = params['marketAddress'];
        if (!marketAddress) {
            throw new Error('marketAddress is required');
        }
        const request = {
            'marketAddress': marketAddress,
            'userAddress': this.walletAddress,
            'since': since,
            'limit': limit,
            'offset': params['offset'] ? params['offset'] : 0,
        };
        const response = await this.fetchData('fetchCancelledOrders', request);
        const cancelledOrders = response['data'].map((orderData) => this.parseOrder(orderData));
        return cancelledOrders;
    }
    async fetchStatus(params) {
        /**
         * @method
         * @name kuru#fetchStatus
         * @description retrieves the status of a specific order for kuru
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {string} params.marketAddress the address of the market
         * @param {string} params.orderId the ID of the order to fetch the status for
         * @returns {any} the status of the order
         * @throws {Error} if marketAddress or orderId is not provided in params
         */
        const marketAddress = params['marketAddress'];
        if (!marketAddress) {
            throw new Error('marketAddress is required');
        }
        const orderId = params['orderId'];
        if (!orderId) {
            throw new Error('orderId is required');
        }
        const request = {
            'marketAddress': marketAddress,
            'orderId': orderId,
        };
        const response = await this.fetchData('fetchStatus', request);
        return response;
    }
    parseOrder(orderData) {
        let status;
        if (orderData['is_cancelled']) {
            status = 'canceled';
        }
        else if (orderData['remaining_size'] === 0) {
            status = 'closed';
        }
        else {
            status = 'open';
        }
        const order = {
            'id': orderData['order_id'],
            'symbol': orderData['symbol'],
            'trades': undefined,
            'reduceOnly': false,
            'postOnly': false,
            'type': 'limit',
            'side': orderData['is_buy'] ? 'buy' : 'sell',
            'price': orderData['price'],
            'amount': orderData['size'],
            'cost': undefined,
            'filled': orderData['filled'],
            'remaining': orderData['size'] - orderData['remaining_size'],
            'status': status,
            'timestamp': orderData['trigger_time'],
            'datetime': orderData['trigger_time'],
            'fee': orderData['fee'],
            'info': undefined,
            'clientOrderId': orderData['order_id'],
            'lastTradeTimestamp': 0,
        };
        return order;
    }
    async fetchTrades(symbol, since, limit, params) {
        /**
         * @method
         * @name kuru#fetchTrades
         * @description retrieves trade data for a specific market
         * @param {string} symbol the symbol of the market to fetch trades for
         * @param {Int} [since] the timestamp to fetch trades from
         * @param {Int} [limit] the maximum number of trades to fetch
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {Trade[]} an array of objects representing trade data
         * @throws {Error} if marketAddress is not provided in params
         */
        const marketAddress = params['marketAddress'];
        if (!marketAddress) {
            throw new Error('marketAddress is required');
        }
        const request = {
            'marketAddress': marketAddress,
            'since': since,
            'limit': limit,
            'offset': params['offset'] ? params['offset'] : 0,
        };
        const response = await this.fetchData('fetchTrades', request);
        const trades = response['data'].map((tradeData) => this.parseTrade(tradeData));
        return trades;
    }
    async fetchMyTrades(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name kuru#fetchTrades
         * @description retrieves trade data for a specific market
         * @param {string} symbol the symbol of the market to fetch trades for
         * @param {Int} [since] the timestamp to fetch trades from
         * @param {Int} [limit] the maximum number of trades to fetch
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {Trade[]} an array of objects representing trade data
         * @throws {Error} if marketAddress is not provided in params
         */
        const marketAddress = params['marketAddress'];
        if (!marketAddress) {
            throw new Error('marketAddress is required');
        }
        const request = {
            'marketAddress': marketAddress,
            'userAddress': this.walletAddress,
            'since': since,
            'limit': limit,
            'offset': params['offset'] ? params['offset'] : 0,
        };
        const response = await this.fetchData('fetchMyTrades', request);
        const myTrades = response['data'].map((tradeData) => this.parseTrade(tradeData));
        return myTrades;
    }
    parseTrade(tradeData) {
        const trade = {
            'info': undefined,
            'amount': tradeData['filledSize'],
            'datetime': tradeData['trigger_time'],
            'id': tradeData['order_id'],
            'price': tradeData['price'],
            'timestamp': new Date(tradeData['trigger_time']).getTime(),
            'type': undefined,
            'side': tradeData['is_buy'] ? 'buy' : 'sell',
            'symbol': tradeData['symbol'],
            'cost': undefined,
            'fee': undefined,
            'order': tradeData['order_id'],
            'takerOrMaker': undefined,
        };
        return trade;
    }
    async createOrder(symbol, type, side, amount, price, params) {
        /**
         * @method
         * @name kuru#createOrder
         * @description creates a new order for a specific market
         * @param {string} symbol the symbol of the market to create the order for
         * @param {OrderType} type the type of the order (limit or market)
         * @param {OrderSide} side the side of the order (buy or sell)
         * @param {number} amount the amount of the order
         * @param {Num} [price] the price of the order (required for limit orders)
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {Order} an object representing the created order
         * @throws {Error} if required parameters for the order type are not provided
         */
        if (type === 'limit') {
            if (!price) {
                throw new Error('Price is required for limit orders');
            }
            if (params['postOnly'] === undefined) {
                throw new Error('postOnly is required for limit orders');
            }
        }
        else if (type === 'market') {
            if (params['isMargin'] === undefined) {
                throw new Error('isMargin is required for market orders');
            }
            if (params['isFillOrKill'] === undefined) {
                throw new Error('isFillOrKill is required for market orders');
            }
            if (params['minAmountOut'] === undefined) {
                throw new Error('minAmountOut is required for market orders');
            }
        }
        else {
            throw new Error('Invalid order type');
        }
        // Configure function call and message types based on order type and side
        const orderConfig = {
            'limit': {
                'buy': {
                    'functionCall': 'addBuyOrder',
                    'messageTypes': [
                        { 'name': '_price', 'type': 'uint24' },
                        { 'name': 'size', 'type': 'uint96' },
                        { 'name': '_postOnly', 'type': 'bool' },
                    ],
                },
                'sell': {
                    'functionCall': 'addSellOrder',
                    'messageTypes': [
                        { 'name': '_price', 'type': 'uint24' },
                        { 'name': 'size', 'type': 'uint96' },
                        { 'name': '_postOnly', 'type': 'bool' },
                    ],
                },
            },
            'market': {
                'buy': {
                    'functionCall': 'placeAndExecuteMarketBuy',
                    'messageTypes': [
                        { 'name': '_quoteSize', 'type': 'uint24' },
                        { 'name': '_minAmountOut', 'type': 'uint256' },
                        { 'name': '_isMargin', 'type': 'bool' },
                        { 'name': '_isFillOrKill', 'type': 'bool' },
                    ],
                },
                'sell': {
                    'functionCall': 'placeAndExecuteMarketSell',
                    'messageTypes': [
                        { 'name': '_size', 'type': 'uint96' },
                        { 'name': '_minAmountOut', 'type': 'uint256' },
                        { 'name': '_isMargin', 'type': 'bool' },
                        { 'name': '_isFillOrKill', 'type': 'bool' },
                    ],
                },
            },
        };
        // Get configuration for current order type and side
        const config = orderConfig[type][side];
        // Create function signature and encode data
        const functionSignature = `function ${config.functionCall}(${config.messageTypes.map((param) => `${param.type} ${param.name}`).join(', ')})`;
        const iface = new Interface([functionSignature]);
        // Prepare parameters based on order type
        const parameters = type === 'limit'
            ? [price, amount, params['postOnly']]
            : [amount, params['minAmountOut'], params['isMargin'], params['isFillOrKill']];
        const encodedData = iface.encodeFunctionData(config.functionCall, parameters);
        const forwardRequestData = this.createForwardRequestData(params['marketAddress'], encodedData);
        const response = await this.postData('createOrder', forwardRequestData);
        const order = this.parseCreatedOrderResponse(response, type, side, price, amount, params['postOnly']);
        return order;
    }
    parseCreatedOrderResponse(response, orderType, orderSide, price, amount, postOnly) {
        const order = {
            'id': response['order_id'],
            'clientOrderId': response['order_id'],
            'datetime': new Date().toISOString(),
            'timestamp': new Date().getTime(),
            'lastTradeTimestamp': undefined,
            'status': 'open',
            'symbol': response['symbol'],
            'type': orderType,
            'timeInForce': undefined,
            'side': orderSide,
            'average': undefined,
            'price': price,
            'amount': amount,
            'filled': undefined,
            'remaining': undefined,
            'stopPrice': undefined,
            'triggerPrice': undefined,
            'takeProfitPrice': undefined,
            'stopLossPrice': undefined,
            'cost': undefined,
            'trades': undefined,
            'fee': undefined,
            'reduceOnly': undefined,
            'postOnly': postOnly,
            'info': response,
        };
        return order;
    }
    async createOrders(orders, params) {
        /**
         * @method
         * @name kuru#createOrders
         * @description creates multiple new orders for a specific market
         * @param {OrderRequest[]} orders an array of order requests to create
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {string} params.marketAddress the address of the market
         * @param {boolean} params.postOnly whether the orders should be post-only
         * @returns {any} the response from the exchange API
         * @throws {Error} if marketAddress or postOnly is not provided in params
         */
        const marketAddress = params['marketAddress'];
        if (!marketAddress) {
            throw new Error('marketAddress is required');
        }
        if (!params['postOnly'] === undefined) {
            throw new Error('postOnly is required for batch orders');
        }
        const buyPrices = [];
        const buySizes = [];
        const sellPrices = [];
        const sellSizes = [];
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            if (order['type'] === 'market') {
                throw new Error('Market orders are not supported in batch orders');
            }
            const side = order['side'];
            if (side === 'buy') {
                buyPrices.push(order['price']);
                buySizes.push(order['amount']);
            }
            else if (side === 'sell') {
                sellPrices.push(order['price']);
                sellSizes.push(order['amount']);
            }
        }
        const functionSignature = 'batchUpdate(uint24[] calldata buyPrices,uint96[] calldata buySizes,uint24[] calldata sellPrices,uint96[] calldata sellSizes,uint40[] calldata orderIdsToCancel,bool postOnly)';
        const iface = new Interface([functionSignature]);
        const encodedData = iface.encodeFunctionData('batchUpdate', [buyPrices, buySizes, sellPrices, sellSizes, [], params['postOnly']]);
        const forwardRequestData = this.createForwardRequestData(marketAddress, encodedData);
        const response = await this.postData('createOrder', forwardRequestData);
        return response;
    }
    async cancelOrders(ids, symbol = undefined, params = {}) {
        /**
         * @method
         * @name kuru#cancelOrders
         * @description cancels multiple orders for a specific market
         * @param {string[]} ids an array of order IDs to cancel
         * @param {string} [symbol] the symbol of the market to cancel orders for
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {any} the response from the exchange API
         * @throws {Error} if marketAddress is not provided in params
         */
        const functionSignature = 'function batchCancelOrders(uint40[] _orderIds)';
        const iface = new Interface([functionSignature]);
        const encodedData = iface.encodeFunctionData('batchCancelOrders', [ids]);
        const forwardRequestData = this.createForwardRequestData(params['marketAddress'], encodedData);
        const response = await this.postData('cancelOrders', forwardRequestData);
        return response;
    }
    async deposit(amount, address, params = {}) {
        /**
         * @method
         * @name kuru#cancelOrders
         * @description cancels multiple orders for a specific market
         * @param {string[]} ids an array of order IDs to cancel
         * @param {string} [symbol] the symbol of the market to cancel orders for
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {any} the response from the exchange API
         * @throws {Error} if marketAddress is not provided in params
         */
        if (!params['marginAccount']) {
            throw new Error('marginAccount is required');
        }
        const functionSignature = 'function deposit(address _user, address _token, uint256 _amount)';
        const iface = new Interface([functionSignature]);
        const encodedData = iface.encodeFunctionData('deposit', [this.walletAddress, address, amount]);
        const forwardRequestData = this.createMarginAccountRequest(params['marginAccount'], encodedData);
        const response = await this.postData('deposit', forwardRequestData);
        return response; // TODO: Parse response
    }
    async withdraw(code, amount, address, tag = undefined, params = {}) {
        /**
         * @method
         * @name kuru#cancelOrders
         * @description cancels multiple orders for a specific market
         * @param {string[]} ids an array of order IDs to cancel
         * @param {string} [symbol] the symbol of the market to cancel orders for
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {any} the response from the exchange API
         * @throws {Error} if marketAddress is not provided in params
         */
        const functionSignature = 'function withdraw(uint256 _amount, address _token)';
        const iface = new Interface([functionSignature]);
        const encodedData = iface.encodeFunctionData('withdraw', [amount, address]);
        const forwardRequestData = this.createForwardRequestData(params['marketAddress'], encodedData);
        const response = await this.postData('withdraw', forwardRequestData);
        return response; // TODO: Parse response
    }
    hashMessage(message) {
        return '0x' + this.hash(message, keccak, 'hex');
    }
    signHash(hash, privateKey) {
        const signature = ecdsa(hash.slice(-64), privateKey.slice(-64), secp256k1, undefined);
        const r = signature['r'];
        const s = signature['s'];
        const v = this.intToBase16(this.sum(27, signature['v']));
        return '0x' + r.padStart(64, '0') + s.padStart(64, '0') + v;
    }
    signMessage(message, privateKey) {
        return this.signHash(this.hashMessage(message), privateKey.slice(-64));
    }
    signMessageHash(messageHash, privateKeyHex) {
        privateKeyHex = privateKeyHex.replace('0x', '');
        messageHash = messageHash.replace('0x', '');
        const privateKeyBytes = this.hexToBytes(privateKeyHex);
        const messageHashBytes = this.hexToBytes(messageHash);
        const signature = secp256k1.sign(messageHashBytes, privateKeyBytes);
        const recoveryBit = signature.recovery;
        const r = signature.r.toString(16).padStart(64, '0');
        const s = signature.s.toString(16).padStart(64, '0');
        const v = recoveryBit + 27;
        const signatureHex = r + s + v.toString(16).padStart(2, '0');
        return '0x' + signatureHex;
    }
    hexToBytes(hex) {
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < bytes.length; i++) {
            const hexByte = hex.substr(i * 2, 2);
            bytes[i] = parseInt(hexByte, 16);
        }
        return bytes;
    }
    signUserSignedAction(messageTypes, message) {
        const verifyingContract = this.safeString(this.options, 'kuruForwarder');
        const chainId = this.safeNumber(this.options, 'chainId');
        const domain = {
            'name': 'KuruForwarder',
            'version': '1.0.0',
            'chainId': chainId,
            'verifyingContract': verifyingContract,
        };
        const msg = this.createEip712Hash(domain, messageTypes, message);
        const signature = this.signMessageHash(msg, this.privateKey);
        return signature;
    }
    signMarginAccountAction(messageTypes, message) {
        const verifyingContract = this.safeString(this.options, 'kuruForwarder');
        const chainId = this.safeNumber(this.options, 'chainId');
        const domain = {
            'name': 'KuruForwarder',
            'version': '1.0.0',
            'chainId': chainId,
            'verifyingContract': verifyingContract,
        };
        const msg = this.createEip712HashMargin(domain, messageTypes, message);
        const signature = this.signMessageHash(msg, this.privateKey);
        return signature;
    }
    createMarginAccountRequest(marginAccount, encodedData) {
        const msgTypes = {
            'MarginAccountRequest': [
                { 'name': 'from', 'type': 'address' },
                { 'name': 'marginAccount', 'type': 'address' },
                { 'name': 'value', 'type': 'uint256' },
                { 'name': 'nonce', 'type': 'uint256' },
                { 'name': 'data', 'type': 'bytes' },
            ],
        };
        const marginAccountRequest = {
            'from': this.walletAddress,
            'marginAccount': marginAccount,
            'value': '0',
            'nonce': this.milliseconds().toString(),
            'data': encodedData,
        };
        console.log('marginAccountRequest:', marginAccountRequest);
        const signature = this.signMarginAccountAction(msgTypes, marginAccountRequest);
        console.log('signature:', signature);
        const requestData = {
            'marginRequest': marginAccountRequest,
            signature,
        };
        return requestData;
    }
    createForwardRequestData(marketAddress, encodedData) {
        const msgTypes = {
            'ForwardRequest': [
                { 'name': 'from', 'type': 'address' },
                { 'name': 'market', 'type': 'address' },
                { 'name': 'value', 'type': 'uint256' },
                { 'name': 'nonce', 'type': 'uint256' },
                { 'name': 'data', 'type': 'bytes' },
            ],
        };
        const forwardRequest = {
            'from': this.walletAddress,
            'market': marketAddress,
            'value': '0',
            'nonce': this.milliseconds().toString(),
            'data': encodedData,
        };
        const signature = this.signUserSignedAction(msgTypes, forwardRequest);
        const requestData = {
            forwardRequest,
            signature,
        };
        return requestData;
    }
    async fetchData(endpoint, searchParams) {
        const baseUrl = 'http://localhost:9090/';
        const url = new URL(endpoint, baseUrl);
        // Append search parameters to the URL
        Object.keys(searchParams).forEach((key) => {
            url.searchParams.append(key, searchParams[key]);
        });
        console.log('url:', url.toString());
        const response = await fetch(url.toString(), {
            'method': 'GET',
            'headers': {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }
    async postData(endpoint, data) {
        const baseUrl = 'http://localhost:9090/';
        const url = new URL(endpoint, baseUrl);
        const response = await fetch(url.toString(), {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
            },
            'body': JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }
    parsePricePrecision(pricePrecision) {
        return (pricePrecision.toString().match(/0+$/) || [''])[0].length;
    }
    hashDomain(domain) {
        const domainType = [
            { 'name': 'name', 'type': 'string' },
            { 'name': 'version', 'type': 'string' },
            { 'name': 'chainId', 'type': 'uint256' },
            { 'name': 'verifyingContract', 'type': 'address' },
        ];
        const encodedData = AbiCoder.defaultAbiCoder().encode(['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'], [
            this.hashMessage(this.encodeType('EIP712Domain', domainType)),
            this.hashMessage(domain.name),
            this.hashMessage(domain.version),
            domain.chainId,
            domain.verifyingContract,
        ]);
        const domainSeperator = this.keccak256EncodedData(encodedData);
        return domainSeperator;
    }
    encodeType(name, fields) {
        const result = `${name}(${fields.map((field) => `${field.type} ${field.name}`).join(',')})`;
        return result;
    }
    // Hash the forward request
    hashForwardRequest(requestType, request) {
        // Hash the data field first
        const dataHash = this.keccak256EncodedData(request.data);
        // Hash the structured data
        const structHash = this.keccak256EncodedData(AbiCoder.defaultAbiCoder().encode(['bytes32', 'address', 'address', 'uint256', 'uint256', 'bytes32'], [
            this.hashMessage('ForwardRequest(address from,address market,uint256 value,uint256 nonce,bytes data)'),
            request.from,
            request.market,
            request.value,
            request.nonce,
            dataHash,
        ]));
        return structHash;
    }
    hashMarginAccountRequest(requestType, request) {
        // Hash the data field first
        const dataHash = this.keccak256EncodedData(request.data);
        // Hash the structured data
        const structHash = this.keccak256EncodedData(AbiCoder.defaultAbiCoder().encode(['bytes32', 'address', 'address', 'uint256', 'uint256', 'bytes'], [
            this.hashMessage('MarginAccountRequest(address from,address marginAccount,uint256 value,uint256 nonce,bytes data)'),
            request.from,
            request.marginAccount,
            request.value,
            request.nonce,
            dataHash,
        ]));
        return structHash;
    }
    createEip712HashMargin(domain, msgTypes, message) {
        const domainSeparator = this.hashDomain(domain);
        const structHash = this.hashMarginAccountRequest(msgTypes, message);
        const abiEncodedfinalMsg = `0x1901${domainSeparator.slice(2)}${structHash.slice(2)}`;
        const finalHash = this.keccak256EncodedData(abiEncodedfinalMsg);
        return finalHash;
    }
    createEip712Hash(domain, msgTypes, message) {
        const domainSeparator = this.hashDomain(domain);
        const structHash = this.hashForwardRequest(msgTypes, message);
        const abiEncodedfinalMsg = `0x1901${domainSeparator.slice(2)}${structHash.slice(2)}`;
        const finalHash = this.keccak256EncodedData(abiEncodedfinalMsg);
        return finalHash;
    }
    keccak256EncodedData(hexData) {
        try {
            // Remove '0x' prefix if present
            const cleanHex = hexData.startsWith('0x') ? hexData.slice(2) : hexData;
            // Validate hex string
            if (!/^[0-9a-fA-F]*$/.test(cleanHex)) {
                throw new Error('Invalid hex string');
            }
            // Convert hex to Uint8Array
            const bytes = hexToBytes(cleanHex);
            // Compute hash
            const hashBytes = keccak(bytes);
            // Convert hash to hex string
            const hashHex = Array.from(hashBytes)
                .map((b) => b.toString(16).padStart(2, '0'))
                .join('');
            return `0x${hashHex}`;
        }
        catch (error) {
            throw new Error(`Failed to compute keccak256 hash: ${error}`);
        }
    }
}
