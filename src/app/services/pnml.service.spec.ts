import { TestBed } from '@angular/core/testing';

import { PNMLService} from './pnml.service';
import { TsModel } from '../classes/diagram/tsmodel';

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
        model = new TsModel();
    });

    it('Should return correct type', () => {
        const model = service.import(pnml_str);
        expect(model).toBeInstanceOf(TsModel);
    });
});

