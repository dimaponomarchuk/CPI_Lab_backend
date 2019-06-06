const faker = require('faker');
const { db } = require('../../database/index');

const UserFactory = require('./UserFactory');
const TaskFactory = require("./TaskFactory");
const TaskUpdateFactory = require("./TaskUpdateFactory");

const params = async (model, params = {}) => {
  if(model.getTableName() === 'task_updates') {
    return TaskUpdateFactory.buildParams(params)
  }

  throw new Error("not implemented")
}
const create = async (model, params = {}) => {
  const singularTableName = model.getTableName().slice(0, -1);
  if (model.getTableName() === 'teams') {
    if (!params.team_name) params.team_name = faker.lorem.word();
  } else if (model.getTableName() === 'companies') {
    params.name = faker.company.companyName();
    params.phone = faker.phone.phoneNumber();
  } else if (model.getTableName() === 'organizations') {
    params.name = faker.company.companyName();
  } else if (model.getTableName() === 'locations') {
    if (!params.street_first)
      params.street_first = faker.address.streetAddress();
    if (!params.city) params.city = faker.address.city();
    if (!params.code) params.code = faker.address.zipCode();
    if (!params.latitude) params.latitude = faker.address.latitude();
    if (!params.longitude) params.longitude = faker.address.longitude();
  } else if (model.getTableName() === 'tasks') {
    return await TaskFactory(params);
  } else if (model.getTableName() === 'users') {
    return await UserFactory(params);
  }

  const instance = await model.create(params);

  if (params.team_ids) {
    const joinTable = `teams_${model.getTableName()}`;
    for (let i = 0; i < params.team_ids.length; i++) {
      const joinParams = { team_id: params.team_ids[i] };
      joinParams[`${singularTableName}_id`] =
        instance[`${singularTableName}_id`];
      await db()[joinTable].create(joinParams);
    }
  }

  return instance;
};

const createList = async (model, elementsNumber, params = {}) => {
  for (let i = 0; i < elementsNumber; i++) {
    await create(model, params);
  }
};

module.exports = { create, createList, params };
