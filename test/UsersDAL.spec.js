'use strict';
const expect = require("chai").expect;
const chaiWrapper = require('./helpers/chaiWrapper');
const HoursWorkedFactory = require('./factories/HoursWorkedFactory');
const UserFactory = require('./factories/UserFactory');
const {create, params} = require("./factories/Factory");
const {
  get
} = require("../database/index");

describe('UsersDAL', async () => {
  let user, db, company, company_id, hoursWorked;

  before(async () => {
    db = get();
    company = await create(db.companies);
    company_id = company.company_id;
    user = await UserFactory({
      first_name: 'TestName',
      last_name: 'TestLastName',
      company_id
    });

    hoursWorked = await HoursWorkedFactory({
      user_id: user.user_id,
      start_date: "02/03/2019 5:00 PM",
      end_date: "02/13/2019 6:30 PM"
    });

    await HoursWorkedFactory({
      user_id: user.user_id,
      start_date: "10/11/2019 5:00 PM",
      end_date: "10/22/2019 6:30 PM"
    });
  });

  it('Get hours worked reports with User filter', async () => {
    chaiWrapper
      .get(`/users_hours_worked/company/${company_id}`)
      .query({
        query: '"TestName"',
        limit: 100,
        ascending: 1,
        page: 1,
        byColumn: 0
      })
      .end((err, res) => {
        expect(res.status).to.eq(200);
        expect(err).equal(null);
        expect(res.body.count).to.eq(2);
      });
    chaiWrapper
      .get(`/users_hours_worked/company/${company_id}`)
      .query({
        query: '"TestLastName"',
        limit: 100,
        ascending: 1,
        page: 1,
        byColumn: 0
      })
      .end((err, res) => {
        expect(res.status).to.eq(200);
        expect(err).equal(null);
        expect(res.body.count).to.eq(2);
      });
  });

  it('Get hours worked reports with User incorrect filter', async () => {
    chaiWrapper
      .get(`/users_hours_worked/company/${company_id}`)
      .query({
        query: '"AAAAAAAA"',
        limit: 100,
        ascending: 1,
        page: 1,
        byColumn: 0
      })
      .end((err, res) => {
        expect(res.status).to.eq(200);
        expect(err).equal(null);
        expect(res.body.count).to.eq(0);
      });
  });

  it('Get hours worked reports with dates filter', async () => {
    chaiWrapper
      .get(`/users_hours_worked/company/${company_id}`)
      .query({
        query: '"22"',
        limit: 100,
        ascending: 1,
        page: 1,
        byColumn: 0
      })
      .end((err, res) => {
        expect(res.status).to.eq(200);
        expect(err).equal(null);
        expect(res.body.data.length);
      });
  });
});
