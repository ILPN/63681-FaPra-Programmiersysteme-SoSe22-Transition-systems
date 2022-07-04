import { Injectable } from '@angular/core';
import {TsModel} from "../classes/diagram/tsmodel";

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() {}

    exportTS(model: TsModel): string{
      //TODO use stream instead of string
      let result = '';
      result += '.type ts\n';
        result +='.nodes\n';
        for (let node of model.nodes){
            result = node.writeOn(result);
        }
        result +='.edges\n';
        for (let edge of model.edges ){
            result = edge.writeOn(result);
        }
      return result;
    }
}
