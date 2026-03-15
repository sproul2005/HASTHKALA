const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

const orderSchema = new mongoose.Schema({
    orderItems: [{
        name: String,
        image: String, // Ensure this exists
        customization: {
            image: String // Ensure this exists
        }
    }],
    createdAt: Date
}, { strict: false });

const Order = mongoose.model('Order', orderSchema);

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const order = await Order.findOne().sort({ createdAt: -1 });
        console.log(JSON.stringify(order, null, 2));
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
