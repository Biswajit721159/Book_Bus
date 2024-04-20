let BusOwnerDataBase = require('../models/BusOwnerDataBase')
let { ApiResponse } = require("../utils/ApiResponse.js");

const getBusById = async (req, res) => {
    try {
        let result = await BusOwnerDataBase.find({ '_id': (req.params._id) })
        if (result) {
            res
                .status(200)
                .json(new ApiResponse(200, result, "Success"));
        } else {
            res
                .status(404)
                .json(new ApiResponse(404, [], "Bus Not Found"));
        }
    } catch {
        res
            .status(500)
            .json(new ApiResponse(500, [], "Server down !"));
    }
}

const getBusByEmail = async (req, res) => {
    try {
        let result = await BusOwnerDataBase.find({ email: req.params.email })
        if (result) {
            res
                .status(200)
                .json(new ApiResponse(200, result, "Success"));
        } else {
            res
                .status(404)
                .json(new ApiResponse(404, [], "Bus Not Found"));
        }
    } catch {
        res
            .status(500)
            .json(new ApiResponse(500, [], "Server down !"));
    }
}

const AddBusInBusOwnerDataBase = async (req, res) => {
    try {
        let result = await BusOwnerDataBase.create(req.body);
        if (result) {
            return res.status(201).json(new ApiResponse(201, [], "Bus added sucessfully"));
        } else {
            return res.status(500).json(new ApiResponse(500, [], "server down !"))
        }
    } catch {
        res
            .status(500)
            .json(new ApiResponse(500, [], "Server down !"));
    }
}


module.exports = { getBusById, getBusByEmail, AddBusInBusOwnerDataBase }