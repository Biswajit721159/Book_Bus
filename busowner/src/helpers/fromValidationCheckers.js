/**
 * Validates full name.
 * Full name must have two parts, each part between 2 and 50 alphabetic characters.
 */

const validLength = (str) => {
    if (str?.length === 0) return true;
    return false;
}
const validateFullName = (fullName) => {
    if (validLength(fullName)) return false;
    const fullNameRegex = /^[A-Za-z]{2,}(?: [A-Za-z'’-]{2,})+$/;
    return fullNameRegex.test(fullName.trim());
}

/**
 * Validates company name.
 * Company name must be between 2 and 100 characters, allowing letters, numbers, &, -, and .
 */
const validateCompanyName = (companyName) => {
    if (validLength(companyName)) return false;
    const companyNameRegex = /^[A-Za-z0-9&\-. ]{2,100}$/;
    return companyNameRegex.test(companyName.trim());
}

/**
 * Validates email address.
 * Email must be a valid format and between 5 and 100 characters.
 */
const validateEmail = (email) => {
    if (validLength(email)) return false;
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return email.length >= 5 && email.length <= 100 && emailRegex.test(email.trim());
}

/**
 * Validates phone number.
 * Phone number must be between 10 and 15 digits, allowing optional country code.
 */
const validatePhoneNumber = (phoneNumber) => {
    if (validLength(phoneNumber)) return false;
    const phoneNumberRegex = /^\+?(\d{1,3})?[- ]?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/;
    const sanitizedPhoneNumber = phoneNumber.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    return sanitizedPhoneNumber.length >= 10 && sanitizedPhoneNumber.length <= 15 && phoneNumberRegex.test(phoneNumber.trim());
}

/**
 * Validates password.
 * Password must be between 8 and 20 characters, and must contain at least:
 * - One uppercase letter
 * - One lowercase letter
 * - One digit
 * - One special character (@$!%*?&#)
 */
const validatePassword = (password) => {
    if (validLength(password)) return false;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,20}$/;
    return passwordRegex.test(password);
}

/**
 * Validates that password and confirm password are the same.
 */
const validateConfirmPassword = (password, confirmPassword) => {
    return password === confirmPassword;
}



export {
    validateFullName,
    validateCompanyName,
    validateEmail,
    validatePhoneNumber,
    validatePassword,
    validateConfirmPassword
} 