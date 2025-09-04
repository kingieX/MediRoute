import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../utils/jwt';

describe('Token utility', () => {
  const userPayload = { userId: 'test-user', role: 'ADMIN' };

  it('should generate a valid access token', () => {
    const token = signAccessToken(userPayload);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  it('should verify a valid access token', () => {
    const token = signAccessToken(userPayload);
    const decoded = verifyAccessToken(token);
    expect(decoded).toMatchObject(userPayload);
  });

  it('should generate a valid refresh token', () => {
    const token = signRefreshToken(userPayload);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  it('should verify a valid refresh token', () => {
    const token = signRefreshToken(userPayload);
    const decoded = verifyRefreshToken(token);
    expect(decoded).toMatchObject(userPayload);
  });

  it('should throw error for invalid token', () => {
    const fakeToken = 'invalid.token.value';
    expect(() => verifyAccessToken(fakeToken)).toThrow();
  });
});
