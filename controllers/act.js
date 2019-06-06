const act = require('../db/models').act;
const asyncHandler = require('../services/asyncHanlder');

const getAll = asyncHandler(async(req, res) => {
    res.status(200).json(await act.findAll());
});

const getById = asyncHandler(async(req, res) => {
    res.status(200).json(await act.findOne({
        where: { act_id: req.params.act_id },
        include: [
            { all: true }
        ]
    }));
});

const create = asyncHandler(async (req, res) => {
    res.status(200).json(await act.create(req.body));
});

const update = asyncHandler(async(req, res) => {
    res.status(200).json(await act.update(req.body, {
        where: { act_id: req.params.act_id }
    }));
});

const remove = asyncHandler(async(req, res) => {
    await act.destroy({
        where: { act_id: req.params.act_id }
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

