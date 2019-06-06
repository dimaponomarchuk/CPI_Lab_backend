'use strict';
const expect = require("chai").expect;
const moment = require("moment");

const {
  get
} = require("../database/index");

describe("Event", async () => {
  let db;

  before(async () => {
    db = get();
  });

  it("should be ok", async () => {
    await db.events.create({
      name: "Some nice event",
      description: "very important",
      address: "some street",
      start_datetime: moment.utc("02/10/2019 8:00 AM", "L LT").toISOString(),
      end_datetime: moment.utc("02/10/2019 10:00 AM", "L LT").toISOString(),
      street_first: "Broadway 120",
      city: "New York",
      code: "11111"
    });
  });

  it("should be not ok", async () => {
    let error;
    const params = {
      name: "Some nice event",
      description: "very important",
      address: "some street",
      start_datetime: moment.utc("02/10/2019 18:00 AM", "L LT").toISOString(),
      end_datetime: moment.utc("02/10/2019 10:00 AM", "L LT").toISOString(),
      street_first: "Broadway 120",
      city: "New York",
      code: "11111"
    };
    try {
      await db.events.create(params);
    } catch (e) {
      error = e;
    }
    expect(error.message).to.match(/End date should be greater then start date/);
  });
});
