import {Vector} from './vector';

describe('Vector', () => {
    let vector: Vector;

    beforeEach(() => {
        // A vector having an euclidean norm of 5
        vector = new Vector(3, 4);
    });

    it('Vectors can be added', () => {
        const otherVector = new Vector(1, 1);
        vector = vector.add(otherVector);
        expect(vector.x).toEqual(4);
        expect(vector.y).toEqual(5);
    });

    it('A scalar can be multiplied', () => {
        const scalar = 1.5;
        vector.multiplyWith(scalar);
        expect(vector.x).toEqual(4.5);
        expect(vector.y).toEqual(6);
    });

    it('The norm can be computed', () => {
        expect(vector.norm()).toEqual(5);
    });

    it('Vector can be normalized', () => {
        vector.normalize();
        expect(vector.norm()).toEqual(1)
        // Comparing decimals can be a bit tricky. Hence we compute the
        // difference and ensure it's smal enough.
        const epsilon = 1 / 1000
        expect(Math.abs(vector.x - (3 / 5))).toBeLessThanOrEqual(epsilon)
        expect(Math.abs(vector.y - (4 / 5))).toBeLessThanOrEqual(epsilon)
    });

    it('A vector can be created that runy through two points', () => {
        const point1 = new Vector(1, 0);
        const point2 = new Vector(3, 2);
        const vector = Vector.byPoints(point1, point2);
        expect(vector.x).toEqual(3 - 1);
        expect(vector.y).toEqual(2);
    });
    it('Can be compared to be equal', () => {
        const secondPoint = new Vector(3, 4);
        expect(vector.equals(secondPoint)).toBeTruthy();

        const thirdPoint = new Vector(1, 2);
        expect(vector.equals(thirdPoint)).toBeFalsy();
    });

    it('Can be moved by a given vector', () => {
        const vector2 = new Vector(1, 0.5);
        vector = vector.add(vector2);
        expect(vector.x).toEqual(4);
        expect(vector.y).toEqual(4.5)
    });

    it('Can be created randomly', () => {
        // Not realy sure how to test this properly. At least we verify the
        // existence of the 'random' metod.
        const randomPoint = Vector.atRandomPosition();
        expect(randomPoint).toBeInstanceOf(Vector)
    });
});
