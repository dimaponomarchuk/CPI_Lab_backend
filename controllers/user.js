const user = require('../db/models').user;
const asyncHandler = require('../services/asyncHanlder');

const getAll = asyncHandler(async(req, res) => {
    res.status(200).json(await user.findAll({}));
});

const getById = asyncHandler(async(req, res) => {
    res.status(200).json(await user.findOne({ where: { user_id: req.params.user_id } }));
});

const create = asyncHandler(async (req, res) => {
    res.status(200).json(await user.create(req.body));
});

const update = asyncHandler(async(req, res) => {
    res.status(200).json(await user.update(req.body, {
        where: { user_id: req.params.user_id }
    }));
});

const remove = asyncHandler(async(req, res) => {
    await user.destroy({
        where: { user_id: req.params.user_id }
    });
    res.status(200).json();
});

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};

