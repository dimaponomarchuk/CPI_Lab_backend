'use strict';
const TaskCounter = require('../services/TaskCounter');

const expect = require("chai").expect;
const CompanyFactory = require("./factories/CompanyFactory");
const TeamFactory = require("./factories/TeamFactory");
const TaskFactory = require("./factories/TaskFactory");
const UserFactory = require("./factories/UserFactory");

const { current, freeze, unfreeze } = require('../lib/datetime');

const {
  get
} = require("../database/index");

describe("TaskCounter", async () => {
  let db;
  let company;
  let company_id;

  before(() => {
    db = get();
    freeze("2018-02-07 09:30");
  });

  after(() => {
    unfreeze();
  });

  beforeEach(async () => {
    company = await CompanyFactory();
    company_id = company.company_id;
    await db.task_updates.destroy({ truncate: { cascade: true } });
    await db.tasks_users.destroy({ truncate: { cascade: true } });
    await db.tasks_teams.destroy({ truncate: { cascade: true } });
    await db.tasks.destroy({ truncate: { cascade: true } });
  });

  it(".opened, .completed, .unussigned, .all", async () => {
    const a = await UserFactory({ company_id });
    const b = await TeamFactory({ company_id });

    await TaskFactory({ company_id, status: "Opened", user_ids: [a.user_id] });
    await TaskFactory({ company_id, status: "Opened" });
    await TaskFactory({ company_id, status: "Opened" });
    await TaskFactory({ company_id, status: "Completed" });
    await TaskFactory({ company_id, status: "Completed" });
    await TaskFactory({ company_id, status: "Closed", team_ids: [b.team_id] });

    const fields = [{ status: ["Opened"] }, { status: ["Completed"] }, { users: [-1] }, {}];

    const taskCounter = new TaskCounter({ fields, company_id });
    const count = await taskCounter.counts();
    expect(count[0]).to.eq(3);
    expect(count[1]).to.eq(2);
    expect(count[2]).to.eq(5);
    expect(count[3]).to.eq(6);
  });

  it(".pastDue, .dueToday, .dueTomorrow", async () => {
    await TaskFactory({ company_id, due_date: current().add(-1, 'd') });
    await TaskFactory({ company_id, due_date: current().add(-1, 'h') });
    await TaskFactory({ company_id, due_date: current().add(1, 'h') });
    await TaskFactory({ company_id, due_date: current().add(1, 'd') });

    const fields = [{ due: "pastDue" }, { due: "dueToday" }, { due: "dueTomorrow" }];

    const taskCounter = new TaskCounter({ fields, company_id });
    const count = await taskCounter.counts();
    expect(count[0]).to.eq(2);
    expect(count[1]).to.eq(3);
    expect(count[2]).to.eq(1);
  });

  it(".pastDue, .dueToday, .dueTomorrow for current user", async () => {
    const a = await UserFactory({ company_id });

    await TaskFactory({ company_id, due_date: current().add(-1, 'd'), user_ids: [a.user_id] });
    await TaskFactory({ company_id, due_date: current().add(-1, 'h'), user_ids: [a.user_id] });
    await TaskFactory({ company_id, due_date: current().add(1, 'h'), user_ids: [a.user_id] });
    await TaskFactory({ company_id, due_date: current().add(1, 'd'), user_ids: [a.user_id] });

    await TaskFactory({ company_id, due_date: current().add(-1, 'd') });
    await TaskFactory({ company_id, due_date: current().add(-1, 'h') });
    await TaskFactory({ company_id, due_date: current().add(1, 'h') });
    await TaskFactory({ company_id, due_date: current().add(1, 'd') });

    const fields = [
      { users: [a.user_id], due: "pastDue" },
      { users: [a.user_id], due: "dueToday" },
      { users: [a.user_id], due: "dueTomorrow" }
    ];

    const taskCounter = new TaskCounter({ fields, company_id });
    const count = await taskCounter.counts();
    expect(count[0]).to.eq(2);
    expect(count[1]).to.eq(3);
    expect(count[2]).to.eq(1);
  });

});
