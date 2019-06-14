const user = require('../db/models').user;
const asyncHandler = require('../services/asyncHanlder');
const sha512 = require('crypto-js/hmac-sha512');

const login = asyncHandler(async(req, res) => {
    res.status(200).json();
});

const logout = asyncHandler(async(req, res) => {
    req.logOut();
    res.status(200).json();
});

const register = asyncHandler(async(req, res) => {
    let { login, email, password } = req.body;
    password = sha512(req.body.password, process.env.SALT).toString();
    await user.create({login, email, password});
    res.status(200).json();
});

module.exports = {
    login,
    register,
    logout
};

