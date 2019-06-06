const { db } = require("../../database/index");
const faker = require('faker');

const CompanyFactory = async (params = {}) => {
  const data = {
    name: faker.company.companyName(),
    phone: faker.phone.phoneNumber(),
  };

  return await db().companies.create(data);
};

module.exports = CompanyFactory;
