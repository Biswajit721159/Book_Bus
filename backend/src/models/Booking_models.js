let { Schema, model } = require("mongoose")

const BookingSchema = new Schema(
    {
        bus_id: {
            type: Schema.Types.ObjectId,
            ref: "Bus_detail"
        },
        src: {
            type: String,
            required: true,
        },
        dist: {
            type: String,
            required: true,
        },
        useremail: {
            type: String,
            required: true,
        },
        total_money: {
            type: Number,
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        seat_record: {
            type: [Number],
            required: true,
        },
        person: {
            type: [String],
            required: true,
        },
        status:{
            type: [Boolean],
            require: true,
        },
        total_distance: {
            type: Number,
            required: true,
        },
        is_wishlist:{
            type:Boolean,
            defaul: false
        },
    },
    {
        timestamps: true
    }
)

let Booking = model("Booking", BookingSchema);
module.exports = Booking;