const { get } = require("../../database/index");
const faker = require('faker');

const TeamFactory = async (params = {}) => {
  const db = get();
  const data = {
    team_name: faker.lorem.word(),
    company_id: params.company_id
  };

  return await db.teams.create(data);
};

module.exports = TeamFactory;
