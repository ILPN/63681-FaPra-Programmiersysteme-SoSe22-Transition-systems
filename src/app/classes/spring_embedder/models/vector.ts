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
    normalize(): Vector {
        const norm = this.norm();
        return this.multiplyWith(1 / norm);
    }

    /**
     * Multiplies the entries with the given scalar.
     */
    multiplyWith(scalar: number): Vector {
        this.x = scalar * this.x;
        this.y = scalar * this.y;
        return this;
    }

    /**
     * Creates a new vector from the passed vector multiplied by the given scalar.
     * @param vector The vector to be multiplied.
     * @param scalar The value to multiply the given vector with.
     */
    public static multiply(vector: Vector, scalar: number){
        return new Vector(vector.x * scalar, vector.y * scalar);
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
    static midOf(point1: Vector, point2: Vector): Vector {
        return new Vector(point1.x+point2.x,point1.y+point2.y).divideBy(2)
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
    //TODO: take FULL_X from .canvas how does that work?
    public static readonly FULL_X = 1296;
    public static readonly FULL_Y = 400;

    /**
     * Adds a given vector to the vector. This is applied to every coordinate.
     */
    public add(otherVector: Vector): Vector {
        this.x += otherVector.x;
        this.y += otherVector.y;
        return this;
    }

    /**
     * Creates a new vector that is the sum of the two given vectors.
     */
    public static add(vector1: Vector, vector2: Vector): Vector {
        return new Vector(vector1.x + vector2.x, vector1.y + vector2.y);
    }

    /**
     * Creates a new vector that is the subtraction of the first from the second vector:
     * @param vector2 minus @param vector1
     */
    public static subtract(vector1: Vector, vector2: Vector): Vector {
        return new Vector(vector2.x - vector1.x, vector2.y - vector1.y);
    }

    public angle(otherVector: Vector): number {
        return Math.atan2((otherVector.y - this.y), (otherVector.x - this.x))
    }

    public angleToXAxis(): number {
        return Math.atan2(this.y, this.x);
    }

    public equals(otherPoint: Vector): boolean {
        return this.x === otherPoint.x && this.y === otherPoint.y
    }

    divideBy(factor: number):Vector {
        this.x = this.x / factor;
        this.y = this.y / factor;
        return this;
    }

    limitToScreen() {
        this.x = Math.min(Math.max(0, this.x), Vector.FULL_X);
        this.y = Math.min(Math.max(0, this.y), Vector.FULL_Y);
    }
}
