'use strict';
const expect = require("chai").expect;
const datetime = require("../lib/datetime");
const moment = require("moment");
const TaskStatusFactory = require("./factories/TaskStatusFactory");
const TaskFactory = require("./factories/TaskFactory");
const chaiWrapper = require('./helpers/chaiWrapper');

const {
  get
} = require("../database/index");

describe("TaskDAL", async () => {
  let db;
  let task;

  before(() => {
    db = get();
  });

  beforeEach(async () => {
    datetime.freeze("2018-02-01 09:30");
    task = await TaskFactory();
  });

  afterEach(() => {
    datetime.unfreeze();
  });

  it("should set create_date on creation", async () => {
    expect(moment.utc(task.created_date).toISOString()).to.eq("2018-02-01T09:30:00.000Z");
  });

  it("should assign Opened to newly created tasks", async () => {
    const openedStatus = await TaskStatusFactory("Opened");
    expect(task.status_id).to.eq(openedStatus.status_id);
  });

  it("should change status to Billed", async () => {
    const data = {
      status: { value: "Billed" },
      task_id: task.task_id
    };

    chaiWrapper
      .put('/tasks')
      .send(data)
      .end((err, res) => {
        expect(res.status).to.eq(200);
        expect(err).equal(null);
      });
  });

  it("Update billed_date whenever user moves task to Billed status", async () => {
    await TaskStatusFactory("Billed");
    expect(task.billed_date).to.eq(undefined);

    const data = {
      status: { value: "Billed" },
      task_id: task.task_id
    };

    chaiWrapper
      .put('/tasks')
      .send(data)
      .end((err, res) => {
        expect(res.status).to.eq(200);
        expect(err).equal(null);
        expect(res.body.billed_date).to.not.equal(null);
      });
  });

  it("Update completed_date whenever user moves task to Completed status", async () => {
    await TaskStatusFactory("Completed");
    expect(task.completed_date).to.eq(undefined);
    const data = {
      status: { value: "Completed" },
      task_id: task.task_id
    };

    chaiWrapper
      .put('/tasks')
      .send(data)
      .end((err, res) => {
        expect(res.status).to.eq(200);
        expect(err).equal(null);
        expect(res.body.completed_date).to.not.equal(null);
      });
  });

  it("Update closed_date whenever user moves task to Closed status", async () => {
    await TaskStatusFactory("Closed");
    expect(task.closed_date).to.eq(undefined);
    const data = {
      status: { value: "Closed" },
      task_id: task.task_id
    };

    chaiWrapper
      .put('/tasks')
      .send(data)
      .end((err, res) => {
        expect(res.status).to.eq(200);
        expect(err).equal(null);
        expect(res.body.closed_date).to.not.equal(null);
      });
  });

});
