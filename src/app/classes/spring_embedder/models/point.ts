import { Vector } from "./vector";

export class Point {
    private _x: number;
    private _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    get x(): number {
        return this._x;
    }

    set x(newValue: number) {
        this._x = newValue;
    }

    get y(): number {
        return this._y;
    }

    set y(newValue: number) {
        this._y = newValue;
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
        this._x += vector.x;
        this._y += vector.y;
    }

    /**
     * Returns true if the coordinates of both points are pairwise equal.
     */
    public equals(otherPoint: Point): boolean {
        return this.x === otherPoint.x && this.y === otherPoint.y
    }
}