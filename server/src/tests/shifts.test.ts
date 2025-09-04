import request from 'supertest';
import { app } from '../app';
import { prisma } from '../db/client';

let adminToken: string;
let departmentId: string;
let staffUserId: string;
let shiftId: string;

beforeAll(async () => {
  // Login with admin credentials (make sure seeded in test DB)
  const loginRes = await request(app)
    .post('/auth/login')
    .send({ email: 'admin@example.com', password: 'password' });

  adminToken = loginRes.body.accessToken;

  // Create test department
  const dept = await prisma.department.create({
    data: { name: 'Test Dept', capacity: 10 },
  });
  departmentId = dept.id;

  // Create test staff user
  const staff = await prisma.user.create({
    data: {
      email: 'shift.staff@example.com',
      password: 'hashedpassword', // password hash seeded earlier
      role: 'NURSE',
    },
  });
  staffUserId = staff.id;
});

afterAll(async () => {
  await prisma.shift.deleteMany();
  await prisma.user.deleteMany({ where: { email: 'shift.staff@example.com' } });
  await prisma.department.deleteMany({ where: { id: departmentId } });
  await prisma.$disconnect();
});

describe('Shifts Routes', () => {
  it('should create a new shift', async () => {
    const res = await request(app)
      .post('/shifts')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        userId: staffUserId,
        departmentId,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    shiftId = res.body.id;
  });

  it('should fetch a single shift', async () => {
    const res = await request(app)
      .get(`/shifts/${shiftId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', shiftId);
  });

  it('should update a shift', async () => {
    const res = await request(app)
      .put(`/shifts/${shiftId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString() });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', shiftId);
  });

  it('should delete a shift', async () => {
    const res = await request(app)
      .delete(`/shifts/${shiftId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});
