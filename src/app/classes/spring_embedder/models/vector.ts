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

    static atRandomPosition(): Vector {
        return new Vector(
            Math.random() * (SVGElementWithLabel.FULL_X - 2 * SVGElementWithLabel.circleRadius) + SVGElementWithLabel.circleRadius,
            Math.random() * (SVGElementWithLabel.FULL_Y - 2 * SVGElementWithLabel.circleRadius) + SVGElementWithLabel.circleRadius
        );
    }


    //TODO: take FULL_X from .canvas how does that work?


    /**
     * Adds a given vector to the vector. This is applied to every coordinate.
     */
    public add(otherVector: Vector): Vector {
        return new Vector(this.x + otherVector.x, this.y + otherVector.y);
    }

    public angle(otherVector: Vector): number {
        return Math.atan2((otherVector.y - this.y), (otherVector.x - this.x))
    }

    public equals(otherPoint: Vector): boolean {
        return this.x === otherPoint.x && this.y === otherPoint.y
    }

    divideBy(factor: number): Vector {
        this.x = this.x / factor;
        this.y = this.y / factor;
        return this;
    }

    copy() {
        return new Vector(this.x, this.y);
    }

    isWellFormed(): boolean {
        return !isNaN(this.x) && !isNaN(this.y);
    }

    static getMaxNorm(vectors: Array<Vector>): number {
        /**
         * Returns the maximal norm from an array of vectors
         */
        if (vectors.length <= 0) {
            return 0;
        }
        // Find the maximal norm on array.
        const norms = vectors.map(vector => vector.norm());
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
}
