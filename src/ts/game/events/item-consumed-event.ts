import { GameEvent } from "./game-event"
import { GameEventHandler } from "./game-event-handler";

export class ItemConsumedEvent extends GameEvent {
    public item: string;

    constructor(itemName: string) {
        super();
        this.item = itemName;
    }
    
    public handle(handler: GameEventHandler) {
        const sprite = handler.game.world.items.get(this.item).texture;
        handler.guiManager.addDialog('Item consumed', sprite, handler.game.world);
    }
}