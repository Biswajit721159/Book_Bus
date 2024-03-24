let { Schema, model } = require("mongoose")

const MasterListSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        name: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
    },
    {
        timestamps: true
    }
)

let MasterList = model("MasterList", MasterListSchema);
module.exports = MasterList;