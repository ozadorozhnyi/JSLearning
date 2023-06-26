const express = require('express');
const cors = require('cors');
const { faker } = require('@faker-js/faker');

function createRandomUser() {
    const order = {
        id: faker.number.int({ min: 1000, max: 99999 }),
        fullName: `${faker.person.firstName()} ${faker.person.lastName()}`,
        email: faker.internet.email(),
        order: {
            status: "new",
            date: Date.now(),
        }
    };

    const productsCount = faker.number.int({ min: 1, max: 4 });
    order.order.products = [];
    for (let i = 0; i < productsCount; i++) {
        order.order.products.push({
            name: faker.commerce.productName(),
            price: faker.commerce.price({ min: 10, max: 5555, dec: 2 }),
        });
    }

    order.order.total = (order.order.products.reduce(
        (total, product) => total + Number(product.price), 0
    )).toFixed(2);

    return order;
}

const app = express();

app.use(express.static('public', {extensions: ['html']}));
app.use('/css', express.static('public/css'));
app.use('/js', express.static('public/js'));
app.use(cors());

app.get('/orders', (req, res) => {
    if (Math.random() < 0.50) {
        res.status(200).json({
            status: "ok",
            message: "Fullfiled",
            payload: createRandomUser(),
        });
    } else {
        res.status(200).json({
            status: "empty",
            message: "No Content",
            payload: {},
        });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Server started on port 3000.\nCtrl-C to exit');
});
