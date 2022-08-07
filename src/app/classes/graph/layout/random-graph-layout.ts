import {TsModel} from "../../diagram/tsmodel";
import {RandomGraphCalculator} from "../random-graph-calculator";

export class RandomGraphLayout {

    private randomGraphCalculator: RandomGraphCalculator = new RandomGraphCalculator;

    private graph: TsModel;

    constructor(graph: TsModel) {
        this.graph = graph;
    }

    public layoutGraph() {
        this.randomGraphCalculator.calculateAndSetPositions(this.graph);
        //TODO Graph zeichnen
    }
}
