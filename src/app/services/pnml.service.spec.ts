import { TestBed } from '@angular/core/testing';

import { PNMLService} from './pnml.service';
import { TsModel } from '../classes/diagram/tsmodel';
import { Vector } from '../classes/diagram/vector/vector';

const PNML_STR = `
<?xml version="1.0" encoding="UTF-8"?>
<pnml>
    <net>
        <place id="p1">
            <name>
                <text>Start</text>
            </name>
            <initialMarking>
                <text>1</text>
            </initialMarking>
            <graphics>
                <position x="200" y="150"/>
            </graphics>
        </place>
        <place id="p2">
            <name>
                <text>Ziel</text>
            </name>
            <initialMarking>
                <text>0</text>
            </initialMarking>
            <graphics>
                <position x="400" y="150"/>
            </graphics>
        </place>
        <transition id="t1">
            <name>
                <text>Aktion</text>
            </name>
            <graphics>
                <position x="300" y="150"/>
            </graphics>
        </transition>
        <arc id="a1" source="p1" target="t1"/>
        <arc id="a2" source="t1" target="p2"/>
    </net>
</pnml>
`

/**
 * PNML string --> TsModel
 */
describe('PNMLService-Import', () => {
    let service: PNMLService;

    let model: TsModel;

    let pnml_str: string;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PNMLService);
        // The PNML representation of the transitition system
        pnml_str = PNML_STR;
        // The TsModel representatipon of the transitition system
        model = service.import(pnml_str);
    });

    it('Should return correct type', () => {
        expect(model).toBeInstanceOf(TsModel);
    });

    it('All edges are parsed', () => {
        const numOfEdges = model.edges.length;
        expect(numOfEdges).toEqual(1);
    });

    it('All nodes are parsed', () => {
        const numOfNodes = model.nodes.length;
        expect(numOfNodes).toEqual(2);
    });

    it('edges have correct transitions labels', () => {
        const edge = model.edges[0];
        const labels = edge.getTransitionLabels();
        expect(labels).toEqual(['Aktion']);
    });

    it('nodes have correct transitions', () => {
        const paredLabels = model.nodes.map(node => node.label);
        expect(paredLabels).toEqual(['Start', 'Ziel']);
    });

    it('Node-IDs are parsed corretly', () => {
        const nodeIDs = model.nodes.map(node => node.id);
        expect(nodeIDs).toEqual(['p1', 'p2']);
    });

    it('Positions arr parsed correctly', () => {
        const parsedPositions = model.nodes.map(node => node.position);
        const expectedPositions = [
            new Vector(200, 150),
            new Vector(400, 150)
        ];
        expect(parsedPositions).toEqual(expectedPositions);
    });
});
