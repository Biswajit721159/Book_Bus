let Adminpanel_user = require('../models/BusOwnerUser_models')
let BusOwnerDataBase = require('../models/BusOwnerDataBase')
const Bus_detail = require('../models/Bus_detail_models')
let { ApiResponse } = require("../utils/ApiResponce");

let UpdateBusDetail = async (req, res) => {
    try {
        let result = await BusOwnerDataBase.updateOne(
            { _id: new ObjectID(req.body.data._id) },
            { $set: { status: req.body.status } }
        );
        if (result.acknowledged && req.body.status == 'approved') {
            delete req.body.data.status
            let result = await Bus_detail.insertOne(req.body.data);
            if (result) {
                return res
                    .status(201)
                    .json(new ApiResponse(201, null, "Update BusOwner DataBase and Append into Bus Detail DataBase"));
            } else {
                return res
                    .status(500)
                    .json(new ApiResponse(500, null, "Update BusOwner DataBase and Not Append into Bus Detail DataBase"));
            }
        }
        else {
            return res
                .status(500)
                .json(new ApiResponse(500, null, "Server down !"));
        }
    } catch {
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Server down !"));
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
                .json(new ApiResponse(404, null, "Not found !"));
        }
    } catch {
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Server down !"));
    }
}

let register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (
            name == undefined ||
            email == undefined ||
            password == undefined
        ) {
            return res
                .status(204)
                .json(new ApiResponse(204, null, "All fields are required"));
        }

        const existedUser = await Adminpanel_user.findOne({
            $or: [{ email }],
        });

        if (existedUser) {
            return res
                .status(409)
                .json(new ApiResponse(409, null, `User already exists`));
        }

        const user = await Adminpanel_user.create({
            name,
            email,
            password,
        });

        const createdUser = await Adminpanel_user.findById(user._id).select("-password");

        if (!createdUser) {
            return res
                .status(500)
                .json(
                    new ApiResponse(
                        500,
                        null,
                        "Something went wrong while registering the user"
                    )
                );
        }
        return res
            .status(201)
            .json(new ApiResponse(201, createdUser, "User registered Successfully"));
    } catch {
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Server down !"));
    }
};

const generateAccessAndRefereshTokens = async (userId, res) => {
    try {
        const user = await Adminpanel_user.findById(userId);
        const accessToken = user.generateAccessToken();
        return accessToken;
    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiResponse(
                    500,
                    null,
                    "Something went wrong while generating referesh and access token"
                )
            );
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!password && !email) {
            res
                .status(204)
                .json(new ApiResponse(204, null, "Password and email is required"));
        }
        const user = await Adminpanel_user.findOne({
            $or: [{ email }],
        }).select(["-createdAt", "-updatedAt", "-__v"]);
        if (!user) {
            res.status(404).json(new ApiResponse(404, null, "User does not exist"));
            return;
        }
        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            res
                .status(401)
                .json(new ApiResponse(401, null, "Invalid user credentials"));
            return;
        }
        const accessToken = await generateAccessAndRefereshTokens(user._id, res);
        const loggedInUser = await Adminpanel_user.findById(user._id).select(["-createdAt", "-updatedAt", "-__v", "-password"]);
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
                        user: loggedInUser,
                        auth: accessToken,
                    },
                    "User logged In Successfully"
                )
            );
    } catch {
        res
            .status(500)
            .json(new ApiResponse(500, null, "Server down !"));
    }
}

module.exports = { login, register,AdminPanelgetdata,UpdateBusDetail }
