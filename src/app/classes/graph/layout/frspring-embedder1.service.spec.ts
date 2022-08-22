import { TestBed } from '@angular/core/testing';

import { FRSpringEmbedder1Service } from './frspring-embedder1.service';

describe('FRSpringEmbedder1Service', () => {
  let service: FRSpringEmbedder1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FRSpringEmbedder1Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
