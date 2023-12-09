const mongoose = require('mongoose');
const { Schema } = mongoose;

// Yahan product ke data ko represent karne ke liye ek schema bana rahe hain.
const BrandSchema = new Schema({
    value: { type: String, required: true , unique:true },
    label: { type: String, required: true , unique:true },
});

// Yahan ek virtual property ('id') ko schema mein add kiya gaya hai.
 const virtual = BrandSchema.virtual('id');
 virtual.get(function() {
     return this._id;
 });

// toJSON method set kiya gaya hai taki jab bhi product ko JSON mein convert kiya jaye, '_id' property ko remove kiya jaye.
 BrandSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) {
        delete ret._id;
    }
});

// Yahan mongoose.model() se ek 'product' model create kiya gaya hai jise hum export kar rahe hain.
exports.Brand = mongoose.model('Brand', BrandSchema);
