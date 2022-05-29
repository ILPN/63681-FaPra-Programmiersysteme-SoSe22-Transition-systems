import {Node} from './models';

export class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Computes the eucledean norm of the vector
     */
    norm(): number {
        return Math.sqrt(
            this.x * this.x +
            this.y * this.y
        );
    }

    /**
     * Normalizes the vector.
     */
    normalize(): void {
        const norm = this.norm();
        this.x = (1 / norm) * this.x;
        this.y = (1 / norm) * this.y;
    }

    /**
     * Multiplies the entries with the given scalar
     */
    applyScalar(scalar: number): void {
        this.x = scalar * this.x;
        this.y = scalar * this.y;
    }

    /**
     * Computes a vector that runs through the given nodes.
     * @param node1
     * @param node2
     */
    static byNodes(node1: Node, node2: Node): Vector {
        const vector = new Vector(
            node2.x - node1.x,
            node2.y - node1.y
        );
        return vector;
    }
}