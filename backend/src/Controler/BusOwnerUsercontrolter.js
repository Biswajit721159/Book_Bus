let BusOwnerUser = require('../models/BusOwnerUser_models')
let { ApiResponse } = require("../utils/ApiResponce");


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

        const existedUser = await BusOwnerUser.findOne({
            $or: [{ email }],
        });

        if (existedUser) {
            return res
                .status(409)
                .json(new ApiResponse(409, null, `User already exists`));
        }

        const user = await BusOwnerUser.create({
            name,
            email,
            password,
        });

        const createdUser = await BusOwnerUser.findById(user._id).select("-password");

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
        res
            .status(500)
            .json(new ApiResponse(500, null, "Server down !"));
        return;
    }
};

const generateAccessAndRefereshTokens = async (userId, res) => {
    try {
        const user = await BusOwnerUser.findById(userId);
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
        const user = await BusOwnerUser.findOne({
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
        const loggedInUser = await BusOwnerUser.findById(user._id).select(["-createdAt", "-updatedAt", "-__v", "-password"]);
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

module.exports = { login, register }
