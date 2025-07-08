const request = require('supertest');
const app = require('../app');
const mockingoose = require('mockingoose');
const Workout = require('../models/Workout');

// Mock data for workouts
const mockWorkout = {
  _id: '1234567890',
  userId: '1234567890',
  exercises: [
    { name: 'Push Up', sets: 3, reps: 15, weight: 0 }
  ],
  scheduledAt: new Date()
};

describe('Workout Management', () => {
  beforeEach(() => {
    mockingoose(Workout).toReturn(mockWorkout, 'save');
    mockingoose(Workout).toReturn([mockWorkout], 'find');
  });

  afterEach(() => {
    mockingoose.resetAll();
  });

  it('should create a new workout', async () => {
    const response = await request(app)
      .post('/workouts')
      .send({
        exercises: [
          { name: 'Push Up', sets: 3, reps: 15, weight: 0 }
        ],
        scheduledAt: new Date()
      })
      .set('Authorization', `Bearer some-valid-jwt-token`);
      
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('exercises');
  });

  it('should list all workouts', async () => {
    const response = await request(app)
      .get('/workouts')
      .set('Authorization', `Bearer some-valid-jwt-token`);
      
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should update a workout', async () => {
    const response = await request(app)
      .put(`/workouts/${mockWorkout._id}`)
      .send({
        exercises: [
          { name: 'Push Up', sets: 4, reps: 15, weight: 0 } // Updated sets
        ]
      })
      .set('Authorization', `Bearer some-valid-jwt-token`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('exercises');
  });

  it('should delete a workout', async () => {
    const response = await request(app)
      .delete(`/workouts/${mockWorkout._id}`)
      .set('Authorization', `Bearer some-valid-jwt-token`);
      
    expect(response.statusCode).toBe(200);
  });
});
