import {FRSpringEmbedder} from './frspringembedder';

import { Vector } from './models/vector';
import { TsModel } from '../diagram/tsmodel';


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