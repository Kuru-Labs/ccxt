'use strict';

var kuru$1 = require('./abstract/kuru.js');
var errors = require('./base/errors.js');
var number = require('./base/functions/number.js');
var sha3 = require('./static_dependencies/noble-hashes/sha3.js');
var secp256k1 = require('./static_dependencies/noble-curves/secp256k1.js');
var crypto = require('./base/functions/crypto.js');

class kuru extends kuru$1 {
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
                    'public': 'http:://127.0.0.1:9090/',
                    'private': 'http://127.0.0.1:9090/',
                },
                'test': {
                    'public': 'http:://127.0.0.1:9090/',
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
                    'Price must be divisible by tick size.': errors.InvalidOrder,
                    'Order must have minimum value of $10': errors.InvalidOrder,
                    'Insufficient margin to place order.': errors.InvalidOrder,
                    'Reduce only order would increase position.': errors.InvalidOrder,
                    'Post only order would have immediately matched,': errors.InvalidOrder,
                    'Order could not immediately match against any resting orders.': errors.InvalidOrder,
                    'Invalid TP/SL price.': errors.InvalidOrder,
                    'No liquidity available for market order.': errors.InvalidOrder,
                    'Order was never placed, already canceled, or filled.': errors.OrderNotFound,
                    'User or API Wallet ': errors.InvalidOrder,
                    'Order has invalid size': errors.InvalidOrder,
                    'Order price cannot be more than 80% away from the reference price': errors.InvalidOrder,
                },
            },
            'precisionMode': number.DECIMAL_PLACES,
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
        console.log('fetchMarkets');
        console.log('api', this.publicGetFetchMarkets);
        const response = await this.publicGetFetchMarkets(params);
        const markets = response.data;
        return markets;
    }
    parseMarket(apiResponse) {
        const market = {
            'id': this.safeString(apiResponse, 'market_address'),
            'symbol': this.safeString(apiResponse, 'symbol'),
            'base': this.safeString(apiResponse, 'base'),
            'quote': this.safeString(apiResponse, 'quote'),
            'baseId': this.safeString(apiResponse, 'baseId'),
            'quoteId': this.safeString(apiResponse, 'quoteId'),
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
            'taker': this.safeNumber(apiResponse, 'taker_fee_bps'),
            'maker': this.safeNumber(apiResponse, 'maker_fee_bps'),
            'percentage': false,
            'tierBased': false,
            'feeSide': undefined,
            'precision': {
                'price': this.safeInteger(apiResponse['precision'], 'price'),
                'amount': this.safeInteger(apiResponse['precision'], 'size'),
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
    async fetchOrderBook(symbol, limit = undefined, params = {}) {
        const marketAddress = params['marketAddress'];
        if (!marketAddress) {
            throw new Error('marketAddress is required');
        }
        const request = {
            'marketAddress': marketAddress,
            'limit': limit,
        };
        const response = await this.publicGetFetchOrderbook(request);
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
        const marketAddressOHLCV = params['marketAddress'];
        if (!marketAddressOHLCV) {
            throw new Error('marketAddress is required');
        }
        const request = {
            'marketAddress': marketAddressOHLCV,
            'timeframe': timeframe,
            'since': since,
        };
        const response = await this.publicGetFetchOHLCV(request);
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
    hashMessage(message) {
        return '0x' + this.hash(message, sha3.keccak_256, 'hex');
    }
    signHash(hash, privateKey) {
        const signature = crypto.ecdsa(hash.slice(-64), privateKey.slice(-64), secp256k1.secp256k1, undefined);
        return {
            'r': '0x' + signature['r'],
            's': '0x' + signature['s'],
            'v': this.sum(27, signature['v']),
        };
    }
    signMessage(message, privateKey) {
        return this.signHash(this.hashMessage(message), privateKey.slice(-64));
    }
    signUserSignedAction(messageTypes, message) {
        const verifyingContract = this.safeString(this.options, 'kuruForwarder');
        const chainId = this.safeNumber(this.options, 'chainId');
        const domain = {
            'chainId': chainId,
            'name': 'KuruForwarder',
            'verifyingContract': verifyingContract,
            'version': '1.0.0',
        };
        const msg = this.ethEncodeStructuredData(domain, messageTypes, message);
        const signature = this.signMessage(msg, this.privateKey);
        return signature;
    }
}

module.exports = kuru;
