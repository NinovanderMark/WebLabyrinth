import { GameObject } from "./game-object";
import { DynamicObject } from "./dynamic-object";
import { Interactable } from "./interactable";
import { Game } from "../game";
import { ItemRequiredEvent } from "../events/item-required-event";
import { ItemConsumedEvent } from "../events/item-consumed-event"

export class Door extends GameObject implements DynamicObject, Interactable {
    public closed: boolean;
    public openAmount: number;
    public block: boolean;
    public openTime: number;
    public key: string | null;
    public secret: boolean;
    public unlockTexture: number;

    constructor(texture: number, block: boolean = false, secret: boolean = false, key: string | null = null, unlockTexture: number | null = null) {
        super(texture);
        this.closed = true;
        this.openAmount = 0;
        this.openTime = 0;
        this.block = block;
        this.key = key;
        this.secret = secret;
        this.unlockTexture = unlockTexture ?? texture;
    }

    public override collidable(): boolean {
        return this.openAmount !== 1;
    }

    public unlock() {
        this.key = null;
        this.texture = this.unlockTexture;
    }

    public interact(game: Game) {
        if ( this.key != null) {
            const key = this.key;
            const keyIndex = game.player.items.findIndex(i => i.name === this.key && i.amount > 0);
            if ( keyIndex < 0) {
                game.addEvent(new ItemRequiredEvent(key));
                return; // Nothing happens, door is locked
            }

            game.player.items[keyIndex].amount -= 1;
            this.unlock();
            game.addEvent(new ItemConsumedEvent(key));
            return;
        }

        if ( this.closed && this.openAmount === 0 ) {
            this.closed = false;
            this.openTime = 0;
            
            if ( this.secret === true) {
                game.player.secretsFound++;
                this.secret = false;
            }
        } else if ( !this.closed && this.openAmount === 1) {
            this.closed = true;
        }
    }

    public step(delta: number) {
        const amount = this.block ? delta * 0.2 : delta;
        if ( this.closed && this.openAmount > 0) { 
            this.openAmount -= amount; 
        }
        if ( !this.closed && this.openAmount < 1) { 
            console.debug('Opening', amount);
            this.openAmount += amount; 
        }

        if ( this.openAmount > 1) { this.openAmount = 1; }
        if ( this.openAmount < 0) { this.openAmount = 0; }

        // Automatically start closing the door if it's open for a few seconds
        if ( !this.block) {
            if ( this.openAmount === 1) { this.openTime += delta; }
            if ( this.openTime > 5) { this.closed = true; }
        }
    }
}