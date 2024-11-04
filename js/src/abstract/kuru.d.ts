import { implicitReturnType } from '../base/types.js';
import { Exchange as _Exchange } from '../base/Exchange.js';
interface Exchange {
    publicGet(params?: {}): Promise<implicitReturnType>;
    publicGetFetchMarkets(params?: {}): Promise<implicitReturnType>;
    publicGetFetchOrders(params?: {}): Promise<implicitReturnType>;
    publicGetFetchOrderbook(params?: {}): Promise<implicitReturnType>;
    publicGetFetchOrder(params?: {}): Promise<implicitReturnType>;
    publicGetFetchTrades(params?: {}): Promise<implicitReturnType>;
    publicGetFetchOHLCV(params?: {}): Promise<implicitReturnType>;
    privateGetFetchOpenOrders(params?: {}): Promise<implicitReturnType>;
    privateGetFetchClosedOrders(params?: {}): Promise<implicitReturnType>;
    privateGetFetchStatus(params?: {}): Promise<implicitReturnType>;
    privateGetFetchMyTrades(params?: {}): Promise<implicitReturnType>;
    privatePostCreateOrder(params?: {}): Promise<implicitReturnType>;
    privatePostCancelOrder(params?: {}): Promise<implicitReturnType>;
}
declare abstract class Exchange extends _Exchange {
}
export default Exchange;
