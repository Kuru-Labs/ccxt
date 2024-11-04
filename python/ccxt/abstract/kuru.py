from ccxt.base.types import Entry


class ImplicitAPI:
    public_get = publicGet = Entry('/', 'public', 'GET', {'cost': 1})
    public_get_fetchmarkets = publicGetFetchMarkets = Entry('fetchMarkets', 'public', 'GET', {'cost': 1})
    public_get_fetchorders = publicGetFetchOrders = Entry('fetchOrders', 'public', 'GET', {'cost': 1})
    public_get_fetchorderbook = publicGetFetchOrderbook = Entry('fetchOrderbook', 'public', 'GET', {'cost': 1})
    public_get_fetchorder = publicGetFetchOrder = Entry('fetchOrder', 'public', 'GET', {'cost': 1})
    public_get_fetchtrades = publicGetFetchTrades = Entry('fetchTrades', 'public', 'GET', {'cost': 1})
    public_get_fetchohlcv = publicGetFetchOHLCV = Entry('fetchOHLCV', 'public', 'GET', {'cost': 1})
    private_get_fetchopenorders = privateGetFetchOpenOrders = Entry('fetchOpenOrders', 'private', 'GET', {'cost': 1})
    private_get_fetchclosedorders = privateGetFetchClosedOrders = Entry('fetchClosedOrders', 'private', 'GET', {'cost': 1})
    private_get_fetchstatus = privateGetFetchStatus = Entry('fetchStatus', 'private', 'GET', {'cost': 1})
    private_get_fetchmytrades = privateGetFetchMyTrades = Entry('fetchMyTrades', 'private', 'GET', {'cost': 1})
    private_post_createorder = privatePostCreateOrder = Entry('createOrder', 'private', 'POST', {'cost': 1})
    private_post_cancelorder = privatePostCancelOrder = Entry('cancelOrder', 'private', 'POST', {'cost': 1})
