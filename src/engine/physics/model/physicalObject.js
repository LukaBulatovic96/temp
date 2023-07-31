import { GraphicalObject } from "../../graphicalFrame/model/object"

export class PhysicalObject extends GraphicalObject{
    constructor({graphicalObject: graphicalObject, physicalProperty: physicalProperty}){
        super(graphicalObject)
        this.physicalProperty=physicalProperty;
    }
}