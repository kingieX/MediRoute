/**
 * @jest-environment node
 */
import { logEvent } from '../utils/loggerService';
import { prisma } from '../db/client';

// Mock Prisma client
jest.mock('../db/client', () => {
  return {
    prisma: {
      eventLog: {
        create: jest.fn(),
      },
    },
  };
});

describe('logEvent utility', () => {
  it('should call prisma.eventLog.create with correct data', async () => {
    const mockUserId = 'user123';
    const mockAction = 'TEST_ACTION';
    const mockDetails = 'Some details';

    await logEvent(mockUserId, mockAction, mockDetails);

    expect(prisma.eventLog.create).toHaveBeenCalledWith({
      data: {
        userId: mockUserId,
        action: mockAction,
        details: mockDetails,
      },
    });
  });

  it('should not throw if Prisma throws an error', async () => {
    (prisma.eventLog.create as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

    await expect(logEvent('user123', 'FAIL_ACTION')).resolves.not.toThrow();
  });
});
