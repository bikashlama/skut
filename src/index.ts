import express from 'express';
import dotenv from 'dotenv';

const app = express();
dotenv.config();
const port = process.env.PORT || 5044;

app.get('/', (req, res)=> {
    res.send('Hello World');
});

app.listen(port, ()=> {
    console.log(`App is listening on port ${port}`);
});