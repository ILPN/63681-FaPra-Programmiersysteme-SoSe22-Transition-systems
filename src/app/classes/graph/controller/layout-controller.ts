export interface LayoutController {

    drawInitialGraph(): void;

    moveNode(nodeId: string): void;

    redrawGraph(): void;
}
