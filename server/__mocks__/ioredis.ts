export default class Redis {
  constructor() {}
  connect = jest.fn().mockResolvedValue(true);
  disconnect = jest.fn().mockResolvedValue(true);
  set = jest.fn().mockResolvedValue('OK');
  get = jest.fn().mockResolvedValue(null);
  del = jest.fn().mockResolvedValue(1);
  quit = jest.fn().mockResolvedValue('OK');
}
