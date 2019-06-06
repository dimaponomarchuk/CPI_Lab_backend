const { get } = require("../../database/index");
const moment = require("moment");
const faker = require('faker');
const datetime = require('../../lib/datetime');

const TaskFactory = async (params = {}) => {
  const db = get();
  const data = {
    title: params.title || faker.lorem.sentence(),
    description: faker.lorem.sentence(),
    due_date: params.due_date || moment.utc("2018-02-08 19:00:00").toISOString(),
    created_date: datetime.currentISO(),
  };

  const status = params.status || "Opened";
  data.status_id = (await db.task_status.findOne({
    where: { value: status }
  })).status_id;

  if (params.type) {
    data.type_id = (await db.task_types.findOne({
      where: { value: params.type }
    })).type_id;
  }

  if (params.priority) {
    data.priority_id = (await db.task_priorities.findOne({
      where: { value: params.priority }
    })).priority_id;
  }

  if (params.company_id) {
    data.company_id = params.company_id;
  }
  if (params.updates) {
    data.updates = params.updates;
  }
  if (params.location_id) {
    data.location_id = params.location_id
  }

  const task = await db.tasks.create(data, {
    include: [{
      model: db.task_updates,
      as: 'updates'
    }]
  });

  if (params.user_ids) {
    await Promise.all([].concat(params.user_ids).map(user_id =>
      db.tasks_users.create({ task_id: task.task_id, user_id: user_id })
    ));
  }

  if (params.team_ids) {
    await Promise.all(params.team_ids.map(team_id =>
      db.tasks_teams.create({ task_id: task.task_id, team_id: team_id })
    ));
  }

  return task;
};

module.exports = TaskFactory;
