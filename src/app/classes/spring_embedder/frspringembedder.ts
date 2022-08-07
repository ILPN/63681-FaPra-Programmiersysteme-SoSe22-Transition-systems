import {Vector} from './models/vector';
import {TsNode} from '../diagram/tsnode';
import { TsModel } from '../diagram/tsmodel';

/**
 * The colling is applied after each iteration as a weight for the displacement
 * vector. It's only input is the number of iterations from which the weight
 * is calculated.
 */
type Cooling = (interation: number) => number;


/**
 * Spring embedding according to 'Fruchtman & Reingold'
 */
export class FRSpringEmbedder {

    /**
     * The transition system to use
     */
    private _model: TsModel;

    /**
     * Cooling applied to the displacement vector
     */
    private _cooling: Cooling;

    /**
     * The length of the spring favored by the algorithm
     */
     private _idealSpringLength: number;

    /**
     * If set the initial positions of the nodes will be choosen randomly
    */
     private _fromRandomPositions: Boolean = true;

    /**
     * Forces applied to hte nodes after each iteration.
     */
    private _forces: Vector[] = [];

    /**
     * The minimal distance of two nodes to have. This is used to avaoid nodes
     * being too close together.
     */
    private readonly MIN_NODE_DISTANCE = 150;

    constructor(
        model: TsModel,
        cooling: Cooling = (iteration) => 1.0 / (100 * iteration),
        idealSpringLength: number = 200,
        fromRandomPositions: Boolean = true
    ) {
        this._model = model;
        this._cooling = cooling;
        this._idealSpringLength = idealSpringLength;
        this._fromRandomPositions = fromRandomPositions;
    }

    /**
     * Sets the cooling used by the algorithmn
     */
    set cooling(newCooling: Cooling) {
        this._cooling = newCooling;
    }

    /**
     * Sets a new value for the ideal length of the springs.
     */
     set springLength(newLenght: number){
        this._idealSpringLength = newLenght;
    }

    /**
     * If set the initial positions of the nodes will be choosen randomly
    */
    set fromRandomPositions(newFlag: Boolean) {
        this._fromRandomPositions = newFlag;
    }

    /**
     * Replaces the used model with the new one.
    */
    set model(newModel: TsModel) {
        this._model = newModel;
    }

    /**
     * Computes the embedding of the graph
     */
    public run(maxIterations: number = 1000, epsilon: number = 0.1): void {
        console.group('Starting SpringEmbedder')
        if (this._model.nodes.length <= 0) {
            console.log('No nodes found');
            return
        }
        if (this._fromRandomPositions) {
            console.log('Using random start positions')
            this.initializeRandomPositions();
        }
        this._forces = [];
        let iteration = 1;
        while (iteration < maxIterations && this.normIsToHigh(epsilon) ) {
            this.printNodePositions(iteration);
            this.computeForces();
            this.moveNodesByForces(iteration);
            iteration++;
        }
        (iteration < maxIterations)
            ? console.log(`Computed embedding after ${iteration} iterations`)
            : console.log(`Max number of iterations reached: ${maxIterations}`);
        console.groupEnd();
    }

    private computeCoolingFactor(node: TsNode, iteration: number): number {
        const minDistance = this.minDistanceToOtherNodes(node);
        if (minDistance <= this.MIN_NODE_DISTANCE) {
            return 1.0 / iteration;
        }
        return this._cooling(iteration);
    }

    /**
     * Computes the repulsive and attractive forces for each node.
     */
    private computeForces(): void {
        let index = 0;
        for (const node of this._model.nodes) {
            let repulsiveForce = this.computeRepulsiveForce(node);
            const attractiveForce = this._computeAttractiveForce(node);
            repulsiveForce = repulsiveForce.add(attractiveForce);
            this._forces[index] = repulsiveForce;
            index++;
        }
    }

    /**
     * Moves all nodes by the given forces. The given cooling is applied before
     * the force is applied.
     */
    private moveNodesByForces(iteration: number): void {
        let index = 0;
        for (const node of this._model.nodes) {
            // Apply the cooling to the displacement vector
            const force = this._forces[index];
            const coolingFactor = this.computeCoolingFactor(node, iteration);
            // Apply the displacement vector to the position
            force.multiplyWith(coolingFactor);
            node.position = node.position.add(force);
            node.limitPostionToScreen();
            index++;
        }
    }

    /**
     * Catches the case in which the given array of forces is empty. In that
     * case true is returned.
     */
    private normIsToHigh(epsilon: number): boolean {
        if (this._forces.length === 0) {
            return true;
        }
        const maxNorm = Vector.getMaxNorm(this._forces);
        console.log(`Num of forces: ${this._forces.length}, max norm: ${maxNorm}`);
        return maxNorm > epsilon;
    }

    /**
     * Computes the repulsive force between the two given points.
     */
    private computeSingleRepulsiveForce(point1: Vector, point2: Vector): Vector {
        // If both points are the same we would face some computation erros
        // and the result would be NaN. To avoid this we need to catch this
        // case before.
        if (point1.equals(point2)) {
            return new Vector(0, 0);
        }
        const repulsiveForce = Vector.byPoints(point1, point2);
        const scalar = Math.pow(this._idealSpringLength, 2) / repulsiveForce.norm();
        repulsiveForce.normalize();
        repulsiveForce.multiplyWith(scalar);
        return repulsiveForce.isNaN()
            ? new Vector(0, 0)
            : repulsiveForce;
    }

    /**
     * Computes the repulsive force for the given node.
     */
    private computeRepulsiveForce(node: TsNode): Vector {
        const currentPosition = node.position
        // The Algorithm of Fruchterman & Reingold uses all nodes to compute
        // the repulsive force. The set of all non-adjacent nodes is only taken
        // in the Algorithm from Eades.
        const positions = this._model.nodes
            .map(n => n.position)
            .filter(p => !p.equals(currentPosition));
        let repulsiveForce = new Vector(0, 0);
        for (const position of positions) {
            const force = this.computeSingleRepulsiveForce(currentPosition, position);
            repulsiveForce = repulsiveForce.add(force);
        }
        return repulsiveForce;
    }

    /**
     * Computes the attractive force, given by the edge.
     */
    private computeSingleAttractiveForce(point1: Vector, point2: Vector): Vector {
        let attractiveForce = Vector.byPoints(point2, point1);
        const scalar = Math.pow(attractiveForce.norm(), 2) / this._idealSpringLength;
        attractiveForce.normalize();
        attractiveForce = attractiveForce.multiplyWith(scalar);
        return attractiveForce.isNaN()
            ? new Vector(0, 0)
            : attractiveForce;
    }

    private _computeAttractiveForce(node: TsNode): Vector {
        let attractiveForce = new Vector(0, 0);
        // TODO: What is the correct set of nodes to use here?
        // TODO: Shall self.loops be skipped?
        // TODO: Email Jakub: What is the correct set of nodes to use here?
        const edgesToUse = node.getConnectedEdges()
            //.filter(e => !e.isSelfLoop())
            //.filter(e => e.nodeFrom.equals(node));
        for (const edge of edgesToUse) {
            const force = this.computeSingleAttractiveForce(edge.nodeFrom.position, edge.nodeTo.position);
            attractiveForce = attractiveForce.add(force);
        }
        return attractiveForce;
    }

    /**
     * Computes the initial positions of the embedding. The positions
     * are set randomly.
     */
    private initializeRandomPositions(): void {
        // Create a random position for each node in the graph.
        for (const node of this._model.nodes) {
            node.position = Vector.atRandomPosition();
        }
    }

    private printNodePositions(numOfInteration: number = -1): void {
        console.group(`Node positions at iteration ${numOfInteration}`)
        for (const node of this._model.nodes) {
            console.log(`Id: ${node.id}, x: ${node.x}, y: ${node.y}`)
            // Print info regarding the used forces
            if (this._forces.length > 0) {
                const force = this.getForceOfNode(node.id);
                console.log(`   force: x ${force.x}, y: ${force.y}`);
            }
            // Print forces about the minimal distance to the remaining nodes
            const minDistance = this.minDistanceToOtherNodes(node);
            console.log(`   min. distance: ${minDistance}`)
            console.log(' ');
        }
        console.groupEnd()
    }

    private getForceOfNode(nodeId: string): Vector {
        let index = 0;
        for (const node of this._model.nodes) {
            if (node.id === nodeId) {
                return this._forces[index];
            }
            index++;
        }
        throw Error(`Node ${nodeId} has no force`)
    }

    /**
     * Returns the smallest distance of the given node to the other onces.
     */
    private minDistanceToOtherNodes(node: TsNode): number {
        let minDistnace = Number.MAX_VALUE;
        const positonsToCheck = this._model.nodes
            .filter(n => n.id !== node.id)
            .map(node => node.position);
        for (const position of positonsToCheck) {
            const distance = position.distanceTo(node.position);
            if (distance <= minDistnace) {
                minDistnace = distance;
            }
        }
        return minDistnace;
    }
}
