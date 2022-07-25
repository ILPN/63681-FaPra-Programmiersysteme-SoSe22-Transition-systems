import {Vector} from './models/vector';
import {TsNode} from '../diagram/tsnode';
import {TsEdge} from '../diagram/tsedge';
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
     * Weight applied to each repulsive force that is computed. A value < 1
     * would lead to a dumping of the force and a value > 1 would boost it.
     */
    private _replusiveForceWeigth: number = 1.0 / 5.0;

    /**
     * Weight applied to each attractive force that is computed. A value < 1
     * would lead to a dumping of the force and a value > 1 would boost it.
     */
    private _attractiveForceWeigth: number = 5.0;

    constructor(
        model: TsModel,
        cooling: Cooling = (iteration) => 1.0 / (100 * iteration),
        idealSpringLength: number = 200,
        fromRandomPositions: Boolean = true
    ) {
        this._model = model,
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
        if (this._model.nodes.length <= 0) {
            return
        }
        if (this._fromRandomPositions)
            console.log('Using random start positions')
            this.initializeRandomPositions();
        // The forces moving the nodes
        this._forces = [];
        let iteration = 1;
        //while (iteration < maxIterations && (this.normIsToHigh(forces, epsilon) || !this.distancesOk())) {
        while (iteration < maxIterations && this.normIsToHigh(epsilon) ) {
            this.computeForces();
            const coolingFactor = this._cooling(iteration);
            this.moveNodesByForces(coolingFactor);
            iteration++;
        }
        (iteration < maxIterations)
            ? console.log(`Computed embedding after ${iteration} iterations`)
            : console.log(`Max number of iterations reached: ${maxIterations}`);
    }

    /**
     * Computes the repulsive and attractive forces for each node.
     */
    public computeForces(): void {
        let index = 0;
        for (const node of this._model.nodes) {
            let repulsiveForce = this.computeRepulsiveForce(node);
            repulsiveForce.multiplyWith(this._replusiveForceWeigth);
            const attractiveForce = this._computeAttractiveForce(node);
            attractiveForce.multiplyWith(this._attractiveForceWeigth)
            repulsiveForce = repulsiveForce.add(attractiveForce);
            this._forces[index] = repulsiveForce;
            index++;
        }
    }

    /**
     * Moves all nodes by the given forces. The given cooling is applied before
     * the force is applied.
     */
    public moveNodesByForces(coolingFactor: number): void {
        let index = 0;
        for (const node of this._model.nodes) {
            // Apply the cooling to the displacement vector
            const force = this._forces[index];
            console.log(`coolingFactor: ${coolingFactor}`)
            force.multiplyWith(coolingFactor);
            // Apply the displacement vector to the position
            node.position = node.position.add(force);
            node.limitPostionToScreen();
            index++;
        }
    }

    /**
     * Catches the case in which the given array of forces is empty. In that
     * case true is returned.
     */
    public normIsToHigh(epsilon: number): boolean {
        if (this._forces.length === 0) {
            return true;
        }
        const maxNorm = Vector.getMaxNorm(this._forces);
        console.log(`Max norm of forces: ${maxNorm}`);
        return maxNorm > epsilon;
    }

    /**
     * Computes the repulsive force between the two given points.
     */
    public computeSingleRepulsiveForce(point1: Vector, point2: Vector): Vector {
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
    public computeRepulsiveForce(node: TsNode): Vector {
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
    public computeSingleAttractiveForce(point1: Vector, point2: Vector): Vector {
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
            const force = this.computeSingleAttractiveForce(edge.position_from, edge.position_to);
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
}
