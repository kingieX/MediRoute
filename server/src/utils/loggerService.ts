import { prisma } from '../db/client';

/**
 * Save an event log into the database
 * @param userId - user performing the action (optional, null if system event)
 * @param action - short action label (e.g., LOGIN, CREATE_DEPT)
 * @param details - optional description/details
 */
export async function logEvent(userId: string | null, action: string, details?: string) {
  try {
    await prisma.eventLog.create({
      data: { userId, action, details },
    });
  } catch (err) {
    console.error('❌ Failed to log event:', err);
  }
}
