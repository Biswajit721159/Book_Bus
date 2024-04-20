const MasterList = require('../models/MasterList_models')
let { ApiResponse } = require("../utils/ApiResponce");


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
        let result = await MasterList.find({ user_id: req.params.user_id });
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
        let result = await MasterList.create(req.body);
        if (result) {
            res
                .status(201)
                .json(new ApiResponse(201, [], "MasterList User Created Successfully"));
        }
        else {
            res
                .status(500)
                .json(new ApiResponse(500, [], "Server down !"));
        }
    } catch {
        res
            .status(500)
            .json(new ApiResponse(500, [], "Server down !"));
    }
}

const UpdateMasterUser = async (req, res) => {
    try {
        let result = await MasterList.updateOne(
            { _id: req.params.user_id },
            { $set: { name: req.body.name } }
        );
        if (result.modifiedCount) {
            res
                .status(200)
                .json(new ApiResponse(200, [], "MasterList User SucessFullly Updated"));
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