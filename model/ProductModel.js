const mongoose = require('mongoose');
const { Schema } = mongoose;

// Yahan product ke data ko represent karne ke liye ek schema bana rahe hain.
const productSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, min: [0, 'wrong min price'], max: [100000, 'wrong max price'] },
    discountPercentage: { type: Number, min: [0, 'wrong min discount'], max: [100, 'wrong max discount'] },
    rating: { type: Number, min: [0, 'wrong min rating'], max: [5, 'wrong max rating'], default: 0 },
    stock: { type: Number, min: [0, 'wrong min stock'] },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String, required: true },
    images: { type: [String], required: true },
    deleted: { type: Boolean, default: false },
});

// Yahan ek virtual property ('id') ko schema mein add kiya gaya hai.
const virtual = productSchema.virtual('id');
virtual.get(function() {
    return this._id;
});

// toJSON method set kiya gaya hai taki jab bhi product ko JSON mein convert kiya jaye, '_id' property ko remove kiya jaye.
productSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) {
        delete ret._id;
    }
});

// Yahan mongoose.model() se ek 'product' model create kiya gaya hai jise hum export kar rahe hain.
exports.Product = mongoose.model('product', productSchema);
