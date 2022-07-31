import {TestBed} from '@angular/core/testing';

import {FRSpringEmbedder} from './frspringembedder';
import { ParserService } from '../../services/parser.service';
import { Vector } from './models/vector';
import { TsModel } from '../diagram/tsmodel';


const DEFAULT_TS_FILE = `
.type ts
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
`

function minNodeDistance(model: TsModel): number {
    let minDistance = Number.MAX_VALUE;
    const positions = model.nodes.map(node => node.position);
    for (let i = 0; i < positions.length; i++)
    {
        for (let j = i + 1; j < positions.length; j++)
        {
            const firstPosition = positions[i];
            const secondPosition = positions[j];
            const distance = firstPosition.distanceTo(secondPosition);
            if (distance <= minDistance) {
                minDistance = distance;
            }
        }
    }
    return minDistance;
}


describe('SpringEmbedder', () => {
    let parser: ParserService;
    let model: TsModel;
    let embedder: FRSpringEmbedder;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        parser = TestBed.inject(ParserService);
        model = parser.parse(DEFAULT_TS_FILE);
    });

    it('Embedding can be executed', () => {
        embedder = new FRSpringEmbedder(
            model,
            (i) => 1.0 / (50 * i),
            180
        );
        embedder.run(100, 1);
        const minDistance = minNodeDistance(model);
        expect(minDistance).toBeGreaterThanOrEqual(100);
    });
});

describe('RepulsiveForce computation', () => {

    let model: TsModel = new TsModel;
    let embedder: FRSpringEmbedder = new FRSpringEmbedder(model);

    it('computeSingleRepulsiveForce return 0 when vectors are equal', () => {
        const firstVector = new Vector(1, 1);
        const secondVector = new Vector(1, 1);
        const resultVector = embedder.computeSingleRepulsiveForce(firstVector, secondVector);
        expect(resultVector.equals(new Vector(0, 0))).toBeTruthy();
    })

    it('single RepulsiveForce is computed correctly', () => {
        const firstVector = new Vector(1, 0);
        const secondVector = new Vector(0, 1);
        embedder.springLength  = 2;

        const expectedForce = new Vector(-2, 2);
        const givenForce = embedder.computeSingleRepulsiveForce(firstVector, secondVector);

        const difference = expectedForce.subtract(givenForce);
        expect(difference.x).toBeLessThan(0.00001);
        expect(difference.y).toBeLessThan(0.00001);
    });

});

describe('AttractiveForce computation', () => {
    let model: TsModel = new TsModel;
    let embedder: FRSpringEmbedder = new FRSpringEmbedder(model);

    it('single AttractiveForce is computed correctly', () => {
        const firstVector = new Vector(1, 0);
        const secondVector = new Vector(0, 1);
        embedder.springLength  = 2;

        const expectedForce = new Vector(1, -1);
        expectedForce.multiplyWith(1 / Math.sqrt(2))
        const givenForce = embedder.computeSingleAttractiveForce(firstVector, secondVector);

        const difference = expectedForce.subtract(givenForce);
        expect(difference.x).toBeLessThan(0.00001);
        expect(difference.y).toBeLessThan(0.00001);
    });
});