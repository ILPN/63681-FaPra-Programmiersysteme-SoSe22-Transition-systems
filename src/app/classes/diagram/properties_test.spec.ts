import {TsModel} from "./tsmodel";
import {TsNode} from "./tsnode";
import {TsEdge} from "./tsedge";
import {expect} from "@angular/flex-layout/_private-utils/testing";
import {ParserService} from "../../services/parser.service";
import {TsTransition} from "./tsTransition";

describe('Test of getGraphProperties function with an example model',
    () => {
        // create example model
        //need to be fixed
        let myModel = new TsModel();
        let node1 = new TsNode('n1', 'node1');
        let node2 = new TsNode('n2', 'node2');
        let node3 = new TsNode('n3', 'node3');
        let node4 = new TsNode('n4', 'node4');
        let node5 = new TsNode('n5','node5');
        let edge1 = new TsEdge(Array(new TsTransition('edge1')), node1, node2);
        let edge2 = new TsEdge(Array(new TsTransition('edge2')), node2, node3);
        let edge3 = new TsEdge(Array(new TsTransition('edge3')), node3, node4);
        let edge4 = new TsEdge(Array(new TsTransition('edge4')), node3, node5);
        let edge5 = new TsEdge(Array(new TsTransition('edge5')), node4, node2);
        myModel.addNode(node1);
        myModel.addNode(node2);
        myModel.addNode(node3);
        myModel.addNode(node4);
        myModel.addNode(node5);
        myModel.addEdge(edge1);
        myModel.addEdge(edge2);
        myModel.addEdge(edge3);
        myModel.addEdge(edge4);
        myModel.addEdge(edge5);
        myModel.startNode = node1;

        // get properties of example model
        let myProperties = myModel.getGraphProperties();

        it('model contains cycles', function () {
            expect(myProperties.acyclic).toBe(false)
        });

        it('model has deadlocks', function () {
            expect(myProperties.freeOfDeadlocks).toBe(false)
        });

        it('models is not alive', function () {
            expect(myProperties.alive).toBe(false)
        });
        it('Test Death Cicle', () => {
            let file = `.type ts
.nodes
n1 n1
n2 n2
n3 n3
n4 n4
n5 n5
n6 n6
.edges
n1 n2 A
n2 n3 B
n2 n5 C
n3 n4 X
n4 n3 Y
n5 n6 X
n6 n5 Y
`;
            let model = new ParserService().parse(file,true);
            let properties = model.getGraphProperties();
            let edgeX = model.getEdges('X');
            let edgeY = model.getEdges('Y');
            expect(properties.cycleElements).toContain(edgeX[0]);
            expect(properties.cycleElements).toContain(edgeY[0]);
            expect(properties.cycleElements).toContain(edgeX[1]);
            expect(properties.cycleElements).toContain(edgeY[1]);
            expect(properties.mortalTransitions).not.toContain('X');
            expect(properties.mortalTransitions).not.toContain('Y');

        });

    })
