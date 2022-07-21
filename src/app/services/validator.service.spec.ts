import {TestBed} from '@angular/core/testing';

import {ValidatorService} from './validator.service';

describe('ValidatorService', () => {
    let service: ValidatorService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ValidatorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('Valid File should be valid', () => {
        let file =`.type ts
.nodes
n1 (10000)
n2 (01000)
n3 (00100)
n4 (00001)
n5 (00010)
.edges
n1 n2 t1
n2 n3 t2
n3 n4 t4
n3 n5 t5
n4 n2 t6
n2 n1 t7
`;
        expect(service.validateTS(file).valid).toBeTrue();
    });
    it('missing node id in edges should be invalid', () => {
        let file =`.type ts
    .nodes
n1 (10000)
n2 (01000)

    .edges
n1 n3 t1
`;
        expect(service.validateTS(file).valid).toBeFalse();
    });
});
