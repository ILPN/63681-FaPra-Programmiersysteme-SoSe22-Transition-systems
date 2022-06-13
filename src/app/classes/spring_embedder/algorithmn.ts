import {Vector} from './models/vector';
import {Edge} from './models/edge';

/**
 * The colling is applied after each iteration as a weight for the displacement
 * vector. It's only input is the number of iterations from which the weight
 * is calculated.
 */
type Cooling = (interation: number) => number;


/**
 * Don't apply any cooling - leave the displacement vector as it is.
 * @param interation
 */
const defaultCooling: Cooling = (interation: number) => 1;


/**
 * Spring embedding according to 'Fruchtman & Reingold'
 */
export class FRSpringEmbedder {
    nodes: Array<Vector>;

    edges: Array<Edge>;

    /**
     * Cooling applied to the displacement vector
     */
    cooling: Cooling;

    idealSpringLength: number;

    constructor(
        nodes: Array<Vector> = [],
        edges: Array<Edge> = [],
        cooling: Cooling = defaultCooling,
        idealSpringLength: number = 1
    ) {
        this.nodes = nodes;
        this.edges = edges;
        this.cooling = cooling;
        this.idealSpringLength = idealSpringLength;
    }

    /**
     * Computes the embedding of the graph
     */
    public embedd(maxIterations: number, eps: number): void {
        // The positions of the nodes. The initial positons are choosen
        // randomly.
        console.log('Computing random positions');
        const positions = this._computeInitialPositions();
        // The forces moving the nodes
        const forces: Array<Vector> = [];
        let iteration = 1;
        while (iteration < maxIterations && this.normIsToHigh(forces, eps)) {
            console.log(`${iteration}. iteration,`)
            let index = 0;
            for (const position of positions) {
                const repulsiveForce = this._computeRepulsiveForce(position, positions);
                const attractiveForce = this._computeAttractiveForce(position, this.edges);
                repulsiveForce.add(attractiveForce);
                forces[index] = repulsiveForce;
                index++;
            }

            index = 0;
            for (const position of positions) {
                // Apply the cooling to the displacement vector
                const force = forces[index];
                const coolingFactor = this.cooling(iteration);
                force.applyScalar(coolingFactor);
                // Apply the displacement vector to the position
                position.add(force);
                index++;
            }
            iteration++;
        }
        console.log(`Computed embedding after ${iteration} iterations`);
    }

    /**
     * Catches the case in which the given array of forces is empty. In that
     * case true is returned.
     */
    private normIsToHigh(forces: Array<Vector>, eps: number): boolean {
        return (forces.length === 0)
            ? true
            : this._getMaxNorm(forces) > eps;
    }

    /**
     * Computes the repulsive force between the two given points.
     */
    private _computeSingleRepulsiveForce(point1: Vector, point2: Vector): Vector {
        // If both points are the same we would face some computation erros
        // and the result would be NaN. To avoid this we need to catch this
        // case before.
        if (point1.equals(point2)) {
            return new Vector(0, 0);
        }
        const repulsiveVector = Vector.byPoints(point1, point2);
        repulsiveVector.normalize();
        const scalar = Math.pow(this.idealSpringLength, 2) / (
            Math.sqrt(
                Math.pow(point2.x - point1.x, 2) +
                Math.pow(point2.y - point1.y, 2)
            )
        )
        repulsiveVector.applyScalar(scalar);
        return repulsiveVector;
    }

    /**
     * Computes the repulsive force for the given node
     */
    private _computeRepulsiveForce(point: Vector, positions: Vector[]): Vector {
        const repulsiveForce = new Vector(0, 0);
        const pointsToUse = positions.filter(p => !p.equals(point));
        for (const position of pointsToUse) {
            const force = this._computeSingleRepulsiveForce(point, position);
            repulsiveForce.add(force);
        }
        return repulsiveForce;
    }

    /**
     * Computes the attractive force, given by the edge.
     */
    private _computeSingleAttractiveForce(point1: Vector, point2: Vector): Vector {
        const attractiveVector = Vector.byPoints(point1, point2);
        const scalar = Math.pow(attractiveVector.norm(), 2) / this.idealSpringLength;
        attractiveVector.applyScalar(scalar);
        return attractiveVector;
    }

    private _computeAttractiveForce(point: Vector, edges: Edge[]): Vector {
        const attractiveForce = new Vector(0, 0);
        const edgesToUse = edges.filter(e => e.from.equals(point));
        for (const edge of edgesToUse) {
            const force = this._computeSingleAttractiveForce(edge.from, edge.to);
            attractiveForce.add(force);
        }
        return attractiveForce;
    }

    /**
     * Returns the maximal norm from an array of vectors
     */
    private _getMaxNorm(array: Array<Vector>): number {
        if (array.length <= 0) {
            throw new Error('Array must not be empty');
        }
        // Find the maximal norm on array.
        const norms = array.map(vector => vector.norm());
        return Math.max(...norms);
    }

    /**
     * Computes the initial positions of the embedding. The positions
     * are set randomly.
     */
    private _computeInitialPositions(): Array<Vector> {
        // Create a random position for each node in the graph.
        const positions: Array<Vector> = [];
        for (const node of this.nodes) {
            positions.push(Vector.random());
        }
        console.log(`Computed ${positions.length} random positions`)
        return positions;
    }
}
