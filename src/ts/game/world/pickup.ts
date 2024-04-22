import { Sprite } from "./sprite"
import { Player } from "../player"
import { Item } from "../item";

export class Pickup extends Sprite {
    public name: string;
    public amount: number;

    constructor(sprite: number, name: string, amount: number = 1, scale: number = 1) {
        super(sprite, scale);
        this.amount = amount;
        this.name = name;
    }

    public override collidable(): boolean {
        return false;
    }

    public onPickup(player: Player) {
        if ( this.name === 'score') {
            player.score += this.amount;
            player.scoreItemsFound++;
            return;
        }

        const existing = player.items.findIndex(i => i.name === this.name);
        if ( existing >= 0)  {
            player.items[existing].amount+=this.amount;
            return;
        }

        player.items.push(new Item(this.name, this.texture, this.amount));
        return;
    }
}
