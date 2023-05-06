import request from 'supertest';
import { describe, expect, test } from "@jest/globals";

const app = require('../src/index');

describe ('API', ()=> {
    describe('Sales Order', ()=>{
        test('should return all sales order if status query string is not passed', async ()=>{
            const saleOrderRequest = {
                id: "11",
                customer: "sku",
                items:[
                    {
                        sku: "abc",
                        quantity: 1,
                        gramsPerItem: 1,
                        price: 1
                    }
                ],
                quotes:[
                    {
                        carrier: 'UPS',
                        priceCents: 100
                    },
                    {
                        carrier: 'FEDEX',
                        priceCents: 120
                    },
                    {
                        carrier: 'USPS',
                        priceCents: 300
                    }
                ],
            };
            await request(app).post('/sales-orders').send(saleOrderRequest).expect(200);

            const salesOrders = await request(app).get('/sales-orders').expect(200);
            expect(salesOrders._body).toEqual({
                salesOrders: [{
                    ...saleOrderRequest,
                    carrierBooked: '',
                    status: 'RECEIVED'
                }]
            });
        });

        test('should return only sales order with given status if status query string is passed', async()=>{
            // let's create another one and book the sale order
            const saleOrderRequest = {
                id: "12",
                customer: "sku",
                items:[
                    {
                        sku: "abc",
                        quantity: 1,
                        gramsPerItem: 1,
                        price: 1
                    }
                ],
                quotes:[
                    {
                        carrier: 'UPS',
                        priceCents: 100
                    },
                    {
                        carrier: 'FEDEX',
                        priceCents: 120
                    },
                    {
                        carrier: 'USPS',
                        priceCents: 300
                    }
                ],
            };
            await request(app).post('/sales-orders').send(saleOrderRequest).expect(200);
            await request(app).post(`/sales-orders/${saleOrderRequest.id}/bookings`).send({carrier: 'UPS'}).expect(200);
            const salesOrders = await request(app).get('/sales-orders?status=BOOKED').expect(200);
            expect(salesOrders._body).toEqual({
                salesOrders: [{
                    ...saleOrderRequest,
                    carrierBooked: 'UPS',
                    status: 'BOOKED'
                }]
            });
        });

        test('should allow add a new sale order', async ()=>{
            const saleOrderRequest = {
                id: "1",
                customer: "sku",
                items:[
                    {
                        sku: "abc",
                        quantity: 1,
                        gramsPerItem: 1,
                        price: 1
                    }
                ],
                quotes:[
                    {
                        carrier: 'UPS',
                        priceCents: 100
                    },
                    {
                        carrier: 'FEDEX',
                        priceCents: 120
                    },
                    {
                        carrier: 'USPS',
                        priceCents: 300
                    }
                ],
            };
            const result = await request(app).post('/sales-orders').send(saleOrderRequest).expect(200);
            expect(result._body.status).toEqual('RECEIVED');
        });

        test('should return quotes of sale for selected carriers', async ()=>{
            const saleOrderRequest = {
                id: "2",
                customer: "sku",
                items:[
                    {
                        sku: "abc",
                        quantity: 1,
                        gramsPerItem: 1,
                        price: 1
                    }
                ],
                quotes:[
                    {
                        carrier: 'UPS',
                        priceCents: 100
                    },
                    {
                        carrier: 'FEDEX',
                        priceCents: 120
                    },
                    {
                        carrier: 'USPS',
                        priceCents: 300
                    }
                ],
            };
            await request(app).post('/sales-orders').send(saleOrderRequest).expect(200);
            const result = await request(app).post(`/sales-orders/${saleOrderRequest.id}/quotes`).send({carriers: ['UPS', 'FEDEX']}).expect(200);
            expect(result._body).toEqual([
                {
                    carrier: 'UPS',
                    priceCents: 100
                },
                {
                    carrier: 'FEDEX',
                    priceCents: 120
                }
            ]);
        });

        test('should return 400 for non existent sale', async ()=>{
            await request(app).post(`/sales-orders/100/quotes`).send({carriers: ['UPS', 'FEDEX']}).expect(400);
        });

        test('should return 400 for non existent carrier', async ()=>{
            await request(app).post(`/sales-orders/2/quotes`).send({carriers: ['Non-Existent-Carrier']}).expect(400);
        });

        test('should return quotes of sale for selected carriers', async ()=>{
            const saleOrderRequest = {
                id: "3",
                customer: "sku",
                items:[
                    {
                        sku: "abc",
                        quantity: 1,
                        gramsPerItem: 1,
                        price: 1
                    }
                ],
                quotes:[
                    {
                        carrier: 'UPS',
                        priceCents: 100
                    },
                    {
                        carrier: 'FEDEX',
                        priceCents: 120
                    },
                    {
                        carrier: 'USPS',
                        priceCents: 300
                    }
                ],
            };
            await request(app).post('/sales-orders').send(saleOrderRequest).expect(200);
            const result = await request(app).post(`/sales-orders/${saleOrderRequest.id}/bookings`).send({carrier: 'UPS'}).expect(200);
            expect(result._body).toEqual(
                {
                    carrierPricePaid: 100,
                    carrierBooked: 'UPS'
                }
            );
        });

        test('should return 400 for non existent sale for bookings', async ()=>{
            await request(app).post(`/sales-orders/100/bookings`).send({carrier: 'UPS'}).expect(400);
        });
    })
})