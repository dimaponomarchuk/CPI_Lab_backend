'use strict';
const expect = require("chai").expect;
const {create, params} = require("./factories/Factory");
const CompaniesDAL = require("../api/companies/companiesDAL");
const moment = require("moment");
const _ = require("lodash");
const { freeze, unfreeze } = require("../lib/datetime");

const {
  get
} = require("../database/index");

describe("CompaniesDAL", async () => {
  let db;
  let company;
  let company_id;
  let user;

  before(() => {
    db = get();
  });

  beforeEach(async () => {
    company = await create(db.companies);
    company_id = company.company_id;
    user = await create(db.users);
  });

  it("lastUpdated", async () => {
    await create(db.tasks, {
      company_id,
      updates: [
        await params(db.task_updates, {
          updatedBy: user._id,
          date: moment.utc("2018-04-01 09:30").toISOString(),
        }),
      ]
    });

    const tasks = await CompaniesDAL(db).getTasks(company_id);
    expect(tasks.data[0].lastUpdated).to.eql(new Date("2018-04-01 09:30 GMT"));
  });

  describe("filtering", () => {
    const filter = {};
    it("limit", async () => {
      await create(db.tasks, { company_id });
      await create(db.tasks, { company_id });
      await create(db.tasks, { company_id });
      await create(db.tasks, { company_id });
      await create(db.tasks, { company_id });
      await create(db.tasks, { company_id });

      const tasks = await CompaniesDAL(db).getTasks(company_id, { limit: 3 });
      expect(tasks.count).to.eq(6);
      expect(tasks.data.length).to.eq(3);
    });

    it("limit + offset", async () => {
      await create(db.tasks, { company_id });
      await create(db.tasks, { company_id });
      await create(db.tasks, { company_id });
      const a = await create(db.tasks, { company_id });
      await create(db.tasks, { company_id });
      await create(db.tasks, { company_id });

      const tasks = await CompaniesDAL(db).getTasks(company_id, { limit: '3', page: '2' });
      expect(tasks.count).to.eq(6);
      expect(tasks.data.length).to.eq(3);
      expect(tasks.data[0]._id).to.eq(a._id);
    });

    describe("dueDate", () => {
      beforeEach(async () => {
        freeze("2018-02-07 09:30");
      });

      afterEach(() => {
        unfreeze();
      });

      it("dueThisWeek", () => {
        it("same week", async () => {
          await create(db.tasks, {
            company_id,
            due_date: moment.utc("2018-02-08 09:30").toISOString(),
          });

          const tasks = await CompaniesDAL(db).getTasks(company_id, {company_id, dueDate: "dueThisWeek"});
          expect(tasks.count).to.eq(1);
        });

        it("not same week", async () => {
          await create(db.tasks, {
            company_id,
            due_date: moment.utc("2018-02-18 09:30").toISOString(),
          });

          const tasks = await CompaniesDAL(db).getTasks(company_id, {company_id, dueDate: "dueThisWeek"});
          expect(tasks.count).to.eq(0);
        });
      });
    });

    describe("status", () => {
      it("Closed should be filtered", async () => {
        await create(db.tasks, {
          company_id,
        });

        const tasks = await CompaniesDAL(db).getTasks(company_id, { status: ['Closed'] });
        expect(tasks.count).to.eq(0);
      });

      it("Closed should be present", async () => {
        await create(db.tasks, {
          company_id,
          status: 'Closed'
        });

        const tasks = await CompaniesDAL(db).getTasks(company_id, { status: ['Closed'] });
        expect(tasks.count).to.eq(1);
        const allTasks = (await CompaniesDAL(db).getTasks(company_id, { status: [] }));
        expect(allTasks.count).to.eq(1);
      });

      it("Closed & Opened should be present", async () => {
        await create(db.tasks, {
          company_id,
          status: 'Closed'
        });

        await create(db.tasks, {
          company_id,
          status: 'Opened'
        });

        await create(db.tasks, {
          company_id,
          status: 'Billed'
        });

        const tasks = await CompaniesDAL(db).getTasks(company_id, { status: ['Closed', 'Opened'] });
        expect(tasks.count).to.eq(2);

        const allTasks = await CompaniesDAL(db).getTasks(company_id, { status: [] });
        expect(allTasks.count).to.eq(3);
      });
    });

    describe("type", () => {
      it("Other should be present", async () => {
        const otherTask = await create(db.tasks, {
          company_id,
          type: "Other"
        });

        const indoor = await CompaniesDAL(db).getTasks(company_id, { type: ['Indoor'] });
        expect(indoor.count).to.eq(0);

        const other = await CompaniesDAL(db).getTasks(company_id, { type: ['Other'] });
        expect(other.count).to.eq(1);
        expect(other.data[0]._id).to.eq(otherTask._id);
        const allTasks = await CompaniesDAL(db).getTasks(company_id, { type: [] });
        expect(allTasks.count).to.eq(1);
      });
    });

    describe("priority", () => {
      it("High should be present", async () => {
        const highPriorityTask = await create(db.tasks, {
          company_id,
          priority: "High"
        });

        const indoor = await CompaniesDAL(db).getTasks(company_id, { priority: ['Low'] });
        expect(indoor.count).to.eq(0);

        const other = await CompaniesDAL(db).getTasks(company_id, { priority: ['High'] });
        expect(other.count).to.eq(1);
        expect(other.data[0]._id).to.eq(highPriorityTask._id);
        const allTasks = await CompaniesDAL(db).getTasks(company_id, { priority: [] });
        expect(allTasks.count).to.eq(1);
      });
    });

    describe("query", () => {
      beforeEach(async () => {
        await create(db.tasks, { company_id });
        await create(db.tasks, { company_id });
      })

      it("team_name", async () => {
        const a = await create(db.teams, { company_id, team_name: "Best Maintainers"});
        const task = await create(db.tasks, { company_id, team_ids: [a._id]});

        const tasks = await CompaniesDAL(db).getTasks(company_id, { query: "maint" });
        expect(tasks.data.map(i => i._id)).to.eql([task._id]);
      });

      it("first_name", async () => {
        const a = await create(db.users, { company_id, first_name: "George" });
        const task = await create(db.tasks, { company_id, user_ids: [a._id] });

        const tasks = await CompaniesDAL(db).getTasks(company_id, { query: "eorg" });
        expect(tasks.data.map(i => i._id)).to.eql([task._id]);
      });

      it("last_name", async () => {
        const a = await create(db.users, { company_id, last_name: "Doedoedoe" });
        const task = await create(db.tasks, { company_id, user_ids: a._id });

        const tasks = await CompaniesDAL(db).getTasks(company_id, { query: "edoe" });
        expect(tasks.data.map(i => i._id)).to.eql([task._id]);
      });

      it("street_first", async () => {
        const location = await create(db.locations, {street_first: "Washington Ave"})
        const task = await create(db.tasks, { company_id, location_id: location._id });
        const tasks = await CompaniesDAL(db).getTasks(company_id, { query: "Washi" });
        expect(tasks.data.map(i => i._id)).to.eql([task._id]);
      });

      it("street_second", async () => {
        const location = await create(db.locations, {street_second: "Washington DC"})
        const task = await create(db.tasks, { company_id, location_id: location._id });
        const tasks = await CompaniesDAL(db).getTasks(company_id, { query: 'Washi' });
        expect(tasks.data.map(i => i._id)).to.eql([task._id]);
      });

      it("task_id", async () => {
        const task = await create(db.tasks, { company_id });
        const tasks = await CompaniesDAL(db).getTasks(company_id, { query: task._id.toString() });
        expect(tasks.data.map(i => i._id)).to.eql([task._id]);
      });

      it("title", async () => {
        const task = await create(db.tasks, {
          company_id,
          title: "Heavy snow"
        });

        const tasks = await CompaniesDAL(db).getTasks(company_id, { query: 'now' });
        expect(tasks.data.map(i => i._id)).to.eql([task._id]);
      });
    });

    describe("Users", () => {
      it("should filter by user_ids", async () => {
        const a = await create(db.users, { company_id });
        await create(db.users, {});
        const b = await create(db.users, { company_id });

        const taskWithUser = await create(db.tasks, {
          company_id,
          user_ids: [a._id]
        });

        await create(db.tasks, {
          company_id,
          user_ids: [b._id]
        });

        const tasks = await CompaniesDAL(db).getTasks(company_id, { users: [a._id] });
        expect(tasks.count).to.eq(1);
        expect(tasks.data[0]._id).to.eq(taskWithUser._id);
      });

      it("should return all if user_ids = []", async () => {
        const a = await create(db.users, { company_id });
        await create(db.users, {});
        const b = await create(db.users, { company_id });

        const taskWithUser = await create(db.tasks, {
          company_id,
          user_ids: [a._id]
        });

        await create(db.tasks, {
          company_id,
          user_ids: [b._id]
        });

        const tasks = await CompaniesDAL(db).getTasks(company_id, { users: [] });
        expect(tasks.count).to.eq(2);
      });

      it("should return Without Users", async () => {
        const a = await create(db.users, { company_id });
        await create(db.users, {});
        const b = await create(db.users, { company_id });

        const taskWithUser = await create(db.tasks, {
          company_id,
          user_ids: [a._id]
        });

        const taskWithoutUser = await create(db.tasks, {
          company_id,
        });

        const tasks = await CompaniesDAL(db).getTasks(company_id, { users: [-1] });
        expect(tasks.count).to.eq(1);
        expect(tasks.data[0]._id).to.eq(taskWithoutUser._id);
      });

      it("3 users", async () => {
        const a = await create(db.users, { company_id });
        await create(db.users, {});
        const b = await create(db.users, { company_id });

        const taskWithUser = await create(db.tasks, {
          company_id,
          user_ids: [a._id]
        });

        const taskWithoutUser = await create(db.tasks, {
          company_id,
        });

        const taskWithB = await create(db.tasks, {
          company_id,
          user_ids: [b._id]
        });

        const tasks = await CompaniesDAL(db).getTasks(company_id, { users: [-1, b._id] });
        expect(tasks.count).to.eq(2);
        expect(tasks.data[0]._id).to.eq(taskWithoutUser._id);
        expect(tasks.data[1]._id).to.eq(taskWithB._id);
      });
    });

    describe("Teams", async () => {
      it("should filter by team_ids", async () => {
        const a = await create(db.teams, { company_id });
        const b = await create(db.teams, { company_id });

        const taskWithTeam = await create(db.tasks, {
          company_id,
          team_ids: [a._id]
        });

        const taskWithoutTeam = await create(db.tasks, {
          company_id,
          team_ids: [b._id]
        });

        const tasks = await CompaniesDAL(db).getTasks(company_id, { teams: [a._id] });
        expect(tasks.count).to.eq(1);
        expect(tasks.data[0]._id).to.eq(taskWithTeam._id);
      });

      it("should return all if team_ids = []", async () => {
        const a = await create(db.teams, { company_id });
        const b = await create(db.teams, { company_id });

        const taskWithTeam = await create(db.tasks, {
          company_id,
          team_ids: [a._id]
        });

        const taskWithoutTeam = await create(db.tasks, {
          company_id,
          team_ids: [b._id]
        });

        const tasks = await CompaniesDAL(db).getTasks(company_id, { teams: [] });
        expect(tasks.count).to.eq(2);
      });

      it("should return Without Team", async () => {
        const a = await create(db.teams, { company_id });
        const b = await create(db.teams, { company_id });

        const taskWithTeam = await create(db.tasks, {
          company_id,
          team_ids: [a._id]
        });

        const taskWithoutTeam = await create(db.tasks, {
          company_id,
        });

        const tasks = await CompaniesDAL(db).getTasks(company_id, { teams: [-1] });
        expect(tasks.count).to.eq(1);
        expect(tasks.data[0]._id).to.eq(taskWithoutTeam._id);
      });

      it("3 teams", async () => {
        const a = await create(db.teams, { company_id });
        const b = await create(db.teams, { company_id });
        const c = await create(db.teams, { company_id });

        const taskWithTeam = await create(db.tasks, {
          company_id,
          team_ids: [a._id]
        });

        const taskWithoutTeam = await create(db.tasks, {
          company_id,
        });

        const taskWithB = await create(db.tasks, {
          company_id,
          team_ids: [b._id]
        });

        const tasks = await CompaniesDAL(db).getTasks(company_id, { teams: [-1, b._id] });
        expect(tasks.count).to.eq(2);
        expect(tasks.data[0]._id).to.eq(taskWithoutTeam._id);
        expect(tasks.data[1]._id).to.eq(taskWithB._id);
      });
    });

    describe("getTasksFilter", () => {
      it("Users", async () => {
        const manager = await create(db.users, { company_id, type: 'management' });
        await create(db.users, {});
        const homeowner = await create(db.users, { company_id, type: 'homeowner' });
        const maintenance = await create(db.users, { company_id, type: 'maintenance' });

        const filter = await CompaniesDAL(db).getTaskFilters(company_id);
        expect((filter.users.map(user => user._id)).length).to.eq([-1, manager._id, maintenance._id].length);
        expect(JSON.stringify(_.pick(filter.users, 'user_id', 'fullName'))).to.eq(
          JSON.stringify(_.pick([{ user_id: -1, fullName: 'Without User' }, homeowner, manager, maintenance], 'user_id', 'fullName')));

      });

      it("Teams", async () => {
        const team = await create(db.teams, { company_id });

        const filter = await CompaniesDAL(db).getTaskFilters(company_id);
        expect(filter.teams.length).to.eq(2);
        expect(JSON.stringify(_.pick(filter.users, 'team_id', 'team_name'))).to.eq(
          JSON.stringify(_.pick([{ team_id: -1, team_name: 'Without Team' }, team], 'team_id', 'team_name')));
      });
    });

    describe("maintainance", () => {
      it("userId", async () => {
        const aUser = await create(db.users, { company_id });
        const bUser = await create(db.users, { company_id });
        const aTask = await create(db.tasks, {
          company_id,
          user_ids: [aUser._id]
        });

        const bTask = await create(db.tasks, {
          company_id,
          user_ids: [bUser._id]
        });

        const res = await CompaniesDAL(db).getTasks(company_id, { portal: 'maintenance' }, aUser._id);
        expect(res.count).to.eq(1);
        expect(res.data[0]._id).to.eq(aTask._id);
      });

      it("user has team, but task doesn't and is assigned to user", async () => {
        const aTeam = await create(db.teams, { company_id });
        const aUser = await create(db.users, { company_id, team_ids: [aTeam._id] });
        const bUser = await create(db.users, { company_id });
        const aTask = await create(db.tasks, {
          company_id,
          user_ids: [aUser._id]
        });

        const bTask = await create(db.tasks, {
          company_id,
          user_ids: [bUser._id]
        });

        const res = await CompaniesDAL(db).getTasks(company_id, { portal: 'maintenance' }, aUser._id);
        expect(res.count).to.eq(1);
        expect(res.data[0]._id).to.eq(aTask._id);
      });

      it("teamId", async () => {
        const aTeam = await create(db.teams, { company_id });
        const aUser = await create(db.users, { company_id, team_ids: [aTeam._id] });
        const bUser = await create(db.users, { company_id, team_ids: [aTeam._id] });

        const aTask = await create(db.tasks, {
          company_id,
          team_ids: [aTeam._id]
        });

        const bTask = await create(db.tasks, {
          company_id,
          team_ids: [aTeam._id]
        });

        const res = await CompaniesDAL(db).getTasks(company_id, { portal: 'maintenance' }, aUser._id);
        expect(res.count).to.eq(2);
      });
    });

    describe("userIds and teamIds at the same time", () => {
      let aUser, bUser, aTeam, bTeam, cTeam,
        taskWithAUserAndATeam,
        taskWithoutUserAndTeam,
        taskWithoutUserButWithTeam, taskWithUserA
      ;

      beforeEach(async () => {
        aUser = await create(db.users, { company_id });
        await create(db.users, {});
        bUser = await create(db.users, { company_id });
        aTeam = await create(db.teams, { company_id });
        bTeam = await create(db.teams, { company_id });
        cTeam = await create(db.teams, { company_id });
        taskWithAUserAndATeam = await create(db.tasks, {
          company_id,
          user_ids: [aUser._id],
          team_ids: [aTeam._id]
        });

        taskWithoutUserAndTeam = await create(db.tasks, {
          company_id,
        });

        taskWithoutUserButWithTeam = await create(db.tasks, {
          company_id,
          team_ids: [aTeam._id]
        });

        taskWithUserA = await create(db.tasks, {
          company_id,
          user_ids: [aUser._id]
        });
      });

      it("multiple cases", async () => {
        const cases = [{
          users: [aUser._id],
          teams: [aTeam._id],
          task_ids: [taskWithAUserAndATeam._id]
        }, {
          users: [aUser._id],
          teams: [-1],
          task_ids: [taskWithUserA._id]
        }, {
          users: [aUser._id],
          teams: [aTeam._id, -1],
          task_ids: [taskWithUserA._id, taskWithAUserAndATeam._id]
        }, {
          users: [-1],
          teams: [aTeam._id],
          task_ids: [taskWithoutUserButWithTeam._id]
        }, {
          users: [-1],
          teams: [-1],
          task_ids: [taskWithoutUserAndTeam._id]
        }, {
          users: [-1],
          teams: [aTeam._id, -1],
          task_ids: [taskWithoutUserAndTeam._id, taskWithoutUserButWithTeam._id]
        }, {
          users: [aUser._id, -1],
          teams: [aTeam._id],
          task_ids: [taskWithAUserAndATeam._id, taskWithoutUserButWithTeam._id]
        }, {
          users: [aUser._id, -1],
          teams: [-1],
          task_ids: [taskWithoutUserAndTeam._id, taskWithUserA._id]
        }, {
          users: [aUser._id, -1],
          teams: [aTeam._id, -1],
          task_ids: [
            taskWithAUserAndATeam._id, taskWithoutUserAndTeam._id,
            taskWithoutUserButWithTeam._id, taskWithUserA._id]
        }];

        for (let i = 0; i < cases.length; i++) {
          const res = await CompaniesDAL(db).getTasks(company_id, {
            users: cases[i].users,
            teams: cases[i].teams
          });
          expect(res.count).to.eq(cases[i].task_ids.length);
          expect(res.data.map(i => i.task_id).sort()).to.eql(cases[i].task_ids.sort());
        }
      });
    });
  });

  describe("sorting", () => {
    let tasks;

    it("task_id", async () => {
      const a = await create(db.tasks, { company_id });
      const b = await create(db.tasks, { company_id });
      tasks = await CompaniesDAL(db).getTasks(company_id, { orderBy: "task_id", ascending: 1 });
      expect(tasks.data.map(i => i._id)).to.eql([a._id, b._id]);
      tasks = await CompaniesDAL(db).getTasks(company_id, { orderBy: "task_id", ascending: 0 });
      expect(tasks.data.map(i => i._id)).to.eql([b._id, a._id]);
    });

    it("title", async () => {
      const a = await create(db.tasks, { company_id, title: "a" });
      const b = await create(db.tasks, { company_id, title: "b" });
      tasks = await CompaniesDAL(db).getTasks(company_id, { orderBy: "title", ascending: 1 });
      expect(tasks.data.map(i => i._id)).to.eql([a._id, b._id]);
      tasks = await CompaniesDAL(db).getTasks(company_id, { orderBy: "title", ascending: 0 });
      expect(tasks.data.map(i => i._id)).to.eql([b._id, a._id]);
    });

    it('type.value', async () => {
      const a = await create(db.tasks, { company_id, type: "Indoor" });
      const b = await create(db.tasks, { company_id, type: "Outdoor" });
      tasks = await CompaniesDAL(db).getTasks(company_id, { orderBy: 'type.value', ascending: 1 });
      expect(tasks.data.map(i => i._id)).to.eql([a._id, b._id]);
      tasks = await CompaniesDAL(db).getTasks(company_id, { orderBy: 'type.value', ascending: 0 });
      expect(tasks.data.map(i => i._id)).to.eql([b._id, a._id]);
    });

    it('priority.value', async () => {
      await create(db.tasks, { company_id, priority: "Critical" });
      await create(db.tasks, { company_id, priority: "Low" });
      await create(db.tasks, { company_id, priority: "Low" });
      await create(db.tasks, { company_id, priority: "Low" });
      await create(db.tasks, { company_id, priority: "Medium" });
      await create(db.tasks, { company_id, priority: "High" });
      tasks = await CompaniesDAL(db).getTasks(company_id, { orderBy: 'priority.value', ascending: 0, limit: 2 });
      expect(tasks.data.map(i => i.priority.value)).to.eql(["Low", "Low"]);

      tasks = await CompaniesDAL(db).getTasks(company_id, { orderBy: 'priority.value', ascending: 1, limit: 2 });
      expect(tasks.data.map(i => i.priority.value)).to.eql(["Critical", "High"]);
    });

    it('due_date', async () => {
      const a = await create(db.tasks, { company_id, due_date: moment.utc("2018-02-07 19:00:00").toISOString() });
      const b = await create(db.tasks, { company_id, due_date: moment.utc("2018-02-08 19:00:00").toISOString() });
      tasks = await CompaniesDAL(db).getTasks(company_id, { orderBy: "due_date", ascending: 1 });
      expect(tasks.data.map(i => i._id)).to.eql([a._id, b._id]);
      tasks = await CompaniesDAL(db).getTasks(company_id, { orderBy: "due_date", ascending: 0 });
      expect(tasks.data.map(i => i._id)).to.eql([b._id, a._id]);
    });

    it("bug priority sorting", async () => {
      await create(db.tasks, { company_id, priority: "Critical" });
      await create(db.tasks, { company_id, priority: "Low" });
      await create(db.tasks, { company_id, priority: "Low" });
      await create(db.tasks, { company_id, priority: "Low" });
      await create(db.tasks, { company_id, priority: "Medium" });
      await create(db.tasks, { company_id, priority: "High" });

      const opts = {
        include: [{
          model: db.task_priorities,
          as: 'priority',
        }],
        where: {
          company_id: company_id
        },
        order: [[
          { model: db.task_priorities, as: 'priority' },
          'priority_id',
          'DESC'
        ]],
        limit: 2
      }
      tasks = await db.tasks.findAndCountAll(opts)

      expect(tasks.rows.map(i => i.priority.value)).to.eql(["Low", "Low"])

      tasks = await CompaniesDAL(db).getTasks(company_id, { orderBy: 'priority.value', ascending: 0, limit: 2 });
      expect(tasks.data.map(i => i.priority.value)).to.eql(["Low", "Low"]);
    })

    it("distinct should work", async () => {
      const aUser = await create(db.users, { company_id });
      const bUser = await create(db.users, { company_id });

      await create(db.tasks, { company_id, user_ids: [aUser._id, bUser._id] });

      const tasks = await CompaniesDAL(db).getTasks(company_id, { limit: 1 });
      expect(tasks.data.length).to.eq(1)
      expect(tasks.data[0].dataValues.users.length).to.eq(2)
    })

    it("null bug sorting", async () => {
      const secondary_addresses = [null, "", "", null, "# 372", "# 231", '231', null, 'Suite 32']
      let task
      for (let i of secondary_addresses) {
        const location = await create(db.locations, {street_second: i})
        task = await create(db.tasks, {company_id, location_id: location._id})
      }

      const tasks1 = await CompaniesDAL(db).getTasks(company_id, { orderBy: "location.street_second", limit: 10 });
      expect(tasks1.data.map(i => i.location.street_second)).to.eql([ 'Suite 32', '231', '# 372', '# 231', '', '', null, null, null ])

      const tasks2 = await CompaniesDAL(db).getTasks(company_id, { orderBy: "location.street_second", limit: 3, page: 0 });
      expect(tasks2.data.map(i => i.location.street_second)).to.eql([ 'Suite 32', '231', '# 372' ])
    })
  });
});
