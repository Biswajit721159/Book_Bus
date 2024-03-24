const MasterList = require('../models/MasterList_models')
let { ApiResponse } = require("../utils/ApiResponce");
const ObjectID = require('mongodb').ObjectId;


const DeleteMasterUser = async (req, res) => {
    try {
        let _id = req.body.user_id
        let result = await MasterList.deleteOne({ _id: new ObjectID(_id) })
        if (result.deletedCount) {
            res
                .status(200)
                .json(new ApiResponse(200, null, "MasterList user deleted"));
        }
        else {
            res
                .status(404)
                .json(new ApiResponse(404, null, "MasterUser not found !"));
        }
    }
    catch {
        res
            .status(500)
            .json(new ApiResponse(500, null, "Server down !"));
    }
}

const GetMasterUser = async (req, res) => {
    try {
        let result = await MasterList.find({ email: req.params.user_id });
        if (result) res
            .status(200)
            .json(new ApiResponse(200, result, "Success"));
        else {
            res
                .status(404)
                .json(new ApiResponse(404, null, "User not found !"));
        }
    }
    catch {
        res
            .status(500)
            .json(new ApiResponse(500, null, "Server down !"));
    }
}

const PostMasterUser = async (req, res) => {
    try {
        let result = await MasterList.create(req.body);
        if (result) {
            res
                .status(201)
                .json(new ApiResponse(201, null, "MasterList User Created Successfully"));
        }
        else {
            res
                .status(500)
                .json(new ApiResponse(500, null, "Server down !"));
        }
    } catch {
        res
            .status(500)
            .json(new ApiResponse(500, null, "Server down !"));
    }
}

const UpdateMasterUser = async (req, res) => {
    try {
        let result = await MasterList.updateOne(
            { user_id: new ObjectID(req.body.user_id) },
            { $set: { name: req.body.name } }
        );
        if (result.modifiedCount) {
            res
                .status(200)
                .json(new ApiResponse(200, null, "MasterList User SucessFullly Updated"));
        }
        else {
            res
                .status(404)
                .json(new ApiResponse(404, null, "User not found !"));
        }
    }
    catch {
        res
            .status(500)
            .json(new ApiResponse(500, null, "Server down !"));
    }
}

module.exports = { DeleteMasterUser, GetMasterUser, PostMasterUser, UpdateMasterUser }