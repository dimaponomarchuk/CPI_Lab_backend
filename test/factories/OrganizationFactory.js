const { get } = require('../../database/index');
const faker = require('faker');

const OrganizationFactory = async (params = {}) => {
    const db = get();
    const data = {
        name: params.name || faker.lorem.sentence(),
        description: params.description || faker.lorem.sentence(),
        company_id: params.company_id || 1
    };

    if (params.quickbooks_realm_id) {
       data.quickbooks_realm_id = params.quickbooks_realm_id;
    }

    if (params.merchant_id) {
        data.merchant_id = params.merchant_id;
    }

    if (params.qb_access_token) {
        data.qb_access_token = params.qb_access_token;
    }

    if (params.qb_refresh_token) {
        data.qb_refresh_token = params.qb_refresh_token;
    }

    const organization = await db.organization.create(data);

    return organization;
};

module.exports = OrganizationFactory;
