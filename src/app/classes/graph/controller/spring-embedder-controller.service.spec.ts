import { TestBed } from '@angular/core/testing';

import { SpringEmbedderControllerService } from './spring-embedder-controller.service';

describe('SpringEmbedderControllerService', () => {
  let service: SpringEmbedderControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpringEmbedderControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
