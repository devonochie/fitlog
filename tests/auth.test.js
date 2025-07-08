const request = require('supertest');
const app = require('../app'); // Assuming the express app is exported from app.js
const mockingoose = require('mockingoose');
const User = require('../models/User');

// Mock data for user
const mockUser = {
  _id: '1234567890',
  email: 'testuser@example.com',
  password: 'hashedpassword',
  tokens: []
};

describe('User Authentication', () => {
  beforeEach(() => {
    mockingoose(User).toReturn(mockUser, 'save');
    mockingoose(User).toReturn(mockUser, 'findOne');
  });

  afterEach(() => {
    mockingoose.resetAll();
  });

  it('should sign up a new user', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send({
        email: 'testuser@example.com',
        password: 'password123'
      });
      
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('token');
  });

  it('should log in an existing user', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123'
      });
      
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should not log in with incorrect password', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'wrongpassword'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
