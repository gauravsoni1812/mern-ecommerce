const { User } =require('../model/userModel');

exports.fetchAllUsers = async(req, res)=>{
    try {
        const users = await User.find({}).exec();
        res.status(200).json(users);
     } catch (error) {
        res.status(400).json(error);
     }
};

exports.fetchUserById = async (req, res) => {
    const {id} = req.user;
 
    try {
       const user = await User.findById(id);

       res.status(200).json({id:user.id,addresses:user.addresses,email:user.email,role:user.role});
    } catch (error) {
       res.status(400).json(error);
    }
 
};


exports.updateUser = async(req, res)=>{

    const {id} = req.params;
    try {
        const user = await User.findByIdAndUpdate(id, req.body, {new:true});
        res.status(201).json(user)
    } catch (error) {
        res.status(400).json(error)
    }
}