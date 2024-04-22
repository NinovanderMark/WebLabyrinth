import { Room } from "./level/room";
import { Input } from '../presentation/input';
import { Player } from './player';
import { Renderer } from '../presentation/rendering/renderer';
import { World } from './world/world';
import { Vector } from '../base/vector';
import { RayCast } from "./raycast";
import { Door } from './world/door';
import { Pickup } from "./world/pickup";
import { GameEventHandler } from "./events/game-event-handler";
import { GameEvent } from "./events/game-event";
import { GuiManager } from "../presentation/gui-manager";
import { Portal } from "./world/portal";
import { Level } from "./level/level";
import { Exit } from "./world/exit";
import { GameObject } from "./world/game-object";

export class Game {
    public world: World;

	player: Player;
	input: Input;
	renderer: Renderer;
	guiManager: GuiManager;
	events: Array<GameEvent>;
	handler: GameEventHandler;
	
	paused = false;
	currentTileX = 0;
	currentTileY = 0;

	currentTime = 0;
	previousTime = 0;

	constructor(renderer: Renderer, input: Input, guiManager: GuiManager) {
		this.renderer = renderer;
		this.input = input;
		this.guiManager = guiManager;
		this.handler = new GameEventHandler(this, guiManager);

		this.player = new Player(17, 19);
		this.events = new Array<GameEvent>();
	}

	public loadLevel(urlString: string) {
		const url = new URL(urlString);
		console.log('Loading new room from URL', url.href);

		fetch(url.href, {
			method: 'get',
			mode: 'cors'
		}).then((response) => {
			if ( response.ok ) {
				response.json().then(json => {
					const level = json as Level;
					let warnings = Level.validate(level);
					if ( warnings.length > 0) {
						console.warn('Warnings were returned during room validation', warnings);
					}

					if ( level.name != null ) {
						this.guiManager.enteredLevel(level.name, level.author);						
					}

					this.initialize(World.from(level, url));
				})
			} else {
				throw new Error(`Unable to retrieve room at URL: ${urlString}`);
			}
		});
	}

	/**
	 * Initializes the game instance with the specified world
	 * @param world 
	 */
	public initialize(world: World) {
		this.world = world;
		let oldScore = this.player.score;
		this.player = new Player(world.playerStart.x, world.playerStart.y);
		this.player.rotateBy(world.playerRotation);
		this.player.score = oldScore;
		this.paused = false;
		this.tick();
	}

	public levelEnd(nextLevel: string | null) {
		this.paused = true;
		this.guiManager.createEndScreen(this, nextLevel);
	}

	/**
	 * Progresses the game by 1 step, and schedules the next step
	 */
	public tick() {
		if ( this.paused ) {
			return;
		}

		if (this.previousTime=== 0 ) {
			this.previousTime = performance.now();
		} else {
			this.previousTime = this.currentTime;
		}

		this.currentTime = performance.now();

		const delta = (this.currentTime - this.previousTime)/1000;
		this.gameStep(delta);
		this.world.step(delta);

		this.renderer.render(this, delta);
		this.guiManager.tick(this, delta);

		this.events.forEach(e => this.handler.handle(e));
		this.events = [];

		window.requestAnimationFrame(this.tick.bind(this));
	}

	public addEvent(event: GameEvent) {
		this.events.push(event);
	}

	private gameStep(delta: number) {
		if ( this.input.keyQueue.length > 0) {
			if ( this.input.keyQueue.find((k) => k === 'm') != null) {
				this.renderer.toggleMap();
			}

			this.input.clearQueue();
		}

		// Interact with objects in the world
		if ( this.input.usePressed || this.input.leftMouseUp ) {
			const ray = RayCast.ray(this.player.position, this.player.direction, this.player.plane, 0, this.world);
			if ( ray.hit && ray.perpWallDist < 2 ) {
				if ( ray.worldObject instanceof Door || ray.worldObject instanceof Exit) {
					ray.worldObject.interact(this);
				}
			} 
		}

		if ( !this.input.anyDirectional() && this.input.mouseDragStart == null ) {
			return;
		}
		
		var movement = this.getMovementFromInput();
		if ( movement.x === 0 && movement.y === 0) {
			return;
		}

		let newPlayerPos = this.player.position.add(movement);

		// Out of bounds
		if (newPlayerPos.y > this.world.objects.length || newPlayerPos.y < 0 || 
			newPlayerPos.x > this.world.objects[0].length || newPlayerPos.x < 0) {
			return;
		}

		const currentTile = this.world.objects[this.currentTileY][this.currentTileX];
		const nextTile = this.world.objects[Math.floor(newPlayerPos.y)][Math.floor(newPlayerPos.x)];
		let rotationOffset = 0;
		if (nextTile instanceof GameObject ) {
			if ( nextTile.collidable() ) { return; }
			if ( nextTile instanceof Portal ) {
				rotationOffset = -(nextTile.targetPortal.targetDirection.rotationDiff(nextTile.targetDirection)-180);
				newPlayerPos = 
					new Vector(
						newPlayerPos.x - Math.floor(newPlayerPos.x),
						newPlayerPos.y - Math.floor(newPlayerPos.y)
					)
					.rotateBy(rotationOffset)
					.add(nextTile.targetPortal.targetDirection);

				if (newPlayerPos.x < 0) {newPlayerPos.x++;}
				if (newPlayerPos.y < 0) {newPlayerPos.y++;}
				newPlayerPos = newPlayerPos.add(nextTile.targetPosition);

				const nudge = nextTile.targetPortal.targetDirection.multiply(0.1);
				while (	Math.floor(newPlayerPos.x) === Math.floor(nextTile.targetPosition.x) &&
					Math.floor(newPlayerPos.y) === Math.floor(nextTile.targetPosition.y)) {
					newPlayerPos = newPlayerPos.add(nudge);
				}
			}
		}

		this.player.position = newPlayerPos;
		this.player.rotateBy(rotationOffset);
		this.currentTileX = Math.floor(newPlayerPos.x);
		this.currentTileY = Math.floor(newPlayerPos.y);

		if ( currentTile instanceof Pickup) {
			currentTile.onPickup(this.player);
			this.world.objects[this.currentTileY][this.currentTileX] = null;
			this.player.lastItem = performance.now();
		}
	}

	private getMovementFromInput(): Vector {
		if ( this.input.leftPressed) {
			this.player.rotateBy(1.5);
		} else if ( this.input.rightPressed) {
			this.player.rotateBy(-1.5);
		}

		let xVel = 0;
		let yVel = 0;
		if ( this.input.upPressed ) {
			yVel += this.player.direction.y * this.player.movementSpeed;
			xVel += this.player.direction.x * this.player.movementSpeed;
		} else if (this.input.downPressed) {
			yVel -= this.player.direction.y * this.player.movementSpeed;
			xVel -= this.player.direction.x * this.player.movementSpeed;
		} 

		if ( this.input.mouseDragStart != null) {
			this.player.rotateBy((this.input.mouseDragStart.x - this.input.mousePosition.x)*0.01);
			const forward = (this.input.mouseDragStart.y - this.input.mousePosition.y) * 0.0005;
			if ( forward > 0.01 ) {
				yVel = this.player.direction.y * Math.min(forward, this.player.movementSpeed)
				xVel = this.player.direction.x * Math.min(forward, this.player.movementSpeed)
			} else if (forward < -0.01) {
				yVel = this.player.direction.y * Math.max(forward, -this.player.movementSpeed)
				xVel = this.player.direction.x * Math.max(forward, -this.player.movementSpeed)
			}
		}

		return new Vector(xVel, yVel);
	}
};
