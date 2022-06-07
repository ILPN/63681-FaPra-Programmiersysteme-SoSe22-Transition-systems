import {Point} from './point'
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


export class BaseSpringEmbedder {
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
        console.log('Computing random positions');
        const positions = this.computeInitialPositions();
        // The forces moving the nodes
        const forces: Vector[] = [];

        let iteration = 1;
        while (iteration < maxIterations && this.normIsToHigh(forces, eps)) {
            console.log(`${iteration}. iteration,`)
            //this.printForces(forces);
            let index = 0;
            for (const position of positions) {
                let force = new Vector(0, 0);
                for (const p of positions) {
                    if (position.equals(p)) {
                        // Skip the case that both points are the same.
                        forces[index] = force;
                        index++;
                    }
                    else {
                        // Compute the repuslive forces
                        let repulsiveForce = this.computeRepulsiveForce(position, p);
                        console.log(`repulsiveForce: x: ${repulsiveForce.x}, y: ${repulsiveForce.y}`);
                        force.add(repulsiveForce);
                        // Compute the attractive forces
                        let attractiveForce = this.computeAttractiveForce(position, p);
                        force.add(attractiveForce);
                        // Keep the force for later use
                        forces[index] = force;
                        index++;
                    }
                }
            }
            // TODO: This part needs to loop over the edges, not the nodes.
            //       How to get all nodes here, that needs to be fetched.
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
        console.log(`Computed embedding after ${iteration} iterations`);
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
    private computeRepulsiveForce(point1: Point, point2: Point): Vector {
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
     * Computes the attractive force, given by the edge.
     */
    private computeAttractiveForce(point1: Point, point2: Point): Vector {
        const attractiveVector = Vector.byPoints(point1, point2);
        const scalar = Math.pow(attractiveVector.norm(), 2) / this.idealSpringLength;
        attractiveVector.applyScalar(scalar);
        return attractiveVector;
    }

    /**
     * Returns the maximal norm from an array of vectors
     */
    getMaxNorm(array: Array<Vector>): number {
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
    computeInitialPositions(): Array<Point> {
        // Create a random position for each node in the graph.
        const positions: Array<Point> = [];
        for (const node of this.nodes) {
            positions.push(Point.random());
        }
        console.log(`Computed ${positions.length} random positions`)
        return positions;
    }

    /**
     * Delete me after debugging
    */
    printForces(forces: Array<Vector>): void {
        console.log(`Printing ${forces.length} forces`)
        for (const vec of forces) {
            console.log(`vector: x: ${vec.x}, y: ${vec.y}`)
        }
    }
}


/**
 * Spring embedding according to 'Fruchtman & Reingold'
 */
class FRSpringEmbedder extends BaseSpringEmbedder {

}
