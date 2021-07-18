import { TestBed } from '@angular/core/testing';

import { EntityEmitterService } from './entity-emitter.service';

describe('EntityEmitterService', () => {
  let service: EntityEmitterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntityEmitterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
