'use strict';
const expect = require('chai').expect;
const Sequelize = require('sequelize');

const { db } = require('../database/index');
const { create, createList } = require('./factories/Factory');
const TeamsDAL = require('../api/teams/teamsDAL');

describe('RelationsCounter', async () => {
  let company_id;

  before(async () => {
    const company = await create(db().companies);
    company_id = company.company_id;
  });

  it('.usersCount, .organizationsCount, .locationsCount', async () => {
    const teamA = await create(db().teams, { company_id });

    await createList(db().users, 2, { team_ids: [teamA.team_id] });
    await createList(db().organizations, 2, {
      team_ids: [teamA.team_id],
      company_id,
    });
    await createList(db().locations, 2, { team_ids: [teamA.team_id] });

    const teamB = await create(db().teams, { company_id });

    await createList(db().users, 0, { team_ids: [teamB.team_id] });
    await createList(db().organizations, 3, {
      team_ids: [teamB.team_id],
      company_id,
    });
    await createList(db().locations, 3, { team_ids: [teamB.team_id] });

    const teamC = await create(db().teams, { company_id });

    await createList(db().users, 2, { team_ids: [teamC.team_id] });
    await createList(db().organizations, 2, {
      team_ids: [teamC.team_id],
      company_id,
    });
    await createList(db().locations, 2, { team_ids: [teamC.team_id] });

    const a = await TeamsDAL(db()).getCompanyTeams(company_id, {withCounts: true});

    expect(a[0].usersCount).to.eq(2);
    expect(a[0].organizationsCount).to.eq(2);
    expect(a[0].locationsCount).to.eq(2);

    expect(a[1].usersCount).to.eq(0);
    expect(a[1].organizationsCount).to.eq(3);
    expect(a[1].locationsCount).to.eq(3);

    expect(a[2].usersCount).to.eq(2);
    expect(a[2].organizationsCount).to.eq(2);
    expect(a[2].locationsCount).to.eq(2);
  });
});
