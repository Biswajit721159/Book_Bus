let { Schema, model } = require("mongoose")

const BusOwnerDataBaseSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            lowecase: true,
            trim: true,
        },
        bus_name: {
            type: String,
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
        }],
        status: {
            type: String,
            enum: ['rejected', 'approved', 'pending'],
            default: 'pending' 
        }
    },
    {
        timestamps: true
    }
)

let BusOwnerDataBase = model("BusOwnerDataBase", BusOwnerDataBaseSchema);
module.exports = BusOwnerDataBase;