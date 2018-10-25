import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema } = mongoose;

class User extends Schema {
    constructor() {
        const user = super({
            userEmail: {
                type: String,
                required: true,
                unique: true,
                trim: true,
                minlength: [7, 'Email must be 7 characters or more in the format: x@x.com']
            },
            password: {
                type: String,
                required: true,
                minlength: [8, 'Password must be 8 characters or more.'],
            },
            fullName: {
                type: String,
                required: true
            },
            resetPassword: {
                token: String,
                expiry: Date
            },
            lastUpdated: {
                type: Date,
                default: Date.now
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        });

        user.methods.comparePassword = this.comparePassword;
        return user;
    }

    comparePassword(password) {
        return bcrypt.compareSync(password, this.password);
    }
}

export default mongoose.model('User', new User);