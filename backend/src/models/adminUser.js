let { Schema, model } = require("mongoose")
let jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs');

const adminSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        companyName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true,
        },
        phoneNumber: {
            type: Number,
            required: true,
            unique: true,
            lowecase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        role: {
            type: String,
            enum: [100, 200],
            default: 100
        }
    },
    {
        timestamps: true
    }
)

adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

adminSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

adminSchema.methods.generateAccessToken = function (rememberMe) {
    let data = jwt.sign(
        {
            _id: (this._id),
            email: this.email,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: rememberMe ? '5d' : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
    return data;
}


let admin = model("admin", adminSchema);
module.exports = admin;