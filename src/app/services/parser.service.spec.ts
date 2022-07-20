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
e1 t1 1 n1 n2
e2 t2 1 n2 n3
e3 t3 1 n3 n4
e4 t4 1 n3 n5
e5 t5 1 n4 n2
`;
        let model = service.parse(file,false);
        expect(model.nodes.length).toBe(5);
        expect(model.edges.length).toBe(5);
        expect(model.getNode("n1")).toBeTruthy();
        expect(model.getNode("fsdfs")).toBeFalsy();
    });
});
