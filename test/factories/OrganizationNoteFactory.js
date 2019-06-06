const { get } = require('../../database/index');
const moment = require('moment');
const faker = require('faker');
const datetime = require('../../lib/datetime');

const OrganizationNoteFactory = async (params = {}) => {
    const db = get();
    const data = {
        subject: params.subject || faker.lorem.sentence(),
        body: params.body || faker.lorem.sentence(),
        modified_date: datetime.currentISO()
    };

    if (params.organization_id) {
        data.organization_id = params.organization_id;
    }

    if (params.modified_by_id) {
        data.modified_by_id = params.modified_by_id;
    }

    const note = await db.organization_notes.create(data);

    return note;
};

module.exports = OrganizationNoteFactory;
