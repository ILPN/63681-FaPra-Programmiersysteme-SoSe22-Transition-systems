import {SVGElementWithLabel} from "../../diagram/SVGElementWithLabel";

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
        return new Vector(point1.x + point2.x, point1.y + point2.y).divideBy(2)
    }

    /**
     * Return a new vector at a random position. The coordinates are in the
     * intervall (0, 1).
     */
    static atRandomPosition(): Vector {
        return new Vector(
            Math.random(),
            Math.random()
        );
    }

    //TODO: take FULL_X from .canvas how does that work?


    /**
     * Adds a given vector to the vector. This is applied to every coordinate.
     */
    public add(otherVector: Vector): Vector {
        return new Vector(this.x + otherVector.x, this.y + otherVector.y);
    }

    /**
     * Manipulates this vector by adding the passed vector. Returns the result afterwards.
     * @param otherVector
     */
    public addToThisVector(otherVector: Vector): Vector{
        this.x = this.x + otherVector.x;
        this.y = this.y + otherVector.y
        return this;
    }

    /**
     * Manipulates this vector by subtracting the passed vector. Returns the result afterwards.
     * @param otherVector
     */
    public subtractFromThisVector(otherVector: Vector): Vector{
        this.x = this.x - otherVector.x;
        this.y = this.y - otherVector.y;
        return this;
    }

    /**
     * Substracts a given vector from the current one. This is applied to every
     * coordinate.
     */
    public subtract(otherVector: Vector): Vector {
        return new Vector(this.x - otherVector.x, this.y - otherVector.y);
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

    /**
     * Returns a vector of the given length which is orthogonal to this vector.
     * @param vectorLength The length of the returned vector
     */
    public orthogonalVector(vectorLength: number): Vector {
        let orthVectorAngle = 0.5 * Math.PI - this.angleToXAxis();
        let yResult = vectorLength * Math.sin(orthVectorAngle);
        let xResult = vectorLength * Math.cos(orthVectorAngle);
        return new Vector(-xResult, yResult);
    }

    public equals(otherPoint: Vector): boolean {
        return this.x === otherPoint.x && this.y === otherPoint.y
    }

    divideBy(factor: number): Vector {
        if(factor === 0){
            throw new Error("Illegal argument '0' in method Vector#divideBy!");
        }
        this.x = this.x / factor;
        this.y = this.y / factor;
        return this;
    }

    copy() {
        return new Vector(this.x, this.y);
    }

    /**
     * Returns ture if at least one of the coordinates is None.
     */
    isNaN(): boolean {
        return isNaN(this.x) || isNaN(this.y);
    }

    /**
     * Returns the maximal norm from an array of vectors
     */
    static getMaxNorm(vectors: Array<Vector>): number {
        if (vectors.length <= 0) {
            return 0;
        }
        // Find the maximal norm on array.
        const norms = vectors.map(vector => vector.norm());
        console.group('norms')
        for(const norm of norms) {
            console.log(norm);
        }
        console.groupEnd()
        return Math.max(...norms);

    }

    static getMaxX(vectors: Array<Vector>): number {
        if (!vectors)
            return 0;
        const x = vectors.map(vector => vector.x);
        return Math.max(...x);
    }

    static getMaxY(vectors: Array<Vector>): number {
        if (!vectors)
            return 0;
        const y = vectors.map(vector => vector.y);
        return Math.max(...y);
    }

    static getMinX(vectors: Array<Vector>): number {
        if (!vectors)
            return 0;
        const x = vectors.map(vector => vector.x);
        return Math.min(...x);
    }

    static getMinY(vectors: Array<Vector>): number {
        if (!vectors)
            return 0;
        const y = vectors.map(vector => vector.y);
        return Math.min(...y);
    }

    static atCircularPosition(anInteger: number): Array<Vector> {
        let result = new Array<Vector>();
        let start = new Vector(SVGElementWithLabel.FULL_X / 2, SVGElementWithLabel.FULL_Y / 2);
        let radius = 200;
        for (let i = 0; i < anInteger; i++) {
            result.push(start.add(Vector.byAngle(2 * Math.PI * i / anInteger, radius)))
        }
        return result;
    }

    private static byAngle(phi: number, norm: number) {
        return new Vector(Math.cos(phi) * norm, Math.sin(phi) * norm);
    }

    /**
     * Returns the distance to the given vector.
     */
    public distanceTo(otherVector: Vector): number {
        const vector = Vector.byPoints(this, otherVector);
        return vector.norm();
    }

    public shiftAlongAngle(shift: number, angle: number):Vector {
        return new Vector(this.x + shift * Math.cos(angle),this.y + shift * Math.sin(angle));
    }
}
