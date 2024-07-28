const MasterList = require('../models/MasterList_models')
let { ApiResponse } = require("../utils/ApiResponse.js");


const DeleteMasterUser = async (req, res) => {
    try {
        let _id = req.params.user_id;
        let result = await MasterList.deleteOne({ _id: _id });
        if (result.deletedCount) {
            res.status(200).json(new ApiResponse(200, [], "MasterList user deleted"));
        } else {
            res.status(404).json(new ApiResponse(404, [], "MasterUser not found !"));
        }
    } catch (error) {
        res.status(500).json(new ApiResponse(500, [], "Server down !"));
    }
}


const GetMasterUser = async (req, res) => {
    try {
        let result = await MasterList.find({ user_id: req.params.user_id }).select(["-createdAt", "-__v", "-updatedAt"]);
        if (result) res
            .status(200)
            .json(new ApiResponse(200, result, "Success"));
        else {
            res
                .status(404)
                .json(new ApiResponse(404, [], "User not found !"));
        }
    }
    catch {
        res
            .status(500)
            .json(new ApiResponse(500, [], "Server down !"));
    }
}

const PostMasterUser = async (req, res) => {
    try {
        const count = await MasterList.countDocuments({ user_id: req.body?.user_id });
        if (count >= 10) {
            return res.status(401).json(new ApiResponse(401, [], "Your masterList user limit has exit.You need delete some user first"));
        }
        let result = await MasterList.create(req.body);
        let resultObject = result.toObject();
        delete resultObject.updatedAt;
        delete resultObject.createdAt;
        delete resultObject.__v;
        if (resultObject) {
            res
                .status(201)
                .json(new ApiResponse(201, resultObject, "MasterList user created successfully"));
        } else {
            res
                .status(500)
                .json(new ApiResponse(500, [], "Server down!"));
        }

    } catch {
        res
            .status(500)
            .json(new ApiResponse(500, [], "Server down !"));
    }
}

const UpdateMasterUser = async (req, res) => {
    try {
        let result = await MasterList.findByIdAndUpdate(
            req.params.user_id,
            { name: req.body.name },
            { new: true }
        ).select(["-createdAt", "-__v", "-updatedAt"]);
        if (result) {
            res
                .status(200)
                .json(new ApiResponse(200, result, "MasterList user sucessfully updated"));
        }
        else {
            res
                .status(404)
                .json(new ApiResponse(404, [], "User not found !"));
        }
    }
    catch {
        res
            .status(500)
            .json(new ApiResponse(500, [], "Server down !"));
    }
}

module.exports = { DeleteMasterUser, GetMasterUser, PostMasterUser, UpdateMasterUser }