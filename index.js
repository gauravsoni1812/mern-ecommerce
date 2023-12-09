const express = require('express');
require('dotenv').config();
const server = express()

const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const cookieParser = require('cookie-parser');
const { createProduct } = require('./controller/ProductController');
const productRouters = require('./router/ProductRouter'); 
const categoryRouters = require("./router/CategoryRouter") 
const brandRouters = require("./router/BrandsRouter");
const userRouters = require("./router/UserRouter");
const authRouters = require('./router/authRouter');
const cartRouters = require('./router/CartRouter');
const orderRouters = require('./router/OrderRouter');
const { User } = require('./model/userModel');
const { isAuth, sanitiseUser, cookieExtractor } = require('./services/common');
const path = require('path')
const SECRET_KEY = process.env.JWT_SECRET_KEY;
const bcrypt = require("bcrypt")
//JWT options


var opts = {}
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = SECRET_KEY; //TODO:should not be in the code


//middlewares 
server.use(express.static(path.resolve(__dirname,'build')))
server.use(cookieParser());

server.use(session({
    secret: 'keyboard cat',
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored

}));

server.use(passport.authenticate('session'));

server.use(cors());
server.use(express.json()); // to parse req.body
// server.use("/products",productRouters);
server.use('/products', isAuth() , productRouters.router)
server.use('/categories',isAuth() , categoryRouters.router)
server.use('/brands',isAuth() , brandRouters.router)
server.use('/user',isAuth() , userRouters.router)
server.use('/auth', authRouters.router)
server.use('/cart', isAuth() ,cartRouters.router)
server.use('/orders',isAuth() , orderRouters.router)

// passport stategies
passport.use('local', new LocalStrategy(
    { usernameField: 'email' },
    async function (email, password, done) {
        try {
            const user = await User.findOne({ email: email }).exec();
            if (!user) {
                return done(null, false, { message: 'Invalid credentials' });
            }

            // Compare provided password with stored hashed password
            if (bcrypt.compareSync(password, user.password)) {
                const token = jwt.sign(sanitiseUser(user), SECRET_KEY);
                user.token= token;
                return done(null, user);
            } else {
                // Passwords do not match
                return done(null, false, { message: 'Invalid credentials' });
            }
        } catch (error) {
            return done(error);
        }
    } 
));


passport.use('jwt',new JwtStrategy(opts, async function (jwt_payload, done) {
   
      try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
          return done(null,sanitiseUser(user)); // this calls serializer
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    })
  );


// this creates session variable req.user on being called from callbacks 
passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, { id: user.id, role: user.role });
    });
});
// this changes session variable req.user when called from authorised request 

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, sanitiseUser(user));
    });
});


//Payments
 
const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY);

server.post("/create-payment-intent", async (req, res) => {
  const { totalAmount } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount*100,
    currency: "inr",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

 


main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('database connected')
}

server.get('/', (req, res) => {
    res.json({ status: "success" })
})


server.listen(process.env.PORT , () => {
    console.log(`server started on the port ${process.env.PORT}`)
}) 