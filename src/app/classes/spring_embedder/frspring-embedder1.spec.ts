import {FRSpringEmbedder1} from './frspring-embedder1';
import {TsModel} from "../diagram/tsmodel";

describe('FRSpringEmbedder1', () => {
    let model: TsModel;
    it('should create an instance', () => {
        expect(new FRSpringEmbedder1(model)).toBeTruthy();
    });
});
