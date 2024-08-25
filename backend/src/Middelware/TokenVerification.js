let { ApiResponse } = require("../utils/ApiResponse.js");
let jwt = require("jsonwebtoken");

function verifytoken(req, res, next) {
    try {
        let jwtKey = process.env.ACCESS_TOKEN_SECRET;
        let token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");
        if (token) {
            try {
                const decodedToken = jwt.verify(token, jwtKey);
                req.user=decodedToken;
                if (decodedToken) {
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