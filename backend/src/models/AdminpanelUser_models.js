let { Schema, model } = require("mongoose")
let jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs');

const Adminpanel_userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
    },
    {
        timestamps: true
    }
)

Adminpanel_userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

Adminpanel_userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

Adminpanel_userSchema.methods.generateAccessToken = function () {
    let data = jwt.sign(
        {
            _id: (this._id),
            email: this.email,
            name: this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
    return data;
}


let Adminpanel_user = model("Adminpanel_user", Adminpanel_userSchema);
module.exports = Adminpanel_user;