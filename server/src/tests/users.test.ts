import request from 'supertest';
import { app, prisma } from '../app';
import bcrypt from 'bcrypt';

describe('Users Routes', () => {
  let adminToken: string;
  const adminUser = {
    email: 'admin.test@example.com',
    password: 'Admin123!',
    role: 'ADMIN',
  };

  beforeAll(async () => {
    // Clean up old users
    await prisma.user.deleteMany({
      where: { email: { in: [adminUser.email, 'user1@example.com'] } },
    });

    // Create an admin user
    const hashedPassword = await bcrypt.hash(adminUser.password, 10);
    await prisma.user.create({
      data: {
        email: adminUser.email,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    // Login to get admin token
    const res = await request(app).post('/auth/login').send({
      email: adminUser.email,
      password: adminUser.password,
    });
    adminToken = res.body.accessToken;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { in: [adminUser.email, 'newuser@example.com'] } },
    });
    await prisma.$disconnect();
  });

  it('should create a new user (ADMIN only)', async () => {
    const res = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: 'user1@example.com',
        password: 'User123!',
        role: 'DOCTOR',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe('user1@example.com');
  });

  it('should list users (ADMIN only)', async () => {
    const res = await request(app).get('/users').set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should update a user (ADMIN only)', async () => {
    const user = await prisma.user.findUnique({
      where: { email: 'user1@example.com' },
    });

    const res = await request(app)
      .put(`/users/${user?.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'NURSE' });

    expect(res.status).toBe(200);
    expect(res.body.role).toBe('NURSE');
  });

  it('should delete a user (ADMIN only)', async () => {
    const user = await prisma.user.findUnique({
      where: { email: 'user1@example.com' },
    });

    const res = await request(app)
      .delete(`/users/${user?.id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});
