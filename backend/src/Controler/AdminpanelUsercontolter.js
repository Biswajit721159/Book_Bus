let Adminpanel_user = require('../models/BusOwnerUser_models')
let BusOwnerDataBase = require('../models/BusOwnerDataBase')
const Bus_detail = require('../models/Bus_detail_models')
let { ApiResponse } = require("../utils/ApiResponse.js");
let admin = require("../models/adminUser.js");

let UpdateBusDetail = async (req, res) => {
    try {
        let result = await BusOwnerDataBase.updateOne(
            { _id: (req.body.data._id) },
            { $set: { status: req.body.status } }
        );
        if (result.acknowledged && req.body.status == 'approved') {
            delete req.body.data.status
            let result = await Bus_detail.create(req.body.data);
            if (result) {
                return res
                    .status(201)
                    .json(new ApiResponse(201, [], "Update BusOwner DataBase and Append into Bus Detail DataBase"));
            } else {
                return res
                    .status(500)
                    .json(new ApiResponse(500, [], "Update BusOwner DataBase and Not Append into Bus Detail DataBase"));
            }
        }
        else {
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

let AdminPanelgetdata = async (req, res) => {
    try {
        let result = await BusOwnerDataBase.find({})
        let ans = []
        for (let i = 0; i < result.length; i++) {
            if (result[i].status == 'pending') {
                ans.push(result[i])
            }
        }
        for (let i = 0; i < result.length; i++) {
            if (result[i].status != 'pending') {
                ans.push(result[i])
            }
        }
        if (result) {
            return res
                .status(200)
                .json(new ApiResponse(200, result, "Success"));
        }
        else {
            return res
                .status(404)
                .json(new ApiResponse(404, [], "Not found !"));
        }
    } catch {
        return res
            .status(500)
            .json(new ApiResponse(500, [], "Server down !"));
    }
}

let register = async (req, res) => {
    try {
        const user = await admin.create(req.body);
        if (!user) {
            return res
                .status(500)
                .json(new ApiResponse(500, [], "Something went wrong while registering the user"));
        }
        return res
            .status(201)
            .json(new ApiResponse(201, null, "User registered successfully."));
    } catch (e) {
        return res
            .status(500)
            .json(new ApiResponse(500, [], "Server down !"));
    }
};

const generateAccessAndRefereshTokens = async (user, res, rememberMe) => {
    try {
        const accessToken = user.generateAccessToken(rememberMe);
        return accessToken;
    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiResponse(
                    500,
                    [],
                    "Something went wrong while generating referesh and access token"
                )
            );
    }
};

const login = async (req, res) => {
    try {
        const { email, password, rememberMe = false } = req.body;
        if (!password && !email) {
            res
                .status(204)
                .json(new ApiResponse(204, [], "Password and email is required"));
        }
        let user = await admin.findOne({
            $or: [{ email }],
        }).select(["-createdAt", "-updatedAt", "-__v"]);
        if (!user) {
            res.status(404).json(new ApiResponse(404, [], "User does not exist"));
            return;
        }
        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            res
                .status(401)
                .json(new ApiResponse(401, [], "Invalid user credentials"));
            return;
        }
        const accessToken = await generateAccessAndRefereshTokens(user, res, rememberMe);
        if (user.toObject) {
            user = user.toObject();
        }
        delete user.password;
        const options = {
            httpOnly: true,
            secure: true,
        };
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        user: user,
                        auth: accessToken,
                    },
                    "User logged In Successfully"
                )
            );
    } catch {
        res
            .status(500)
            .json(new ApiResponse(500, [], "Server down !"));
    }
}

module.exports = { login, register, AdminPanelgetdata, UpdateBusDetail }
