const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');

const app = express();

const PORT = process.env.PORT || 80;

app.use(cors());

app.use(express.json());

app.use('/o', proxy(process.env.ORDER_URL))
app.use('/u', proxy(process.env.USER_URL))
app.use('/p', proxy(process.env.PRODUCT_URL))


app.listen(PORT, () => {

    console.log(`Gateway is Listening to Port ${PORT}`)
})