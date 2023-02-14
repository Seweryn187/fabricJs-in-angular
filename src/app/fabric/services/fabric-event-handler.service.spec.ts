import { TestBed } from '@angular/core/testing';

import { FabricEventHandlerService } from './fabric-event-handler.service';

describe('FabricEventHandlerService', () => {
  let service: FabricEventHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FabricEventHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
