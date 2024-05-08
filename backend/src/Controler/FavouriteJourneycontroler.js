let FavouriteJourney = require('../models/FavouriteJourney_models')
let { ApiResponse } = require('../utils/ApiResponse')

async function AddFavouriteJourney(req, res) {
    try {
        let { email, booking_id } = req.body
        if (!email || !booking_id) {
            return res
                .status(404)
                .json(new ApiResponse(404, [], "some parameter is missing!"));
        }
        else {
            let journey = await FavouriteJourney.create(req.body)
            if (journey) {
                return res
                    .status(201)
                    .json(new ApiResponse(201, [], "Journey is added successfully"));
            } else {
                return res
                    .status(500)
                    .json(new ApiResponse(500, [], "Server down ! "));
            }
        }
    } catch {
        return res
            .status(500)
            .json(new ApiResponse(500, [], "Server down !"));
    }
}

async function RemoveFavouriteJourney(req, res) {
    try {
        let deletedjourney = await FavouriteJourney.deleteOne({ booking_id: req?.params?.booking_id })
        if (deletedjourney.acknowledged && deletedjourney.deletedCount) {
            return res
                .status(200)
                .json(new ApiResponse(200, [], "Journey is deleted successfully"));
        } else {
            return res
                .status(500)
                .json(new ApiResponse(500, [], "Server down !"));
        }
    } catch {
        return res
            .status(500)
            .json(new ApiResponse(500, [], "Server down !"));
    }
}

async function GetFavouriteJourneyByemail(req, res) {
    try {
        let journey = await FavouriteJourney.find({ email: req?.params?.email })
        if (journey?.length) {
            return res
                .status(200)
                .json(new ApiResponse(200, journey, "Journey is found successfully !"));
        } else {
            return res
                .status(404)
                .json(new ApiResponse(404, [], "Journey not found !"));
        }
    } catch {
        return res
            .status(500)
            .json(new ApiResponse(500, [], "Server down !"));
    }
}



module.exports = {
    AddFavouriteJourney,
    RemoveFavouriteJourney,
    GetFavouriteJourneyByemail,
}