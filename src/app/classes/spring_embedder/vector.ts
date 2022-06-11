import {Point} from './point';

export class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Computes the eucledean norm of the vector.
     */
    norm(): number {
        return Math.sqrt(
            this.x * this.x +
            this.y * this.y
        );
    }

    /**
     * Normalizes the vector. This means to modify the coordinates of the
     * vector in a way that it's norm is 1.
     */
    normalize(): void {
        const norm = this.norm();
        this.applyScalar(1 / norm);
    }

    /**
     * Multiplies the entries with the given scalar.
     */
    applyScalar(scalar: number): void {
        this.x = scalar * this.x;
        this.y = scalar * this.y;
    }

    /**
     * Computes a vector running though the given points.
     */
    static byPoints(point1: Point, point2: Point): Vector {
        const vector = new Vector(
            point2.x - point1.x,
            point2.y - point1.y
        );
        return vector;
    }

    /**
     * Adds a given vector to the vector. This is applied to every coordinate.
     */
    add(otherVector: Vector): void {
        this.x += otherVector.x;
        this.y += otherVector.y;
    }
}