const { Order } = require("../model/orderModel");

exports.fetchOrdersByUser = async (req, res) => {

    const { id } = req.user;

    try {
        const orders = await Order.find({user:id});
        res.status(200).json(orders);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.createOrder = async (req, res) => {
    const order = new Order(req.body);

    try {
        const response = await order.save();
        res.status(201).json(response);
    } catch (error) {
        res.status(400).json(error);
    }
};

exports.deleteOrder = async (req, res) => {
    const {id} = req.params;

    try {
        const order = await Order.findByIdAndDelete(id);
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json(error);
    }
};

exports.updateOrder = async(req, res)=>{
    const {id} = req.params;

    try {
        const order = await Order.findByIdAndUpdate(id, req.body, {new:true});
        res.status(201).json(order)
    } catch (error) {
        res.status(400).json(error)
    }
}

exports.fetchAllOrders = async (req, res) => {
    //TODO : we have to try with multiple categories and brands after frontend
    let query = Order.find({deleted:{$ne:true}});
    let totalOrdersQuery=Order.find({});

 

    if (req.query._sort && req.query._order) {
        query = query.sort({ [req.query._sort]: req.query._order });
    }

    const totalDocs = await totalOrdersQuery.count().exec();
     

    if (req.query._page && req.query._limit) {
        const pageSize = req.query._limit;
        const page = req.query._page;
        query = query.skip((page - 1) * pageSize).limit(pageSize);
    }

    try {
        const response = await query.exec();
        res.set('X-Total-Count', totalDocs );
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json(error);
    }
};