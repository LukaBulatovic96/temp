import { GraphicalObject } from "../../graphicalFrameEngine/object"

export class GameObject extends GraphicalObject{
    constructor({graphicalObject: graphicalObject, gameProperty: gameProperty}){
        super(graphicalObject)
        this.gameProperty=gameProperty;
    }
}