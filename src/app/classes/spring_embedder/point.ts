import { Vector } from "./vector";

export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Returns a Point by choosing random coordinate
     */
    static random(): Point {
        return new Point(
            Math.random(),
            Math.random()
        );
    }

    /**
     * Moves the point by the given vector. In other words: The coordinates
     * of the vector are added to the one of the point.
     */
    public moveBy(vector: Vector): void {
        this.x += vector.x;
        this.y += vector.y;
    }

    /**
     * Returns true if the coordinates of both points are pairwise equal.
     */
    public equals(otherPoint: Point): boolean {
        return this.x === otherPoint.x && this.y === otherPoint.y
    }
}