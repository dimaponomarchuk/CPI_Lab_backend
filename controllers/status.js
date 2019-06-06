const status = require('../db/models').status;
const asyncHandler = require('../services/asyncHanlder');

const getAll = asyncHandler(async(req, res) => {
    res.status(200).json(await status.findAll({}));
});

const getById = asyncHandler(async(req, res) => {
    res.status(200).json(await status.findOne({ where: { act_id: req.params.act_id } }));
});

const create = asyncHandler(async (req, res) => {
    res.status(200).json(await status.create(req.body));
});

const update = asyncHandler(async(req, res) => {
    res.status(200).json(await status.update(req.body, {
        where: { user_id: req.params.user_id }
    }));
});

const remove = asyncHandler(async(req, res) => {
    await status.destroy({
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
