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
        this.multiplyWith(1 / norm);
    }

    /**
     * Multiplies the entries with the given scalar.
     */
    multiplyWith(scalar: number): void {
        this.x = scalar * this.x;
        this.y = scalar * this.y;
    }

    /**
     * Computes a vector running though the given points.
     */
    static byPoints(point1: Vector, point2: Vector): Vector {
        //confusing name
        return new Vector(
            point2.x - point1.x,
            point2.y - point1.y
        );
    }

    static atRandomPosition(): Vector {
        return new Vector(
            Math.random() * Vector.RANGE_X + Vector.OFFSET,
            Math.random() * Vector.RANGE_Y + Vector.OFFSET
        );
    }

    private static readonly OFFSET = 20;
    private static readonly RANGE_X = 800;
    private static readonly RANGE_Y = 300;

    /**
     * Adds a given vector to the vector. This is applied to every coordinate.
     */
    public add(otherVector: Vector): void {
        this.x += otherVector.x;
        this.y += otherVector.y;
    }

    public angle(otherVector: Vector): number {
        return Math.atan2((otherVector.y - this.y), (otherVector.x - this.x))
    }

    public equals(otherPoint: Vector): boolean {
        return this.x === otherPoint.x && this.y === otherPoint.y
    }

    devideBy(factor: number) {
        this.x = this.x / factor;
        this.y = this.y / factor;
    }
}
