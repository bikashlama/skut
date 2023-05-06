import express from 'express';
import * as db from '../db';

export const register = (app:express.Application) => {
    app.get('/', (req, res)=> {
        res.send('Hello From Skutopia API');
    });

    app.get('/sales-orders', (req, res)=> {
        const qryStatus = req.query["status"];
        if(qryStatus){
            const result = db.salesOrders.filter(x=> x.status === qryStatus);
            res.send({
                salesOrders: result
            });
        }
        res.send({
            salesOrders: db.salesOrders
        });
    });

    app.post('/sales-orders', (req, res)=> {
        const salesOrderRequest = req.body;
        const salesOrderResponse = {
            ...salesOrderRequest,
            status: 'RECEIVED',
            carrierBooked: ''
        };
        db.salesOrders.push(salesOrderResponse);
        res.send(salesOrderResponse);
    });

    app.post('/sales-orders/:id/quotes', (req, res)=> {
        const saleOrderId = req.params["id"];
        const carriers = req.body.carriers;
        console.log(carriers);
        const saleOrderIndex = db.salesOrders.findIndex(x=> x.id === saleOrderId);
        if(saleOrderIndex < 0){
            res.status(400);
        }
        const quotes = db.salesOrders[saleOrderIndex].quotes.filter(x=> carriers.includes(x.carrier));
        if(quotes.length === 0){
            res.status(400);
        }
        db.salesOrders[saleOrderIndex].status = 'QUOTED';
        res.send(quotes);
    });

    app.post('/sales-orders/:id/bookings', (req, res)=> {
        const saleOrderId = req.params["id"];
        const carrierBooked = req.body.carrier;
        const saleOrderIndex = db.salesOrders.findIndex(x=> x.id === saleOrderId);
        if(saleOrderIndex < 0){
            res.status(400);
        }
        const status = 'BOOKED';
        db.salesOrders[saleOrderIndex].status = status;
        db.salesOrders[saleOrderIndex].carrierBooked = carrierBooked;
        const quoteForCarrier = db.salesOrders[saleOrderIndex].quotes.find(x=> x.carrier === carrierBooked);
        if(!quoteForCarrier){
            res.status(400);
        }
        const carrierPricePaid = quoteForCarrier?.priceCents;
        res.send({
            carrierBooked,
            carrierPricePaid
        });
    });



    
}