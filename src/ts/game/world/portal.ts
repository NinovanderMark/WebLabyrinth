import { GameObject } from "./game-object";
import { Vector } from "../../base/vector";

export class Portal extends GameObject {
    public position: Vector;
    public targetPortal: Portal;
    public targetPosition: Vector;
    public targetDirection: Vector;

    constructor(position: Vector, direction: Vector) {
        super(0);
        this.position = position;
        this.targetDirection = direction;
    }

    public connect(portal: Portal) {
        this.targetPortal = portal;
        this.targetPosition = portal.position;
        this.targetPortal.targetPortal = this;
        this.targetPortal.targetPosition = this.position;
    }

    public override collidable(): boolean {
        return false;
    }
}