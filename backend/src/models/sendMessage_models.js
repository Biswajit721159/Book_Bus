let { Schema, model } = require("mongoose")

const sendMessageSchema = new Schema(
    {
        bus_id: {
            type: Schema.Types.ObjectId,
            ref: "BusOwnerDataBase"
        },
        message: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true
    }
)

let sendMessage = model("sendMessage", sendMessageSchema);
module.exports = sendMessage;