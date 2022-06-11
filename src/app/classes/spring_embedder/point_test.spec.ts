import {Point} from './point'
import {Vector} from './vector'

describe('Point', () => {
    let point: Point ;

    beforeEach(() => {
        // A vector having an euclidean norm of 5
        point = new Point(1, 1);
    });

    it('Can be compared to be equal', () => {
        const secondPoint = new Point(1, 1);
        expect(point.equals(secondPoint)).toBeTruthy();

        const thirdPoint = new Point(1, 2);
        expect(point.equals(thirdPoint)).toBeFalsy();
    });

    it('Can be moved by a given vector', () => {
        const vector = new Vector(1, 0.5);
        point.moveBy(vector);
        expect(point.x).toEqual(2);
        expect(point.y).toEqual(1.5)
    });

    it('Can be created randomly', () => {
        // Not realy sure how to test this properly. At least we verify the
        // existence of the 'random' metod.
        const randomPoint = Point.random();
        expect(randomPoint).toBeInstanceOf(Point)
    });
});