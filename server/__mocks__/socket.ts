export const initSocket = jest.fn();
export const getIO = jest.fn(() => ({
  emit: jest.fn(),
  on: jest.fn(),
}));
export const emitEvent = jest.fn();
