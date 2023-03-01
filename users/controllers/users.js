const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const userModel = require('../models/users');
const { producer, consumer } = require('../lib/kafka')
const { successResponse, errorResponse } = require('../lib/response');
const {
    validateUserRegister,
    validateUserRole,
    validateUserPermission,
    validateAuth,
    validateSeller
} = require('../validators/users');
const { validateId } = require('../validators/common');
const saltRounds = 10;

const logStruct = (func, error) => {
    return { 'func': func, 'file': 'userController', error }
}

const createUser = async(reqData) => {
    try {
        const validInput = validateUserRegister(reqData);
        const userExists = await userModel.getUserDetailsByEmail(validInput.email);
        if (userExists && userExists.length) {
            return errorResponse(403, 'userExists');
        }
        validInput.password = bcrypt.hashSync(String(validInput.password), saltRounds);
        const response = await userModel.createUser(validInput);
        const token = jwt.sign({
                user_id: response[0],
                email: validInput.email,
                roles: ["customer"]
            },
            process.env.TOKEN_KEY, {
                expiresIn: "2h",
            }
        );
        await producer(validInput, response[0], 'user');
        await userModel.createPermission({ user_id: response[0], role_id: 3 });
        return successResponse(201, { roles: ['customer'], email: validInput.email, token: token })
    } catch (error) {
        return errorResponse(error.status, error.message);
    }
};

const createUserPermission = async(reqData) => {
    try {
        const validInput = validateUserPermission(reqData);
        const response = await userModel.createPermission(validInput);
        return successResponse(201, response)
    } catch (error) {
        console.error('error -> ', logStruct('createUserPermission', error))
        return errorResponse(error.status, error.message);
    }
};

const createUserRole = async(reqData) => {
    try {
        const validInput = validateUserRole(reqData);
        const response = await userModel.createUserRole(validInput);
        return successResponse(201, response)
    } catch (error) {
        console.error('error -> ', logStruct('createUserRole', error))
        return errorResponse(error.status, error.message);
    }
};

const fetchUser = async(reqData) => {
    try {
        const validInput = validateId(reqData);
        const response = await userModel.getDetailsById(validInput.id);
        return successResponse(200, response)
    } catch (error) {
        console.error('error -> ', logStruct('fetchUser', error))
        return errorResponse(error.status, error.message);
    }
};

const loginUser = async(reqData) => {

    try {

        const validInput = validateAuth(reqData);

        const response = await userModel.getUserDetailsByNameOrEmail(validInput.email);

        const matched = bcrypt.compareSync(String(validInput.password), response[0].password)

        if (!matched) {
            return errorResponse(401, 'wrongPassword');
        }

        const role_response = await userModel.getUserPermission(response[0].id);

        const user_roles = role_response.map(el => el.role);

        const token = jwt.sign({
                user_id: response[0].id,
                email: response[0].email,
                roles: user_roles
            },
            process.env.TOKEN_KEY, {
                expiresIn: "2h",
            }
        );

        return successResponse(200, { roles: user_roles, email: response[0].email, token: token });

    } catch (error) {

        console.error('error -> ', logStruct('fetchUser', error))

        return errorResponse(error.status, error.message);
    }
};

const createSeller = async(reqData) => {
    try {
        const validInput = validateSeller(reqData);
        const userExists = await userModel.getUserDetailsByEmail(validInput.email);
        if (!userExists || !userExists.length) {
            validInput.password = bcrypt.hashSync(String(validInput.password), saltRounds);
            newUser = await userModel.createUser(validInput);
            validInput.user_id = newUser[0];
            validInput.role_id = 2;
            userModel.createPermission(validInput);
        } else {
            sellerExists = await userModel.getSellerDetailsByUserId(userExists[0].id);
            if (sellerExists && sellerExists.length) {
                return errorResponse(400, 'existingSeller');
            }
            validInput.user_id = userExists[0].id;
        }

        const response = await userModel.createSeller(validInput);
        validInput.seller_id = response[0];
        await producer(validInput, newUser[0], 'user');
        return successResponse(201, { name: validInput.name, email: validInput.email, id: response[0] })
    } catch (error) {
        console.error('error -> ', logStruct('createSeller', error))
        return errorResponse(error.status, error.message);
    }
};

module.exports = {
    createUser,
    fetchUser,
    createUserPermission,
    createUserPermission,
    createUserRole,
    loginUser,
    createSeller
}