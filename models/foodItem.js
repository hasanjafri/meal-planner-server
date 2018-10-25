import mongoose from 'mongoose';

const { Schema } = mongoose;

class foodItem extends Schema {
    constructor() {
        const foodItem = super ({
            calories: {
                type: Number,
                required: true,
                min: 0
            },
            carbs: {
                type: Number,
                required: true,
                min: 0
            },
            fat: {
                type: Number,
                required: true,
                min: 0
            },
            fiber: {
                type: Number,
                required: true,
                min: 0
            },
            protein: {
                type: Number,
                required: true,
                min: 0
            },
            quantity: {
                type: Number,
                required: true,
                min: 0
            },
            sodium: {
                type: Number,
                required: true,
                min: 0
            },
            sugar: {
                type: Number,
                required: true,
                min: 0
            },
            intervals : {
                type: Number,
                required: true,
                min: 0
            },
            title: {
                type: String,
                required: true,
                unique: true,
                trim: true,
                minlength: [3, "foodItem name must be at least 3 characters long."]
            },
            unit: {
                type: String,
                required: true,
                trim: true,
                minlength: [2, "foodItem unit must be at least 2 characters long."]
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            lastUpdated: {
                type: Date,
                default: Date.now
            }
        });
        return foodItem;
    }
}

export default mongoose.model('foodItem', new foodItem);