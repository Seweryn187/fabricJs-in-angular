import { TestBed } from '@angular/core/testing';

import { FabricShapeHandlerService } from './fabric-shape-handler.service';

describe('FabricShapeHandlerService', () => {
  let service: FabricShapeHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FabricShapeHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
