let { Schema, model } = require("mongoose")
let jwt = require("jsonwebtoken")
let bcrypt = require("bcrypt")

const BusOwnerUserSchema = new Schema(
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

BusOwnerUserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

BusOwnerUserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

BusOwnerUserSchema.methods.generateAccessToken = function () {
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


let User = model("BusOwnerUser", BusOwnerUserSchema);
module.exports = User;