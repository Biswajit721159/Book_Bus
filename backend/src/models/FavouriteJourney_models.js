let { Schema, model } = require("mongoose")

const FavouriteJourneySchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            lowecase: true,
            trim: true,
        },
        booking_id: {
            type: Schema.Types.ObjectId,
            ref: "Booking",
            unique: true,
        }
    },
    {
        timestamps: true
    }
)

let FavouriteJourney = model("FavouriteJourney", FavouriteJourneySchema);
module.exports = FavouriteJourney;