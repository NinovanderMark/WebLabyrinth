import { GameEventHandler } from "./game-event-handler";

export abstract class GameEvent {
    public abstract handle(handler: GameEventHandler);
}