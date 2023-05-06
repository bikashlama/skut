import express from 'express';
import dotenv from 'dotenv';
import * as routes from './routes';

const app = express();
dotenv.config();
const port = process.env.PORT || 8044;

app.use(express.json());
routes.register(app);

app.listen(port, ()=> {
    console.log(`App is listening on port ${port}`);
});

module.exports = app;