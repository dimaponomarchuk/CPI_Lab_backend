const user = require('../db/models').user;
const asyncHandler = require('../services/asyncHanlder');

const login = asyncHandler(async(req, res) => {
    let result = await user.findOne({
        where: {
            email: req.body.email,
            password: req.body.password
        }
    });
    result.dataValues.token = 'asiasid3r2e';
    res.status(200).json(result);
});

module.exports = {
    login
};

