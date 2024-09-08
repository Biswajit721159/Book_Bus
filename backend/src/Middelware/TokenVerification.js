const admin = require("../models/adminUser.js");
let { ApiResponse } = require("../utils/ApiResponse.js");
let jwt = require("jsonwebtoken");

async function verifytoken(req, res, next) {
    try {
        let jwtKey = process.env.ACCESS_TOKEN_SECRET;
        let token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");
        if (token) {
            try {
                const decodedToken = jwt.verify(token, jwtKey);
                if (decodedToken) {
                    req.user = decodedToken;
                    next();
                } else {
                    res.status(498).json(new ApiResponse(498, null, "Invalid Token"));
                }
            } catch {
                res.status(498).json(new ApiResponse(498, null, "Invalid Token"));
            }
        } else {
            res.status(498).json(new ApiResponse(498, null, "Invalid Token"));
        }
    } catch {
        res
            .status(500)
            .json(new ApiResponse(500, null, "Server down !"));
    }
}

module.exports = verifytoken;