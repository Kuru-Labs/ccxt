import Exchange from './abstract/kuru.js';
import type {
    Market,
    Dict,
    Int,
    OrderBook,
    OHLCV,
} from './base/types.js';
import {
    InvalidOrder,
    OrderNotFound,
} from './base/errors.js';
import {
    DECIMAL_PLACES,
} from './base/functions/number.js';

export default class kuru extends Exchange {
    describe () {
        return this.deepExtend (super.describe (), {
            'id': 'kuru',
            'name': 'Kuru',
            'countries': [],
            'version': 'v1',
            'rateLimit': 50, // 1200 requests per minute, 20 request per second
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
                'addMargin': true,
                'borrowCrossMargin': false,
                'borrowIsolatedMargin': false,
                'cancelAllOrders': false,
                'cancelAllOrdersAfter': true,
                'cancelOrder': true,
                'cancelOrders': true,
                'cancelOrdersForSymbols': true,
                'closeAllPositions': false,
                'closePosition': false,
                'createMarketBuyOrderWithCost': false,
                'createMarketOrderWithCost': false,
                'createMarketSellOrderWithCost': false,
                'createOrder': true,
                'createOrders': true,
                'createReduceOnlyOrder': true,
                'editOrder': true,
                'fetchAccounts': false,
                'fetchBalance': true,
                'fetchBorrowInterest': false,
                'fetchBorrowRateHistories': false,
                'fetchBorrowRateHistory': false,
                'fetchCanceledAndClosedOrders': true,
                'fetchCanceledOrders': true,
                'fetchClosedOrders': true,
                'fetchCrossBorrowRate': false,
                'fetchCrossBorrowRates': false,
                'fetchCurrencies': true,
                'fetchDepositAddress': false,
                'fetchDepositAddresses': false,
                'fetchDeposits': true,
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
                    'public': 'http:://localhost:9090',
                    'private': 'http://localhost:9090',
                },
                'test': {
                    'public': 'http:://localhost:9090',
                    'private': 'http://localhost:9090',
                },
                'www': 'https://kuru.io',
                'doc': 'https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api',
                'fees': 'https://hyperliquid.gitbook.io/hyperliquid-docs/trading/fees',
                'referral': 'https://app.hyperliquid.xyz/',
            },
            'api': {
                'public': {
                    'get': {
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
                    'taker': this.parseNumber ('0.00035'),
                    'maker': this.parseNumber ('0.0001'),
                },
                'spot': {
                    'taker': this.parseNumber ('0.00035'),
                    'maker': this.parseNumber ('0.0001'),
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
                    'Order could not immediately match against any resting orders.':
            InvalidOrder,
                    'Invalid TP/SL price.': InvalidOrder,
                    'No liquidity available for market order.': InvalidOrder,
                    'Order was never placed, already canceled, or filled.': OrderNotFound,
                    'User or API Wallet ': InvalidOrder,
                    'Order has invalid size': InvalidOrder,
                    'Order price cannot be more than 80% away from the reference price':
            InvalidOrder,
                },
            },
            'precisionMode': DECIMAL_PLACES,
            'commonCurrencies': {},
            'options': {
                'defaultType': 'swap',
                'sandboxMode': false,
                'defaultSlippage': 0.05,
                'zeroAddress': '0x0000000000000000000000000000000000000000',
            },
        });
    }

    setSandboxMode (enabled) {
        super.setSandboxMode (enabled);
        this.options['sandboxMode'] = enabled;
    }

    async fetchMarkets (params = {}): Promise<Market[]> {
    // TODO: update return type
        const response = await this.publicGetFetchMarkets (params);
        const markets = response.data;
        return markets;
    }

    parseMarket (apiResponse: Dict): Market {
        const market: Market = {
            'id': this.safeString (apiResponse, 'market_address'),
            'symbol': this.safeString (apiResponse, 'symbol'),
            'base': this.safeString (apiResponse, 'base'),
            'quote': this.safeString (apiResponse, 'quote'),
            'baseId': this.safeString (apiResponse, 'baseId'),
            'quoteId': this.safeString (apiResponse, 'quoteId'),
            'settleId': undefined,
            'type': 'spot',
            'subType': undefined,
            'spot': true,
            'margin': false,
            'swap': false,
            'future': false,
            'option': false,
            'contract': false,
            'linear': false,
            'inverse': false,
            'quanto': false,
            'settle': undefined,
            'contractSize': undefined,
            'expiry': undefined,
            'expiryDatetime': undefined,
            'optionType': undefined,
            'active': true,
            'taker': this.safeNumber (apiResponse, 'taker_fee_bps'),
            'maker': this.safeNumber (apiResponse, 'maker_fee_bps'),
            'percentage': false,
            'tierBased': false,
            'feeSide': undefined,
            'precision': {
                'price': this.safeInteger (apiResponse['precision'], 'price'),
                'amount': this.safeInteger (apiResponse['precision'], 'size'),
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
            'created': apiResponse['created'],
            'info': undefined,
            'strike': undefined,
        };
        return market;
    }

    // // TODO: async fetchBalance() {}

    async fetchOrderBook (symbol: string, limit: Int = undefined, params = {}): Promise<OrderBook> {
        const marketAddress = params['marketAddress'];
        if (!marketAddress) {
            throw new Error ('marketAddress is required');
        }
        const request: Dict = {
            'marketAddress': marketAddress,
            'limit': limit,
        };
        const response = await this.publicGetFetchOrderbook (request);
        return this.parseOrderBook (response);
    }

    parseOrderBook (apiResponse: Dict): OrderBook {
        const orderbook: OrderBook = {
            'asks': apiResponse['asks'],
            'bids': apiResponse['bids'],
            'datetime': apiResponse['datetime'],
            'timestamp': apiResponse['timestamp'],
            'symbol': apiResponse['symbol'],
            'nonce': undefined,
        };
        return orderbook;
    }

    // // async fetchTickers(): Promise<Tickers> {}

    async fetchOHLCV (symbol: string, timeframe = '1m', since: Int = undefined, limit: Int = undefined, params = {}): Promise<OHLCV[]> {
        const marketAddressOHLCV = params['marketAddress'];
        if (!marketAddressOHLCV) {
            throw new Error ('marketAddress is required');
        }
        const request: Dict = {
            'marketAddress': marketAddressOHLCV,
            'timeframe': timeframe,
            'since': since,
        };
        const response = await this.publicGetFetchOHLCV (request);
        return this.parseOHLCVData (response);
    }

    parseOHLCVData (apiResponse: Dict[]): OHLCV[] {
        const ohlcv: OHLCV[] = apiResponse.map ((ohlcvData) => [ ohlcvData['start_time'],
            ohlcvData['open'],
            ohlcvData['high'],
            ohlcvData['low'],
            ohlcvData['close'],
            ohlcvData['volume'] ]);
        return ohlcv;
    }

    // hashMessage (message) {
    //     return '0x' + this.hash (message, keccak, 'hex');
    // }

    // signHash (hash, privateKey) {
    //     const signature = ecdsa (hash.slice (-64), privateKey.slice (-64), secp256k1, undefined);
    //     return {
    //         'r': '0x' + signature['r'],
    //         's': '0x' + signature['s'],
    //         'v': this.sum (27, signature['v']),
    //     };
    // }

    // signMessage (message, privateKey) {
    //     return this.signHash (this.hashMessage (message), privateKey.slice (-64));
    // }

    // constructPhantomAgent (hash, isTestnet = true) {
    //     const source = (isTestnet) ? 'b' : 'a';
    //     return {
    //         'source': source,
    //         'connectionId': hash,
    //     };
    // }

    // actionHash (action, vaultAddress, nonce) {
    //     const dataBinary = this.packb (action);
    //     const dataHex = this.binaryToBase16 (dataBinary);
    //     let data = dataHex;
    //     data += '00000' + this.intToBase16 (nonce);
    //     if (vaultAddress === undefined) {
    //         data += '00';
    //     } else {
    //         data += '01';
    //         data += vaultAddress;
    //     }
    //     return this.hash (this.base16ToBinary (data), keccak, 'binary');
    // }

    // signL1Action (action, nonce, vaultAdress = undefined): object {
    //     const hash = this.actionHash (action, vaultAdress, nonce);
    //     const isTestnet = this.safeBool (this.options, 'sandboxMode', false);
    //     const phantomAgent = this.constructPhantomAgent (hash, isTestnet);
    //     // const data: Dict = {
    //     //     'domain': {
    //     //         'chainId': 1337,
    //     //         'name': 'Exchange',
    //     //         'verifyingContract': '0x0000000000000000000000000000000000000000',
    //     //         'version': '1',
    //     //     },
    //     //     'types': {
    //     //         'Agent': [
    //     //             { 'name': 'source', 'type': 'string' },
    //     //             { 'name': 'connectionId', 'type': 'bytes32' },
    //     //         ],
    //     //         'EIP712Domain': [
    //     //             { 'name': 'name', 'type': 'string' },
    //     //             { 'name': 'version', 'type': 'string' },
    //     //             { 'name': 'chainId', 'type': 'uint256' },
    //     //             { 'name': 'verifyingContract', 'type': 'address' },
    //     //         ],
    //     //     },
    //     //     'primaryType': 'Agent',
    //     //     'message': phantomAgent,
    //     // };
    //     const zeroAddress = this.safeString (this.options, 'zeroAddress');
    //     const chainId = 1337; // check this out
    //     const domain: Dict = {
    //         'chainId': chainId,
    //         'name': 'Exchange',
    //         'verifyingContract': zeroAddress,
    //         'version': '1',
    //     };
    //     const messageTypes: Dict = {
    //         'Agent': [
    //             { 'name': 'source', 'type': 'string' },
    //             { 'name': 'connectionId', 'type': 'bytes32' },
    //         ],
    //     };
    //     const msg = this.ethEncodeStructuredData (domain, messageTypes, phantomAgent);
    //     const signature = this.signMessage (msg, this.privateKey);
    //     return signature;
    // }

    // signUserSignedAction (messageTypes, message) {
    //     const zeroAddress = this.safeString (this.options, 'zeroAddress');
    //     const chainId = 421614; // check this out
    //     const domain: Dict = {
    //         'chainId': chainId,
    //         'name': 'HyperliquidSignTransaction',
    //         'verifyingContract': zeroAddress,
    //         'version': '1',
    //     };
    //     const msg = this.ethEncodeStructuredData (domain, messageTypes, message);
    //     const signature = this.signMessage (msg, this.privateKey);
    //     return signature;
    // }
}
