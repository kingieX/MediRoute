import { logger } from '../utils/logger';

describe('Logger utility', () => {
  it('should log info messages without throwing', () => {
    expect(() => logger.info('Test info message')).not.toThrow();
  });

  it('should log error messages without throwing', () => {
    expect(() => logger.error('Test error message')).not.toThrow();
  });
});
