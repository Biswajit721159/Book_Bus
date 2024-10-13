let { Schema, model } = require("mongoose")

const Bus_detailSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            lowecase: true,
            trim: true,
        },
        bus_name: {
            type: String,
            unique: true,
            required: true,
        },
        Total_seat: {
            type: Number,
            required: [true, 'Total_seat is required']
        },
        station_data: [{
            station: {
                type: String,
                required: true
            },
            arrived_time: {
                type: String,
                required: true
            },
            Distance_from_Previous_Station: {
                type: Number,
                required: [true, 'Distance from previous station is required']
            },
        }]
    },
    {
        timestamps: true
    }
)

let Bus_detail = model("Bus_detail", Bus_detailSchema);
module.exports = Bus_detail;