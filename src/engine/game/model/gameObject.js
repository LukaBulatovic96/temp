import { PhysicalObject } from "../../physics/model/physicalObject"

export class GameObject extends PhysicalObject{
    constructor({gameProperties: gameProperties, physics: physicsProperties}){
        super(physicsProperties)
        this.gameProperties=gameProperties;
    }
}