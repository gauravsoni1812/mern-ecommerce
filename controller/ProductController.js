const { Product } = require("../model/ProductModel");

exports.createProduct = async(req, res)=>{
    const product = new Product(req.body);
    try {
        const response = await product.save();
        res.status(201).json(response)
    } catch (error) {
        res.status(400).json(error)
    }
}

exports.fetchAllProducts = async (req, res) => {
    //TODO : we have to try with multiple categories and brands after frontend
    let condition = {};
    if(!req.query.admin){
      condition.deleted = {$ne:true};
    }
    let query = Product.find(condition);
    let totalProductsQuery=Product.find(condition);

    if (req.query.category) {
        query = query.find({ category: req.query.category });
        totalProductsQuery = totalProductsQuery.find({ category: req.query.category });

    }

    if (req.query.brand) {
        query = query.find({ brand: req.query.brand });
        totalProductsQuery= totalProductsQuery.find({ brand: req.query.brand });
    }

    if (req.query._sort && req.query._order) {
        query = query.sort({ [req.query._sort]: req.query._order });
    }

    const totalDocs = await totalProductsQuery.count().exec();

    if (req.query._page && req.query._limit) {
        const pageSize = parseInt(req.query._limit);
        const page = parseInt(req.query._page);
        query = query.skip((page - 1) * pageSize).limit(pageSize);
    }

    try {
        const response = await query.exec();

        const data = {
            products : response,
            totalItems : totalDocs
        }
        
        res.set('X-Total-Count', totalDocs );
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json(error);
    }
};

exports.fetchProductById = async(req, res)=>{
    const {id} = req.params;
    try {
        const product = await Product.findById(id);
        res.status(201).json(product)
    } catch (error) {
        res.status(400).json(error)
    }

}

exports.updateProduct = async(req, res)=>{
    const {id} = req.params;
    try {
        const product = await Product.findByIdAndUpdate(id, req.body, {new:true});
        res.status(201).json(product)
    } catch (error) {
        res.status(400).json(error)
    }
}