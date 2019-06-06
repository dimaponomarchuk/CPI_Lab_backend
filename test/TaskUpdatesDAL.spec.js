'use strict';
const expect = require("chai").expect;
const moment = require("moment");
const TaskFactory = require("./factories/TaskFactory");
const UserFactory = require("./factories/UserFactory");
const {params} = require("./factories/Factory");
const chaiWrapper = require('./helpers/chaiWrapper');

const {
  get
} = require("../database/index");

describe("TaskUpdatesDAL", async () => {
  let db;
  let task;
  let user;

  before(async () => {
    db = get();
    task = await TaskFactory();
    user = await UserFactory();
  });

  it("createTaskUpdate", async () => {
    const data = {
      update: await params(db.task_updates, {
        task_id: task.task_id,
        updatedBy: user.user_id,
        start_date: "02/03/2019 5:00 PM",
        end_date: "02/13/2019 6:30 PM",
      })
    };

    chaiWrapper
      .post('/updates')
      .send(data)
      .end((err, res) => {
        expect(res.status).to.eq(200);
        expect(err).equal(null);
        expect(moment(res.body.start_date).format('L LT')).to.eq("02/03/2019 5:00 PM");
        expect(moment(res.body.end_date).format('L LT')).to.eq("02/13/2019 6:30 PM");
      });
  });

  it("updateTaskUpdate", async () => {
    const data = {
      update: await params(db.task_updates, {
        task_id: task.task_id,
        updatedBy: user.user_id,
      })
    };

    chaiWrapper
      .post('/updates')
      .send(data)
      .end((err, res) => {
        expect(res.status).to.eq(200);
        expect(err).equal(null);
        const taskUpdate = res.body;
        expect(res.body.start_date).to.eq(undefined);
        expect(res.body.end_date).to.eq(undefined);
        chaiWrapper
          .put(`/updates/${taskUpdate.update_id}`)
          .send({update: {
            update_id: taskUpdate.update_id,
            start_date: "02/03/2019 5:00 PM",
            end_date: "02/03/2019 6:30 PM",
          }})
          .end((err, res) => {
            expect(res.status).to.eq(200);
            expect(err).equal(null);
            expect(moment(res.body.start_date).format('L LT')).to.eq("02/03/2019 5:00 PM");
            expect(moment(res.body.end_date).format('L LT')).to.eq("02/03/2019 6:30 PM");
          });
      });
  });

  it('Update dates match the specified ', () => {
    const data = {
      user_id: user.user_id,
      start_date: "02/03/2019 5:00 PM",
      end_date: "02/03/2019 5:00 PM"
    };
    chaiWrapper
      .get('/updates/filter')
      .query(data)
      .end((err, res) => {
        expect(res.status).to.eq(200);
        expect(err).equal(null);
        expect(res.body.length).to.eq(1);
      });
  });

  it('Updates dates did not match with specified but still in range', () => {
    const data = {
      user_id: user.user_id,
      start_date: "02/05/2019 5:00 PM",
      end_date: "02/06/2019 5:00 PM"
    };
    chaiWrapper
      .get('/updates/filter')
      .query(data)
      .end((err, res) => {
        expect(res.status).to.eq(200);
        expect(err).equal(null);
        expect(res.body.length).to.eq(1);
      });
  });

  it('Updates start_date did not match with specified', () => {
    const data = {
      user_id: user.user_id,
      start_date: "02/01/2019 5:00 PM",
      end_date: "02/06/2019 5:00 PM"
    };
    chaiWrapper
      .get('/updates/filter')
      .query(data)
      .end((err, res) => {
        expect(res.status).to.eq(200);
        expect(err).equal(null);
        expect(res.body.length).to.eq(1);
      });
  });

  it('Updates end_date did not match with specified', () => {
    const data = {
      user_id: user.user_id,
      start_date: "02/10/2019 5:00 PM",
      end_date: "02/16/2019 5:00 PM"
    };
    chaiWrapper
      .get('/updates/filter')
      .query(data)
      .end((err, res) => {
        expect(res.status).to.eq(200);
        expect(err).equal(null);
        expect(res.body.length).to.eq(1);
      });
  });

  it('Updates dates out of specified dates range', () => {
    const data = {
      user_id: user.user_id,
      start_date: "02/15/2019 5:00 PM",
      end_date: "02/19/2019 5:00 PM"
    };
    chaiWrapper
      .get('/updates/filter')
      .query(data)
      .end((err, res) => {
        expect(res.status).to.eq(200);
        expect(err).equal(null);
        expect(res.body.length).to.eq(0);
      });
  });

});
