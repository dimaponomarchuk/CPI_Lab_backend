const { get } = require("../../database/index");
const datetime = require("../../lib/datetime");
const faker = require('faker');
const typesEnum = require('../../config/typesEnum').userTypes;

const UserFactory = async (params = {}) => {
  const firstName = params.first_name || params.firstName || faker.name.firstName();
  const lastName = params.last_name || params.lastName || faker.name.lastName();
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}+${faker.random.number()}@example.com`;

  const db = get();
  const data = {
    first_name: firstName,
    last_name: lastName,
    phone: faker.phone.phoneNumber(),
    email: email,
    password: "000000000000",
    createdDate: datetime.currentISO(),
    registration_datetime: datetime.currentISO(),
    registration_ip: faker.internet.ip(),
    updatedAt: datetime.currentISO(),
    isActive: true,
    isRegistered: true,
  };

  const user = await db.users.create(data);

  if (params.company_id) {
    await db.users_companies.create({
      user_id: user.user_id,
      company_id: params.company_id
    });
  }

  if (params.type) {
    await db.users_types.create({
      user_id: user.user_id,
      type_id: typesEnum[params.type]
    });
  }

  if (params.team_ids) {
    for(let i = 0; i < params.team_ids.length; i++) {
      await db.teams_users.create({
        user_id: user.user_id,
        team_id: params.team_ids[i]
      });
    }
  }

  return user;
};

module.exports = UserFactory;
