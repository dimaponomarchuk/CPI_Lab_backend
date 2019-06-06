const { createAccessToken } = require('../../api/admin/auth');
const app = require('../../app');
const chai = require("chai"), chaiHttp = require('chai-http');
chai.use(chaiHttp);

const requester = chai.request(app).keepOpen();
const user = {
  email: 'test@gmail.com',
  user_id: '1',
  types: [],
  companies: []
};

const token = createAccessToken(user);

module.exports = {
  get: (url) => {
    return requester.get(url).set('Authorization', token);
  },
  post: (url) => {
    return requester.post(url).set('Authorization', token);
  },
  put: (url) => {
    return requester.put(url).set('Authorization', token);
  },
  delete: (url) => {
    return requester.delete(url).set('Authorization', token);
  }
};
