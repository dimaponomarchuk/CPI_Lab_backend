const { get } = require("../../database/index");
const faker = require('faker');

const buildParams = (params = {}) => {
  return {
    description: faker.lorem.sentence(),
    hours_worked: 1.5,
    cost: "2.00",
    is_billable: false,
    task_id: params.task_id,
    updatedBy: params.updatedBy,
    start_date: params.start_date,
    end_date: params.end_date,
    date: params.date
  };
};

module.exports = {
  buildParams
};
