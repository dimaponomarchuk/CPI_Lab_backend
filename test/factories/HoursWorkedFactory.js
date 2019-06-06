const {
  get
} = require("../../database/index");

const HoursWorkedFactory = async (params = {}) => {
  let db = get();
  const data = {
    hours_worked: 1.5,
    user_id: params.user_id,
    start_date: params.start_date,
    end_date: params.end_date,
  };
  const hour = await db.user_hours_worked.create(data);
  return hour;
};

module.exports = HoursWorkedFactory;
