const Bus_detail = require('../models/Bus_detail_models.js');
let BusOwnerDataBase = require('../models/BusOwnerDataBase')
let { ApiResponse } = require("../utils/ApiResponse.js");

const getBusById = async (req, res) => {
    try {
        let { id } = req.params;
        let result = await BusOwnerDataBase.findOne({ _id: id })
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

const getBuses = async (req, res) => {
    try {
        if (req.user.role === "200") {
            return res
                .status(401)
                .json(new ApiResponse(401, [], "Unauthorized"));
        } else {
            return await getBusesForBusOwner(req, res);
        }
    } catch {
        res
            .status(500)
            .json(new ApiResponse(500, [], "Server down !"));
    }
}


const getBusesForBusOwner = async (req, res) => {
    let limit = 10;
    let { page } = req.query;
    page = page ? parseInt(page) : 1;
    let count = await BusOwnerDataBase.countDocuments({ email: req.user.email });

    let result = await BusOwnerDataBase.find({ email: req.user.email })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });
    let data = {
        data: result,
        totalPage: Math.ceil(count / limit)
    };

    if (result.length > 0) {
        return res.status(200).json(new ApiResponse(200, data, "success"));
    } else {
        return res.status(404).json(new ApiResponse(404, [], "Ticket not found!"));
    }
}

const getBusesForAdmin = async (req, res) => {
    let limit = 10;
    let { page } = req.query;
    page = page ? parseInt(page) : 1;
    let count = await BusOwnerDataBase.countDocuments({});

    let result = await BusOwnerDataBase.find({})
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });
    let data = {
        data: result,
        totalPage: Math.ceil(count / limit)
    };

    if (result.length > 0) {
        return res.status(200).json(new ApiResponse(200, data, "success"));
    } else {
        return res.status(404).json(new ApiResponse(404, [], "Ticket not found!"));
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

const findBussByFilter = async (req, res) => {
    try {
        if (req.user.role !== '200') {
            return res
                .status(401)
                .json(new ApiResponse(401, [], "Unauthorized"));
        }

        let pending = req.query.pending;
        let approved = req.query.approved;
        let rejected = req.query.rejected;
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let limit = 10;

        const skip = (page - 1) * limit;

        let filter = {};
        if (approved === "true") {
            filter.status = "approved";
        } else if (pending === "true") {
            filter.status = "pending";
        } else if (rejected === "true") {
            filter.status = "rejected";
        }

        let sortFilter = { updatedAt: -1 };

        let pipeline = [
            { $match: filter },
            { $sort: sortFilter },
            { $skip: skip },
            { $limit: limit }
        ];

        const countResult = await BusOwnerDataBase.aggregate([
            { $match: filter },
            { $count: "totalCount" }
        ]);

        let result = await BusOwnerDataBase.aggregate(pipeline);

        const totalCount = countResult.length > 0 ? countResult[0].totalCount : 0;
        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json(new ApiResponse(200, {
            result: result,
            totalPage: totalPages
        }, "success"));
    } catch (e) {
        console.log("Error:", e);
        res.status(500).json(new ApiResponse(500, [], "Server down!"));
    }
};

const getBussByEmail = async (req, res) => {
    try {
        if (!req.user.email) {
            return res.status(400).json(new ApiResponse(400, null, 'Email not found!'));
        }
        let buss = await Bus_detail.find({ email: req.user.email }).select('+_id +bus_name -Total_seat -createdAt -station_data -updatedAt -__v -email');
        let bussLen = buss.length;
        res.status(200).json(new ApiResponse(200, buss, `Total ${bussLen} bus${bussLen === 0 ? '' : 's'} found.`));
    } catch (e) {
        res.status(500).json(new ApiResponse(500, [], "Server down!"));
    }
}

module.exports = { getBusById, getBuses, AddBusInBusOwnerDataBase, findBussByFilter, getBussByEmail }