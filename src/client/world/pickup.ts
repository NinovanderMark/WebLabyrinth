import { Sprite } from "./sprite"
import { Player } from "../player"
import { Item } from "../item";

export class Pickup extends Sprite {
    public name: string;

    constructor(sprite: number, name: string) {
        super(sprite);
        this.name = name;
    }

    public override collidable(): boolean {
        return false;
    }

    public onPickup(player: Player) {
        const existing = player.items.findIndex(i => i.name === this.name);
        if ( existing >= 0)  {
            player.items[existing].amount++;
            return;
        }

        player.items.push(new Item(this.name, this.texture));
        return;
    }
}