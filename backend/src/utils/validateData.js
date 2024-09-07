const { ApiResponse } = require("./ApiResponse");
const {
    validateFullName,
    validateCompanyName,
    validateEmail,
    validatePhoneNumber,
    validatePassword,
} = require('../helpers/fromValidation');
const admin = require('../models/adminUser');

const validateRegisterData = async (req, res, next) => {
    try {
        const { fullName, companyName, email, phoneNumber, password } = req.body;
        if (!fullName || !companyName || !email || !phoneNumber || !password) {
            return res
                .status(400)
                .json(new ApiResponse(400, null, 'Some required fields are missing'));
        }
        if (!validateFullName(fullName)) {
            return res
                .status(400)
                .json(new ApiResponse(400, null, 'Invalid full name format'));
        }

        if (!validateCompanyName(companyName)) {
            return res
                .status(400)
                .json(new ApiResponse(400, null, 'Invalid company name format'));
        }

        if (!validateEmail(email)) {
            return res
                .status(400)
                .json(new ApiResponse(400, null, 'Invalid email format'));
        }

        if (!validatePhoneNumber(phoneNumber)) {
            return res
                .status(400)
                .json(new ApiResponse(400, null, 'Invalid phone number format'));
        }

        if (!validatePassword(password)) {
            return res
                .status(400)
                .json(new ApiResponse(400, null, 'Invalid password format'));
        }
        let user = await admin.findOne({
            $or: [
                { email: email },
                { phoneNumber: phoneNumber },
                { companyName: companyName }
            ]
        });

        if (!user) {
            next();
        } else {
            return res
                .status(409)
                .json(new ApiResponse(409, null, 'User already exists with the provided email, phone number, or company name.'));
        }

    } catch (error) {
        console.error('Error validating registration data:', error);
        return res
            .status(500)
            .json(new ApiResponse(500, null, 'Internal server error'));
    }
};

module.exports = { validateRegisterData };
