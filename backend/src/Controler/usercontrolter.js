let User = require('../models/user_models')
let { ApiResponse } = require("../utils/ApiResponse.js");

const getByEmail = async (req, res) => {
    try {
        let result = await User.findOne({ email: req.params.email }).select(["-createdAt", "-updatedAt", "-__v", "-password"]);
        if (result) {
            res
                .status(200)
                .json(new ApiResponse(200, result, `User Find SuccessFully`));
        } else {
            res
                .status(404)
                .json(new ApiResponse(404, [], `User not found !`));
        }
    }
    catch {
        res
            .status(500)
            .json(new ApiResponse(500, [], "Server down !"));
    }
}

const UpdateByEmail = async (req, res) => {
    try {
        let result = await User.updateOne(
            { email: req.body.email },
            { $set: { name: req.body.name } }
        );
        if (result.acknowledged && result.modifiedCount === 1) {
            res
                .status(200)
                .json(new ApiResponse(200, [], `User Update SuccessFully`));
        }
        else {
            res
                .status(500)
                .json(new ApiResponse(500, [], `User Update SuccessFully`));
        }
    } catch {
        res
            .status(500)
            .json(new ApiResponse(500, [], "Server down !"));
    }
}

const DeleteByEmail = async (req, res) => {
    try {
        let result = await User.deleteOne({ email: req.params.email })
        console.log(result)
        if (result.deletedCount) {
            res
                .status(200)
                .json(new ApiResponse(200, [], `User Delete SuccessFully`));
        }
        else {
            res
                .status(404)
                .json(new ApiResponse(404, [], `User not found !`));
        }
    }
    catch {
        res
            .status(500)
            .json(new ApiResponse(500, [], "Server down !"));
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
                .json(new ApiResponse(204, [], "All fields are required"));
        }

        const existedUser = await User.findOne({
            $or: [{ email }],
        });

        if (existedUser) {
            return res
                .status(409)
                .json(new ApiResponse(409, [], `User already exists`));
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        const createdUser = await User.findById(user._id).select("-password");

        if (!createdUser) {
            return res
                .status(500)
                .json(
                    new ApiResponse(
                        500,
                        [],
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
            .json(new ApiResponse(500, [], "Server down !"));
        return;
    }
};

const generateAccessAndRefereshTokens = async (userId, res) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
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
        const { email, password } = req.body;
        if (!password && !email) {
            res
                .status(204)
                .json(new ApiResponse(204, [], "Password and email is required"));
        }
        const user = await User.findOne({
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
        const accessToken = await generateAccessAndRefereshTokens(user._id, res);
        const loggedInUser = await User.findById(user._id).select(["-createdAt", "-updatedAt", "-__v", "-password"]);
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
            .json(new ApiResponse(500, [], "Server down !"));
    }
}

const getUserByPage = async (req, res) => {
    try {
        let { page = 1, name, email } = req.query;
        let limit = 10;
        let skip = (page - 1) * limit;
        let sortFilter = { updatedAt: -1 };
        let filter = {
            $or: [
                { email: { $regex: email, $options: "i" } },
                { name: { $regex: name, $options: "i" } }
            ]
        }
        let pipeline = [
            { $match: filter },
            { $sort: sortFilter },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    password: 0,
                }
            }
        ];

        const countResult = await User.aggregate([
            { $match: filter },
            { $count: "totalCount" }
        ]);

        let result = await User.aggregate(pipeline);

        const totalCount = countResult.length > 0 ? countResult[0].totalCount : 0;
        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json(new ApiResponse(200, {
            result: result,
            totalPage: totalPages
        }, "success"));
    } catch {
        res
            .status(500)
            .json(new ApiResponse(500, null, "Server down !"));
    }
}

const updateUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        await User.findOneAndUpdate({ email: email }, { name: name });
        res.status(200).json(new ApiResponse(200, null, "success"));
    } catch (e) {
        res
            .status(500)
            .json(new ApiResponse(500, null, "Server down !"));
    }
}

module.exports = { login, register, DeleteByEmail, UpdateByEmail, getByEmail, getUserByPage, updateUser }
