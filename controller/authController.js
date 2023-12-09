const { User } = require("../model/userModel");
const crypto = require('crypto');
const { sanitiseUser } = require("../services/common");
const SECRET_KEY = process.env.JWT_SECRET_KEY;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.createUser = async (req, res) => {
    try {

        const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
    
        try {
            const user = new User({ ...req.body, password: hashedPassword });
            const doc = await user.save();

            req.login(sanitiseUser(doc), (err) => {
                if (err) {
                    return res.status(400).json({ error: 'Error during login' });
                }

                const token = jwt.sign(sanitiseUser(doc), SECRET_KEY);
                res.cookie('jwt', token, { expires: new Date(Date.now() + 3600000), httpOnly: true }).status(201).json({id:doc.id, role:doc.role});
            });
        } catch (error) {
            return res.status(500).json({ error: 'Error saving user' });
        }
    


        // crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async function (err, hashedPassword) {
        //     if (err) {
        //         return res.status(500).json({ error: 'Error generating hashed password' });
        //     }

        //     try {
        //         const user = new User({ ...req.body, password: hashedPassword, salt });
        //         const doc = await user.save();

        //         req.login(sanitiseUser(doc), (err) => {
        //             if (err) {
        //                 return res.status(400).json({ error: 'Error during login' });
        //             }

        //             const token = jwt.sign(sanitiseUser(doc), SECRET_KEY);
        //             res.cookie('jwt', token, { expires: new Date(Date.now() + 3600000), httpOnly: true }).status(201).json({id:doc.id, role:doc.role});
        //         });
        //     } catch (error) {
        //         return res.status(500).json({ error: 'Error saving user' });
        //     }
        // });
    } catch (error) { 
        return res.status(400).json({ error: 'Error generating salt' });
    }
};



exports.loginUser = async (req, res) => {
    // console.log(req)
    // this one ?
    res.cookie('jwt', req.user.token , { expires: new Date(Date.now() + 3600000), httpOnly: true }).status(201).json(req.user.token);
};
 

exports.checkAuth = async (req, res) => {
   if(req.user){
    res.json(req.user)
   }else{
    res.sendStatus(401);
   }
   
} 