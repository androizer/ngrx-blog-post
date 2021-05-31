import { TestBed } from '@angular/core/testing';

import { ServerEventService } from './server-event.service';

describe('ServerEventService', () => {
  let service: ServerEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
