import { TestBed } from '@angular/core/testing';

import { VisualizerService } from './visualizer.service';

describe('VisualizerEntityService', () => {
  let service: VisualizerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisualizerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
