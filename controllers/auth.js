const user = require('../db/models').user;
const asyncHandler = require('../services/asyncHanlder');
const { success } = require('../services/responseWrapper');

const login = asyncHandler(async(req, res) => {
    const result = await user.findOne({
        where: {
            email: req.body.email,
            password: req.body.password
        }
    });
    // console.log(succes(result));
    res.status(200).json(success(result));
});

module.exports = {
    login
};

