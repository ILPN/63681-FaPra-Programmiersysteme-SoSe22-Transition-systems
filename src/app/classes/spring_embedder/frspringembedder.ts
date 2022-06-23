import {Vector} from './models/vector';
import {TsNode} from '../diagram/tsnode';
import {TsEdge} from '../diagram/tsedge';

/**
 * The colling is applied after each iteration as a weight for the displacement
 * vector. It's only input is the number of iterations from which the weight
 * is calculated.
 */
type Cooling = (interation: number) => number;


/**
 * Don't apply any cooling - leave the displacement vector as it is.
 * @param iteration
 */
const defaultCooling: Cooling = (iteration: number) => 50 + iteration;


/**
 * Spring embedding according to 'Fruchtman & Reingold'
 */
export class FRSpringEmbedder {
    nodes: Array<TsNode>;
    edges: Array<TsEdge>;

    /**
     * Cooling applied to the displacement vector
     */
    cooling: Cooling;

    idealSpringLength: number;

    constructor(
        nodes: Array<TsNode> = [],
        edges: Array<TsEdge> = [],
        cooling: Cooling = defaultCooling,
        idealSpringLength: number = 130
    ) {
        this.nodes = nodes;
        this.edges = edges;
        this.cooling = cooling;
        this.idealSpringLength = idealSpringLength;
    }

    /**
     * Computes the embedding of the graph
     */
    public run(maxIterations: number = 100000, epsilon: number = 10): void {
        // The positions of the nodes. The initial positons are choosen
        // randomly.
        //empty nodes-> no sense
        if (! (this.nodes.length > 0) ) {
            return
        }
        console.log('Computing random positions');
        this._computeInitialPositions();
        // The forces moving the nodes
        const forces: Array<Vector> = [];
        let iteration = 1;
        while (iteration < maxIterations && (this.normIsToHigh(forces, epsilon) || !this.distancesOk())) {
            console.log(`${iteration}. iteration, Max Norm Of Forces: ${this._getMaxNorm(forces)}`)
            let index = 0;
            for (const node of this.nodes) {
                const repulsiveForce = this._computeRepulsiveForce(node);
                const attractiveForce = this._computeAttractiveForce(node);
                repulsiveForce.add(attractiveForce);
                forces[index] = repulsiveForce;
                index++;
            }

            index = 0;
            for (const node of this.nodes) {
                // Apply the cooling to the displacement vector
                const force = forces[index];
                const coolingFactor = this.cooling(iteration);
                force.devideBy(coolingFactor);
                // Apply the displacement vector to the position
                node.position.add(force);
                node.position.limitToScreen();
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
    private normIsToHigh(forces: Array<Vector>, epsilon: number): boolean {
        return (forces.length === 0)
            ? true
            : this._getMaxNorm(forces) > epsilon;
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
        const scalar = Math.pow(this.idealSpringLength, 2) / repulsiveVector.norm();
        repulsiveVector.normalize();
        repulsiveVector.multiplyWith(scalar);
        return repulsiveVector;
    }

    /**
     * Computes the repulsive force for the given node
     */
    private _computeRepulsiveForce(node: TsNode): Vector {
        const repulsiveForce = new Vector(0, 0);
        const currentPosition = node.position;
        const pointsToUse = this.nodes
            .map(n => n.position)
            .filter(p => !p.equals(currentPosition));
        for (const position of pointsToUse) {
            const force = this._computeSingleRepulsiveForce(currentPosition, position);
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
        attractiveVector.normalize();
        attractiveVector.multiplyWith(scalar);
        return attractiveVector;
    }

    private _computeAttractiveForce(node: TsNode): Vector {
        const currentPosition = node.position;
        const attractiveForce = new Vector(0, 0);
        const edgesToUse = this.edges.filter(e => e.position_from.equals(currentPosition));
        for (const edge of edgesToUse) {
            const force = this._computeSingleAttractiveForce(edge.position_from, edge.position_to);
            attractiveForce.add(force);
        }
        return attractiveForce;
    }

    /**
     * Returns the maximal norm from an array of vectors
     */
    private _getMaxNorm(array: Array<Vector>): number {
        if (array.length <= 0) {
            return 0;
        }
        // Find the maximal norm on array.
        const norms = array.map(vector => vector.norm());
        return Math.max(...norms);
    }

    /**
     * Computes the initial positions of the embedding. The positions
     * are set randomly.
     */
    private _computeInitialPositions(): void {
        // Create a random position for each node in the graph.
        for (const node of this.nodes) {
            node.position = Vector.atRandomPosition();
        }
        console.log(`Computed ${this.nodes.length} random positions`)
    }

    private distancesOk() {
        for (let node1 of this.nodes) {
            for (let node2 of this.nodes) {
                if (!(node1 === node2 ||
                    Vector.byPoints(node1.position, node2.position).norm() > node1.circleRadius() * 2)) {
                    return false;
                }
            }
        }
        return true;
    }
}
