import Exchange from './abstract/kuru.js';
import type {
    Market,
    Dict,
    Int,
    OrderBook,
    OHLCV,
    Num,

    Order,
    OrderSide,
    OrderType,
    Str,
} from './base/types.js';
import {
    InvalidOrder,
    OrderNotFound,
} from './base/errors.js';
import {
    DECIMAL_PLACES,
} from './base/functions/number.js';
import { keccak_256 as keccak, sha3_256 } from './static_dependencies/noble-hashes/sha3.js';
import { secp256k1 } from './static_dependencies/noble-curves/secp256k1.js';
import { ecdsa } from './base/functions/crypto.js';
import fetch from './static_dependencies/node-fetch/index.js';
import { Fragment, Interface } from './static_dependencies/ethers/index.js';
import { concat, hexlify } from './static_dependencies/ethers/utils/data.js';
import { TypedDataEncoder } from './static_dependencies/ethers/hash/typed-data';
import { hexToBytes } from './static_dependencies/noble-hashes/utils.js';
import { AbiCoder } from './static_dependencies/ethers/abi-coder.js';
import { toUtf8Bytes } from './static_dependencies/ethers/utils/utf8.js';
import { solidityPacked, solidityPackedKeccak256 } from './static_dependencies/ethers/hash/solidity.js';
import { encodeBytes32String } from './static_dependencies/ethers/bytes32';
import { padLeft } from './static_dependencies/starknet/utils/encode';

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
                // TODO: Change this to testnet/mainnet address
                'kuruForwarder': '0x0165878A594ca255338adfa4d48449f69242Eb8F',
                'chainId': '31337',
            },
        });
    }

    setSandboxMode (enabled) {
        super.setSandboxMode (enabled);
        this.options['sandboxMode'] = enabled;
    }

    async fetchMarkets (params = {}): Promise<Market[]> {
        const markets = await this.fetchData ('fetchMarkets', {});
        return this.parseMarkets (markets['data']);
    }

    parseMarkets (apiResponse: any[]): Market[] {
        const markets: Market[] = apiResponse.map ((marketData: any) => {
            const market: Market = {
                'id': this.safeString (marketData, 'market_address'),
                'symbol': this.safeString (marketData, 'symbol'),
                'base': this.safeString (marketData, 'base'),
                'quote': this.safeString (marketData, 'quote'),
                'baseId': this.safeString (marketData, 'base_address'),
                'quoteId': this.safeString (marketData, 'quote_address'),
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
                'taker': this.safeNumber (marketData, 'taker_fee_bps'),
                'maker': this.safeNumber (marketData, 'maker_fee_bps'),
                'percentage': false,
                'tierBased': false,
                'feeSide': undefined,
                'precision': {
                    'price': this.parsePricePrecision (marketData['precision']['price']),
                    'amount': Number (marketData['precision']['price']),
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

    async fetchOrderBook (symbol: string, limit: Int = undefined, params = {}): Promise<OrderBook> {
        const marketAddress = params['marketAddress'];
        if (!marketAddress) {
            throw new Error ('marketAddress is required');
        }
        const request: Dict = {
            'marketAddress': marketAddress,
            'limit': limit,
        };
        const response = await this.fetchData ('/fetchOrderbook', request);
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

    async fetchOHLCV (symbol: string, timeframe = '1m', since: Int = undefined, limit: Int = undefined, params = {}): Promise<OHLCV[]> {
        const marketAddressOHLCV = params['marketAddress'];
        if (!marketAddressOHLCV) {
            throw new Error ('marketAddress is required');
        }
        if (!since) {
            since = 1728205695000;
        }
        const request: Dict = {
            'marketAddress': marketAddressOHLCV,
            'timeframe': timeframe,
            'since': since,
        };
        const response = await this.fetchData ('/fetchOHLCV', request);
        return this.parseOHLCVData (response);
    }

    parseOHLCVData (apiResponse: any): OHLCV[] {
        const ohlcv: OHLCV[] = apiResponse.map ((ohlcvData) => [ ohlcvData['start_time'],
            ohlcvData['open'],
            ohlcvData['high'],
            ohlcvData['low'],
            ohlcvData['close'],
            ohlcvData['volume'] ]);
        return ohlcv;
    }

    async fetchOrder (id: string, symbol: Str = undefined, params = {}): Promise<Order> {
        const marketAddress = params['marketAddress'];
        if (!marketAddress) {
            throw new Error ('marketAddress is required');
        }
        const request: Dict = {
            'marketAddress': marketAddress,
            'orderId': id,
        };
        const response = await this.fetchData ('fetchOrder', request);
        return this.parseOrder (response);
    }

    async fetchOpenOrders (symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Order[]> {
        const marketAddress = params['marketAddress'];
        if (!marketAddress) {
            throw new Error ('marketAddress is required');
        }
        const request: Dict = {
            'marketAddress': marketAddress,
            'userAddress': this.walletAddress,
            'since': since,
            'limit': limit,
            'offset': params['offset'] ? params['offset'] : 0,
        };
        const response = await this.fetchData ('fetchOpenOrders', request);
        const openOrders = response['data'].map ((orderData) => this.parseOrder (orderData));
        return openOrders; // TODO: Parse orders
    }

    async fetchClosedOrders (symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Order[]> {
        const marketAddress = params['marketAddress'];
        if (!marketAddress) {
            throw new Error ('marketAddress is required');
        }
        const request: Dict = {
            'marketAddress': marketAddress,
            'userAddress': this.walletAddress,
            'since': since,
            'limit': limit,
            'offset': params['offset'] ? params['offset'] : 0,
        };
        const response = await this.fetchData ('fetchClosedOrders', request);
        const closedOrders = response['data'].map ((orderData) => this.parseOrder (orderData));
        return closedOrders;
    }

    async fetchCancelledOrders (symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Order[]> {
        const marketAddress = params['marketAddress'];
        if (!marketAddress) {
            throw new Error ('marketAddress is required');
        }
        const request: Dict = {
            'marketAddress': marketAddress,
            'userAddress': this.walletAddress,
            'since': since,
            'limit': limit,
            'offset': params['offset'] ? params['offset'] : 0,
        };
        const response = await this.fetchData ('fetchCancelledOrders', request);
        const cancelledOrders = response['data'].map ((orderData) => this.parseOrder (orderData));
        return cancelledOrders;
    }

    parseOrder (orderData: Dict): Order {
        let status;
        if (orderData['is_cancelled']) {
            status = 'canceled';
        } else if (orderData['remaining_size'] === 0) {
            status = 'closed';
        } else {
            status = 'open';
        }
        const order: Order = {
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
            'timestamp': orderData['trigger_time'], // TODO: converty it to timestamp
            'datetime': orderData['trigger_time'],
            'fee': orderData['fee'],
            'info': undefined,
            'clientOrderId': orderData['order_id'],
            'lastTradeTimestamp': 0,
        };
        return order;
    }

    async fetchMyTrades (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Trade[]> {
        const marketAddress = params['marketAddress'];
        if (!marketAddress) {
            throw new Error ('marketAddress is required');
        }
        const request: Dict = {
            'marketAddress': marketAddress,
            'userAddress': this.walletAddress,
            'since': since,
            'limit': limit,
            'offset': params['offset'] ? params['offset'] : 0,
        };
        const response = await this.fetchData ('fetchMyTrades', request);
        return response; // TODO: Parse trades
    }

    async createOrder (
        symbol: string,
        type: OrderType,
        side: OrderSide,
        amount: number,
        price?: Num,
        params?: {}
    ): Promise<Order> {
        // Validate inputs based on order type
        if (type === 'limit') {
            if (!price) {
                throw new Error ('Price is required for limit orders');
            }
            if (params['postOnly'] === undefined) {
                throw new Error ('postOnly is required for limit orders');
            }
        } else if (type === 'market') {
            if (params['isMargin'] === undefined) {
                throw new Error ('isMargin is required for market orders');
            }
            if (params['isFillOrKill'] === undefined) {
                throw new Error ('isFillOrKill is required for market orders');
            }
            if (params['minAmountOut'] === undefined) {
                throw new Error ('minAmountOut is required for market orders');
            }
        } else {
            throw new Error ('Invalid order type');
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
        const functionSignature = `function ${config.functionCall}(${config.messageTypes.map ((param) => `${param.type} ${param.name}`).join (', ')})`;
        const iface = new Interface ([ functionSignature ]);
        // Prepare parameters based on order type
        const parameters = type === 'limit'
            ? [ price, amount, params['postOnly'] ]
            : [ amount, params['minAmountOut'], params['isMargin'], params['isFillOrKill'] ];
        const encodedData = iface.encodeFunctionData (config.functionCall, parameters);
        const forwardRequestData = this.createForwardRequestData (params['marketAddress'], encodedData);
        const response = await this.postData ('createOrder', forwardRequestData);
        return response; // TODO: Parse Order
    }

    async cancelOrders (ids: string[], symbol: Str = undefined, params = {}) {
        // Create function signature and encode data
        const functionSignature = 'function batchCancelOrders(uint40[] _orderIds)';
        const iface = new Interface ([ functionSignature ]);
        const encodedData = iface.encodeFunctionData ('batchCancelOrders', [ ids ]);
        // Create forward request
        const forwardRequestData = this.createForwardRequestData (params['marketAddress'], encodedData);
        // Submit the cancel request
        const response = await this.postData ('cancelOrders', forwardRequestData);
        return response; // TODO: Parse response
    }

    hashMessage (message) {
        return '0x' + this.hash (message, keccak, 'hex');
    }

    signHash (hash, privateKey) {
        const signature = ecdsa (hash.slice (-64), privateKey.slice (-64), secp256k1, undefined);
        const r = signature['r'];
        const s = signature['s'];
        const v = this.intToBase16 (this.sum (27, signature['v']));
        return '0x' + r.padStart (64, '0') + s.padStart (64, '0') + v;
    }

    signMessage (message, privateKey) {
        return this.signHash (this.hashMessage (message), privateKey.slice (-64));
    }

    signMessageHash (messageHash, privateKeyHex) {
        privateKeyHex = privateKeyHex.replace ('0x', '');
        messageHash = messageHash.replace ('0x', '');
        const privateKeyBytes = this.hexToBytes (privateKeyHex);
        const messageHashBytes = this.hexToBytes (messageHash);
        const signature = secp256k1.sign (messageHashBytes, privateKeyBytes);
        const recoveryBit = signature.recovery;
        const r = signature.r.toString (16).padStart (64, '0');
        const s = signature.s.toString (16).padStart (64, '0');
        const v = recoveryBit + 27;
        const signatureHex = r + s + v.toString (16).padStart (2, '0');
        return '0x' + signatureHex;
    }

    hexToBytes (hex) {
        const bytes = new Uint8Array (hex.length / 2);
        for (let i = 0; i < bytes.length; i++) {
            const hexByte = hex.substr (i * 2, 2);
            bytes[i] = parseInt (hexByte, 16);
        }
        return bytes;
    }

    signUserSignedAction (messageTypes, message) {
        const verifyingContract = this.safeString (this.options, 'kuruForwarder');
        const chainId = this.safeNumber (this.options, 'chainId');
        const domain: Dict = {
            'name': 'KuruForwarder',
            'version': '1.0.0',
            'chainId': chainId,
            'verifyingContract': verifyingContract,
        };
        const msg = this.createEip712Hash (domain, messageTypes, message);
        const signature = this.signMessageHash (msg, this.privateKey);
        return signature;
    }

    createForwardRequestData (marketAddress: String, encodedData: any) {
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
            'nonce': this.milliseconds ().toString (),
            'data': encodedData,
        };
        const signature = this.signUserSignedAction (msgTypes, forwardRequest);
        const requestData = {
            forwardRequest,
            signature,
        };
        return requestData;
    }

    async fetchData (endpoint: string, searchParams: { [key: string]: string }) {
        const baseUrl = 'http://localhost:9090/';
        const url = new URL (endpoint, baseUrl);
        // Append search parameters to the URL
        Object.keys (searchParams).forEach ((key) => {
            url.searchParams.append (key, searchParams[key]);
        });
        console.log ('url:', url.toString ());
        const response = await fetch (url.toString (), {
            'method': 'GET',
            'headers': {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error (`HTTP error! status: ${response.status}`);
        }
        return response.json ();
    }

    async postData (endpoint: string, data: Dict) {
        const baseUrl = 'http://localhost:9090/';
        const url = new URL (endpoint, baseUrl);
        const response = await fetch (url.toString (), {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
            },
            'body': JSON.stringify (data),
        });
        if (!response.ok) {
            throw new Error (`HTTP error! status: ${response.status}`);
        }
        return response.json ();
    }

    parsePricePrecision (pricePrecision): Num {
        return (pricePrecision.toString ().match (/0+$/) || [ '' ])[0].length;
    }

    hashDomain (domain) {
        const domainType = [
            { 'name': 'name', 'type': 'string' },
            { 'name': 'version', 'type': 'string' },
            { 'name': 'chainId', 'type': 'uint256' },
            { 'name': 'verifyingContract', 'type': 'address' },
        ];
        const encodedData = AbiCoder.defaultAbiCoder ().encode (
            [ 'bytes32', 'bytes32', 'bytes32', 'uint256', 'address' ],
            [
                this.hashMessage (this.encodeType ('EIP712Domain', domainType)),
                this.hashMessage (domain.name),
                this.hashMessage (domain.version),
                domain.chainId,
                domain.verifyingContract,
            ]
        );
        const domainSeperator = this.keccak256EncodedData (encodedData);
        return domainSeperator;
    }

    encodeType (name, fields) {
        const result = `${name}(${fields.map ((field) => `${field.type} ${field.name}`).join (',')})`;
        return result;
    }

    // Hash the forward request
    hashForwardRequest (requestType, request) {
        // Hash the data field first
        const dataHash = this.keccak256EncodedData (request.data);
        // Hash the structured data
        const structHash = this.keccak256EncodedData (
            AbiCoder.defaultAbiCoder ().encode (
                [ 'bytes32', 'address', 'address', 'uint256', 'uint256', 'bytes32' ],
                [
                    this.hashMessage (
                        'ForwardRequest(address from,address market,uint256 value,uint256 nonce,bytes data)'
                    ),
                    request.from,
                    request.market,
                    request.value,
                    request.nonce,
                    dataHash,
                ]
            )
        );
        return structHash;
    }

    createEip712Hash (domain, msgTypes, message) {
        const domainSeparator = this.hashDomain (domain);
        const structHash = this.hashForwardRequest (msgTypes, message);
        const abiEncodedfinalMsg = `0x1901${domainSeparator.slice (2)}${structHash.slice (2)}`;
        const finalHash = this.keccak256EncodedData (
            abiEncodedfinalMsg
        );
        return finalHash;
    }

    keccak256EncodedData (hexData) {
        try {
            // Remove '0x' prefix if present
            const cleanHex = hexData.startsWith ('0x') ? hexData.slice (2) : hexData;
            // Validate hex string
            if (!/^[0-9a-fA-F]*$/.test (cleanHex)) {
                throw new Error ('Invalid hex string');
            }
            // Convert hex to Uint8Array
            const bytes = hexToBytes (cleanHex);
            // Compute hash
            const hashBytes = keccak (bytes);
            // Convert hash to hex string
            const hashHex = Array.from (hashBytes)
                .map ((b) => b.toString (16).padStart (2, '0'))
                .join ('');
            return `0x${hashHex}`;
        } catch (error) {
            throw new Error (`Failed to compute keccak256 hash: ${error}`);
        }
    }
}
