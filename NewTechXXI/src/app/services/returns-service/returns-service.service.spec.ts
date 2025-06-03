import { TestBed } from '@angular/core/testing';

import { ReturnsServiceService } from './returns-service.service';

describe('ReturnsServiceService', () => {
  let service: ReturnsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReturnsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
