import {TsModel} from "../../diagram/tsmodel";
import {RandomGraphCalculator} from "../random-graph-calculator";

export class RandomGraphLayout {

    private randomGraphCalculator: RandomGraphCalculator = new RandomGraphCalculator;

    private readonly graph: TsModel;

    constructor(graph: TsModel) {
        this.graph = graph;
    }

    public layoutGraph() {
        this.randomGraphCalculator.calculateAndSetPositions(this.graph);
        // Graph zeichnen
        this.graph.updateSVG();
    }
}
