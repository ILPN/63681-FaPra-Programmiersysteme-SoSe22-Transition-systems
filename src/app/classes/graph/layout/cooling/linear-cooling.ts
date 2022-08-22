import {Cooling} from "./cooling";

/**
 *  "the temperature could start at an initial value (say one tenth the width of the frame) and decay to 0
 *  in an inverse linear fashion.”
 * @param iteration The number of iteration. Pass number 1 for the first iteration.
 * @private
 */
export class LinearCooling implements Cooling {

    private _startValue: number;

    private _slope: number;

    private _overallNumberOfIterations: number;

    constructor(startValue: number, overallNumberOfIterations: number) {
        this._startValue = startValue;
        this._slope = -startValue / overallNumberOfIterations;
        this._overallNumberOfIterations = overallNumberOfIterations;
    }

    /**
     * @param iteration The number of iteration. Pass number 1 for the first iteration.
     */
    cool(iteration: number): number {
        return this._startValue + this._slope * iteration;
    }

    set startValue(startValue: number) {
        this._startValue = startValue;
        this._slope = -startValue / (this._overallNumberOfIterations);
    }

    set overallNumberOfIterations(overallNumberOfIterations: number) {
        this._overallNumberOfIterations = overallNumberOfIterations;
        this._slope = -this._startValue / overallNumberOfIterations;
    }
}
