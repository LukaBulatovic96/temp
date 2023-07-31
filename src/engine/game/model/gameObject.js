import { PhysicalObject } from "../../physics/model/physicalObject"

export class gameObject extends PhysicalObject{
    constructor({gameProperties: game, physics: physicsProperties}){
        super(physicsProperties)
        this.gameProperties=gameProperties;
    }
}