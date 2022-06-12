import {TsModel} from "./tsmodel";
import {TsNode} from "./tsnode";
import {TsEdge} from "./tsedge";
import {expect} from "@angular/flex-layout/_private-utils/testing";

describe('test of getGraphPropertiesFunction with an example model',
    () => {
        // create example model
        let myModel = new TsModel();
        let node1 = new TsNode('n1', 'node1');
        let node2 = new TsNode('n2', 'node2');
        let node3 = new TsNode('n3', 'node3');
        let node4 = new TsNode('n4', 'node4');
        let edge1 = new TsEdge('e1', 'edge1', 1, node1, node2);
        let edge2 = new TsEdge('e2', 'edge2', 1, node2, node3);
        let edge3 = new TsEdge('e3', 'edge3', 1, node3, node1);
        let edge4 = new TsEdge('e4', 'edge4', 1, node3, node4);
        myModel.addNode(node1);
        myModel.addNode(node2);
        myModel.addNode(node3);
        myModel.addNode(node4);
        myModel.addEdge(edge1);
        myModel.addEdge(edge2);
        myModel.addEdge(edge3);
        myModel.addEdge(edge4);

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


    })
