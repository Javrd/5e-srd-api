const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../../server');
const { mongodbUri, redisClient } = require('../../../util');

afterEach(() => {
  jest.clearAllMocks();
});

beforeAll(async () => {
  await mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(() => {
  mongoose.disconnect();
  redisClient.quit();
});

describe('/api/starting-equipment', () => {
  it('should list starting equipment', async () => {
    const res = await request(app).get('/api/starting-equipment');
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).not.toEqual(0);
  });

  describe('/api/starting-equipment/:index', () => {
    it('should return one object', async () => {
      const indexRes = await request(app).get('/api/starting-equipment');
      const index = indexRes.body.results[0].index;
      const showRes = await request(app).get(`/api/starting-equipment/${index}`);
      expect(showRes.statusCode).toEqual(200);
      expect(showRes.body.index).toEqual(index);
    });
    describe('with an invalid index', () => {
      it('should return one object', async () => {
        const invalidIndex = 'bad-class';
        const showRes = await request(app).get(`/api/starting-equipment/${invalidIndex}`);
        expect(showRes.statusCode).toEqual(404);
      });
    });
  });
});
