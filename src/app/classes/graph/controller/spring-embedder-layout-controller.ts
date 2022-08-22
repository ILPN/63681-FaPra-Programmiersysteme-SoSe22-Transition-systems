import {FRSpringEmbedder1} from "../../spring_embedder/frspring-embedder1";
import {LayoutController} from "./layout-controller";

//TODO replaced by SpringEmbedderControllerService -> remove this class?
export class SpringEmbedderLayoutController implements LayoutController {

    private springEmbedderLayout: FRSpringEmbedder1;

    constructor(springEmbedderLayout: FRSpringEmbedder1) {
        this.springEmbedderLayout = springEmbedderLayout;
    }

    public drawInitialGraph(): void {
        this.springEmbedderLayout.initPositions();
        this.springEmbedderLayout.setInitLayoutProperties();
        this.springEmbedderLayout.layoutGraph();
        this.springEmbedderLayout.setNodeMoveLayoutProperties();
    }

    public moveNode(nodeId: string): void {
        this.springEmbedderLayout.layoutGraph(nodeId);
    }

    public redrawGraph(): void {
        this.springEmbedderLayout.setInitLayoutProperties();
        this.springEmbedderLayout.layoutGraph();
        this.springEmbedderLayout.setNodeMoveLayoutProperties();
    }
}
