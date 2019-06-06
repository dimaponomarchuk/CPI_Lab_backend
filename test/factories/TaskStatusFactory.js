const { get } = require("../../database/index");

const STATUSES = ['Opened', 'Completed', 'Deleted', 'Billed', 'Closed'];

const TaskStatusFactory = async function (value) {
  if (!STATUSES.includes(value)) {
    throw new Error(`Incorrect status: ${value}`);
  }

  const db = get();

  const res = await db.task_status.findOrCreate({ where: { value: value } });
  return res[0];
};

module.exports = TaskStatusFactory;
