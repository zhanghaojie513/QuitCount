import { RequestContextService } from './request-context.service';

describe('RequestContextService', () => {
  it('scopes request identifiers to the callback', () => {
    const service = new RequestContextService();
    expect(service.getRequestId()).toBeUndefined();

    service.run('request-1', () => {
      expect(service.getRequestId()).toBe('request-1');
    });

    expect(service.getRequestId()).toBeUndefined();
  });
});
