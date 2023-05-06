type Carrier = 'UPS' | 'FEDEX' | 'USPS';
type SalesOrderStatus = 'RECEIVED' | 'QUOTED' | 'BOOKED' | 'CANCELLED';

export interface SalesOrder {
    id: string;
    status: SalesOrderStatus,
    customer: string;
    items: Array<SalesOrderItem>,
    carrierPricePaid? : number;
    carrierBooked: Carrier,
    quotes: Array<SalesOrderQuote>
}

export interface SalesOrderRequest {
    id: string;
    customer: string;
    items: Array<SalesOrderItem>,
    quotes: Array<SalesOrderQuote>,
}

export interface SalesOrderResponse extends SalesOrderRequest {
    status: string;
}

interface SalesOrderItem {
    sku: string;
    quantity: number;
    gramsPerItem: number;
    price: number
}

interface SalesOrderQuote {
    carrier: Carrier,
    priceCents: number
}

interface Booking {
    carrierBooked: Carrier,
    carrierPricePaid: number
}