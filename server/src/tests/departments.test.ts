import request from 'supertest';
import { app, prisma } from '../app';
import bcrypt from 'bcrypt';

describe('Departments Routes', () => {
  let adminToken: string;
  let departmentId: string;
  const adminUser = {
    email: 'admin.dept@example.com',
    password: 'Admin123!',
    role: 'ADMIN',
  };

  beforeAll(async () => {
    // Clean up old data
    await prisma.user.deleteMany({ where: { email: adminUser.email } });
    await prisma.department.deleteMany({ where: { name: { contains: 'TestDept' } } });

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
    await prisma.department.deleteMany({
      where: { name: { contains: 'DeptTest' } },
    });
    await prisma.user.deleteMany({
      where: { email: adminUser.email },
    });
    await prisma.$disconnect();
  });

  it('should create a new department (ADMIN only)', async () => {
    const res = await request(app)
      .post('/departments')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'TestDept1',
        capacity: 10,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('TestDept1');

    departmentId = res.body.id;
  });

  it('should fetch all departments', async () => {
    const res = await request(app).get('/departments').set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fetch a single department by ID', async () => {
    const res = await request(app)
      .get(`/departments/${departmentId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', departmentId);
  });

  it('should update a department', async () => {
    const res = await request(app)
      .put(`/departments/${departmentId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ capacity: 20 });

    expect(res.status).toBe(200);
    expect(res.body.capacity).toBe(20);
  });

  it('should delete a department', async () => {
    const res = await request(app)
      .delete(`/departments/${departmentId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});
