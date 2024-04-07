import { GameEvent } from "./game-event";

export class GameEventHandler {
    public handle(event: GameEvent) {
        event.handle(this);
    }
}