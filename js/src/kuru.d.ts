import Exchange from './abstract/kuru.js';
import type { Market, Order, Dict, Int, OrderBook, OHLCV, Num, OrderSide, OrderType, Str, Trade, Transaction, OrderRequest, Bool } from './base/types.js';
export default class kuru extends Exchange {
    describe(): any;
    setSandboxMode(enabled: any): void;
    fetchMarkets(params?: {}): Promise<Market[]>;
    parseMarkets(apiResponse: any[]): Market[];
    fetchOrderBook(symbol: string, limit?: Int, params?: {}): Promise<OrderBook>;
    parseOrderBook(apiResponse: Dict): OrderBook;
    fetchOHLCV(symbol: string, timeframe?: string, since?: Int, limit?: Int, params?: {}): Promise<OHLCV[]>;
    parseOHLCVData(apiResponse: any): OHLCV[];
    fetchOrder(id: string, symbol?: Str, params?: {}): Promise<Order>;
    fetchOpenOrders(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Order[]>;
    fetchClosedOrders(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Order[]>;
    fetchCancelledOrders(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Order[]>;
    fetchStatus(params?: {}): Promise<any>;
    parseOrder(orderData: Dict): Order;
    fetchTrades(symbol: string, since?: Int, limit?: Int, params?: {}): Promise<Trade[]>;
    fetchMyTrades(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Trade[]>;
    parseTrade(tradeData: Dict): Trade;
    createOrder(symbol: string, type: OrderType, side: OrderSide, amount: number, price?: Num, params?: {}): Promise<Order>;
    parseCreatedOrderResponse(response: Dict, orderType: Str, orderSide: Str, price: number, amount: number, postOnly: Bool): Order;
    createOrders(orders: OrderRequest[], params?: {}): Promise<any>;
    cancelOrders(ids: string[], symbol?: Str, params?: {}): Promise<unknown>;
    deposit(amount: number, address: string, params?: {}): Promise<Transaction>;
    withdraw(code: string, amount: number, address: string, tag?: any, params?: {}): Promise<Transaction>;
    hashMessage(message: any): string;
    signHash(hash: any, privateKey: any): string;
    signMessage(message: any, privateKey: any): string;
    signMessageHash(messageHash: any, privateKeyHex: any): string;
    hexToBytes(hex: any): Uint8Array;
    signUserSignedAction(messageTypes: any, message: any): string;
    signMarginAccountAction(messageTypes: any, message: any): string;
    createMarginAccountRequest(marginAccount: String, encodedData: any): {
        marginRequest: {
            from: string;
            marginAccount: String;
            value: string;
            nonce: string;
            data: any;
        };
        signature: string;
    };
    createForwardRequestData(marketAddress: String, encodedData: any): {
        forwardRequest: {
            from: string;
            market: String;
            value: string;
            nonce: string;
            data: any;
        };
        signature: string;
    };
    fetchData(endpoint: string, searchParams: {
        [key: string]: string;
    }): Promise<unknown>;
    postData(endpoint: string, data: Dict): Promise<unknown>;
    parsePricePrecision(pricePrecision: any): Num;
    hashDomain(domain: any): string;
    encodeType(name: any, fields: any): string;
    hashForwardRequest(requestType: any, request: any): string;
    hashMarginAccountRequest(requestType: any, request: any): string;
    createEip712HashMargin(domain: any, msgTypes: any, message: any): string;
    createEip712Hash(domain: any, msgTypes: any, message: any): string;
    keccak256EncodedData(hexData: any): string;
}
