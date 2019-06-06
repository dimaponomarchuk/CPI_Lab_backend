"use strict";

require("./TaskDAL.spec");

const {
  initDb, db
} = require("../database/index");

const TaskStatusFactory = require("./factories/TaskStatusFactory");

const typesEnum = require('../config/typesEnum').userTypes;
const _ = require("lodash");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

before(async () => {
  await initDb();
  await TaskStatusFactory("Opened");

  const types = [
    { value: "Indoor", managed: 1 },
    { value: "Outdoor", managed: 1 },
    { value: "Cleaning", managed: 1 },
    { value: "Laundry", managed: 1 },
    { value: "Outside", managed: 1 },
    { value: "Other", managed: 1 },
    { value: "HOA - Admin", managed: 0 },
    { value: "HOA - Maintenance", managed: 0 },
    { value: "HOA - Financial", managed: 0 },
  ];

  await Promise.all(types.map(i => {
    return db().task_types.findOrCreate({ where: i });
  }));

  const priority = [
    "Critical",
    "High",
    "Medium",
    "Low",
  ];

  await Promise.all(priority.map(i => {
    return db().task_priorities.findOrCreate({ where: { value: i } });
  }));

  await Promise.all(_.map(typesEnum, (id, value) => {
    return db().types_table.findOrCreate({where: {type_value: value}})
  }))
});

after(async () => {
  // FIXME sleep works, but we should db rid of it
  await sleep(1000);
  await db().sequelize.close();
});
