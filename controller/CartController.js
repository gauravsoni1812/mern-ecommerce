const { Cart } = require("../model/CartModel");

exports.fetchCartByUser = async (req, res) => {
    const { id } = req.user;
 
    try {
        const cartItems = await Cart.find({user:id}).populate('product');
        // Add this line for debugging
        res.status(200).json(cartItems);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.addToCart = async (req, res) => {

    const {id} = req.user;
    const cart = new Cart({...req.body , user:id});

    try {
        const response = await cart.save();
        const result = await response.populate('product')
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json(error);
    }
};

exports.deleteFromCart = async (req, res) => {
    const {id} = req.params;

    try {
        const doc = await Cart.findByIdAndDelete(id);
        res.status(200).json(doc);
    } catch (error) {
        res.status(400).json(error);
    }
};

exports.updateCart = async(req, res)=>{
    const {id} = req.params;
    // console.log(req.body);
    // console.log(id);
    const item = await Cart.findById(id)
    try {
        const cart = await Cart.findByIdAndUpdate(id, req.body, {new:true}).populate('product');
        res.status(201).json(cart)
    } catch (error) {
        res.status(400).json(error)
    }
}