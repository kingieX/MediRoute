import request from 'supertest';
import { app, prisma } from '../app';
import bcrypt from 'bcrypt';

describe('Auth Routes', () => {
  const testUser = {
    email: 'auth.test@example.com',
    password: 'Test1234!',
    role: 'ADMIN',
  };

  beforeAll(async () => {
    // Clean up if test user already exists
    await prisma.user.deleteMany({ where: { email: testUser.email } });

    // Create test user in DB
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    await prisma.user.create({
      data: {
        email: testUser.email,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await prisma.$disconnect();
  });

  it('should login with valid credentials and return tokens', async () => {
    const res = await request(app).post('/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });

  it('should reject login with invalid credentials', async () => {
    const res = await request(app).post('/auth/login').send({
      email: testUser.email,
      password: 'wrongpassword',
    });

    expect(res.status).toBe(401);
  });

  it('should refresh access token using valid refresh token', async () => {
    const loginRes = await request(app).post('/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    const refreshToken = loginRes.body.refreshToken;

    const refreshRes = await request(app).post('/auth/refresh').send({
      refreshToken,
    });

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body).toHaveProperty('accessToken');
  });
});
