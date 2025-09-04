import request from 'supertest';
import { app } from '../app';
import { prisma } from '../db/client';

let adminToken: string;
let departmentId: string;
let patientId: string;

beforeAll(async () => {
  const loginRes = await request(app)
    .post('/auth/login')
    .send({ email: 'admin@example.com', password: 'password' });

  adminToken = loginRes.body.accessToken;

  const dept = await prisma.department.create({
    data: { name: 'Patient Dept', capacity: 20 },
  });
  departmentId = dept.id;
});

afterAll(async () => {
  await prisma.patient.deleteMany();
  await prisma.department.deleteMany({ where: { id: departmentId } });
  await prisma.$disconnect();
});

describe('Patients Routes', () => {
  it('should create a new patient', async () => {
    const res = await request(app)
      .post('/patients')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Patient',
        age: 45,
        departmentId,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    patientId = res.body.id;
  });

  it('should list all patients', async () => {
    const res = await request(app).get('/patients').set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fetch a single patient', async () => {
    const res = await request(app)
      .get(`/patients/${patientId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', patientId);
  });

  it('should update a patient status', async () => {
    const res = await request(app)
      .put(`/patients/${patientId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'IN_TREATMENT' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('IN_TREATMENT');
  });

  it('should delete a patient', async () => {
    const res = await request(app)
      .delete(`/patients/${patientId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});
