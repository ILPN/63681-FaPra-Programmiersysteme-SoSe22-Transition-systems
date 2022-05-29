import {Node, Point, Graph} from './models'
import {Vector} from './vector'

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


class BaseSpringEmbedder {
    nodes: Point[];

    edges: Vector[];

    /**
     * Cooling applied to the displacement vector
     */
    cooling: Cooling;

    idealSpringLength: number;

    constructor(
        nodes: Point[],
        edges: Vector[],
        cooling: Cooling = defaultCooling,
        idealSpringLength: number = 1
    ) {
        this.nodes = nodes;
        this.edges = edges;
        this.cooling = cooling;
        this.idealSpringLength = idealSpringLength;
    }

    /**
     * Main method to start the Spring embedding.
     * @param maxIterations
     * @param eps
     */
    run(maxIterations: number, eps: number): void {
        console.group('Starting Spring embedding')
        try{
            this.embedd(maxIterations, eps);
        }
        catch(error) {
            // In JavaScript almost anything can be thrown and TypeScript can
            // not predict the type. Hence, we need to support the type system.
            const errorMessage = (error instanceof Error)
                ? error.message
                : 'Unknown error'
            console.warn('Spring embedding failed with following error:');
            console.warn(errorMessage);
        }
        finally {
            console.groupEnd();
        }

    }

    /**
     * Computes the embedding of the graph
     */
    private embedd(maxIterations: number, eps: number): void {
        // The positions of the nodes. The initial positons are choosen
        // randomly.
        const positions = this.computeInitialPositions();
        // The forces moving the nodes
        const forces: Vector[] = [];

        let iteration = 1;
        while (iteration < maxIterations && this.normIsToHigh(forces, eps)) {
            let index = 0;
            for (const position of positions) {
                // Compute the repuslive forces

                // Compute the attractive forces
            }

            // Move the positions by the displaxement vectors.
            index = 0;
            for (const position of positions) {
                // Apply the cooling to the displacement vector
                const force = forces[index];
                const coolingFactor = this.cooling(iteration);
                force.applyScalar(coolingFactor);
                // Apply the displacement vector to the position
                position.moveBy(force);
                index++;
            }
            iteration++;
        }

    }

    /**
     * Catches the case in which the given array of forces is empty. In that
     * case true is returned.
     */
    private normIsToHigh(forces: Array<Vector>, eps: number): boolean {
        return (forces.length === 0)
            ? true
            : this.getMaxNorm(forces) > eps;
    }

    /**
     * Computes the repulsive force between the two given points.
     */
    private computeRepulsiveForce(node1: Point, node2: Point): Vector {
        const repulsiveVector = Vector.byNodes(node1, node2);
        repulsiveVector.normalize();
        const scalar = Math.pow(this.idealSpringLength, 2) / (
            Math.sqrt(
                Math.pow(node2.x - node1.x, 2) +
                Math.pow(node2.y - node1.y, 2)
            )
        )
        repulsiveVector.applyScalar(scalar);
        return repulsiveVector;
    }

    /**
     * Computes the attractive force, given by the edge.
     */
    private computeAttractiveForce(): Vector {

    }

    /**
     * Returns the maximal norm from an array of vectors
     */
    getMaxNorm(array: Array<Vector>): number {
        if (array.length == 0) {
            return -1;
        }
        return 0;
    }

    /**
     * Computes the initial positions of the embedding. The positions
     * are set randomly.
     */
    computeInitialPositions(): Array<Point> {
        // Create a random position for each node in the graph.
        const positions: Array<Point> = [];
        for (const node of this.nodes) {
            positions.push(Point.random());
        }
        return positions;
    }

}


/**
 * Spring embedding according to 'Fruchtman & Reingold'
 */
class FRSpringEmbedder extends BaseSpringEmbedder {

}
