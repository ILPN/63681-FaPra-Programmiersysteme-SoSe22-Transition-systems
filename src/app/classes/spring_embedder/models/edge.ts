import {Vector} from './vector';

export class Edge {
    from: Vector;
    to: Vector;

    constructor(from: Vector, to: Vector) {
        this.from = from;
        this.to = to;
    }

}
