import {TestBed} from '@angular/core/testing';
import {ParserService} from './parser.service';

describe('ParserService', () => {
    let service: ParserService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ParserService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('Standard File Model', () => {
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
        let model = service.parse(file,false);
        expect(model.nodes.length).toBe(5);
        expect(model.edges.length).toBe(6);
        expect(model.getNode("n1")).toBeTruthy();
        expect(model.getNode("fsdfs")).toBeFalsy();
    });
});
