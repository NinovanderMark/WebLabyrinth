import { Input } from './input';
import { Player } from './player';
import { Renderer } from './renderer';
import { StaticObject } from './static-object';

export class Game {
    public walls = [
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
		[4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,3,0,0,0,2],
		[4,0,0,0,0,0,0,2,2,2,2,2,2,0,0,3,0,3,3,3,0,0,0,2],
		[4,0,3,3,0,0,0,2,0,0,0,0,2,0,0,0,0,0,0,3,0,0,0,2],
		[4,0,3,3,0,0,2,2,0,2,2,0,2,0,0,3,3,3,0,3,0,0,0,2],
		[4,0,3,3,0,0,2,0,0,0,2,0,2,0,0,3,0,0,0,3,0,0,0,2],
		[4,0,3,3,0,0,2,0,0,0,0,0,2,0,0,3,0,3,3,3,0,0,0,2],
		[4,0,0,0,0,0,2,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,2],
		[4,0,0,0,0,0,2,2,0,2,2,0,0,0,0,3,0,3,0,3,0,0,0,2],
		[4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
		[4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
		[4,0,1,0,0,1,0,0,0,0,0,5,5,5,5,5,0,0,0,0,0,0,0,2],
		[4,0,0,0,0,1,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,2],
		[4,0,0,0,0,1,0,0,0,0,0,5,5,0,0,5,0,0,0,0,0,0,0,2],
		[4,0,1,1,1,1,0,0,0,0,0,0,5,0,0,5,0,0,0,0,0,0,0,2],
		[4,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,0,0,1,0,0,1,1,2],
		[4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,1,0,0,0,0,2],
		[4,4,0,4,0,0,0,0,4,0,0,0,0,0,0,0,0,0,1,0,0,1,1,2],
		[4,4,0,0,0,0,5,0,4,4,0,4,4,4,0,0,0,0,1,0,0,0,0,2],
		[4,4,0,4,0,0,0,0,4,0,0,0,0,0,0,0,0,0,1,0,0,1,1,2],
		[4,4,0,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,1,0,0,0,0,2],
		[4,4,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,1,0,0,0,0,2],
		[4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,1,0,0,0,0,2],
		[4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];

	public staticObjects = [
		new StaticObject(16.5, 8.5, 0),
		new StaticObject(18.5, 8.5, 0),
		new StaticObject(21.5, 10.5, 0)
	];

	public ceiling = 5;
	public floor = 2;

	player: Player;
	input: Input;
	renderer: Renderer;
	
	currentTileX = 0;
	currentTileY = 0;

	currentTime = 0;
	previousTime = 0;

	constructor(renderer: Renderer, input: Input) {
		this.renderer = renderer;
		this.input = input;
		this.player = new Player(17, 19);
	}

	/**
	 * Progresses the game by 1 step, and schedules the next step
	 */
	public tick() {
		this.gameStep();
		this.renderer.render(this);

		window.requestAnimationFrame(this.tick.bind(this));
	}

	private gameStep() {
		if ( this.input.keyQueue.length > 0) {
			console.log(this.input.keyQueue);
			if ( this.input.keyQueue.find((k) => k === 'm') != null) {
				this.renderer.toggleMap();
			}

			this.input.clearQueue();
		}

		if ( !this.input.anyDirectional() ) {
			return;
		}
		
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
		} else {
			return;
		}

		const newPlayerX = this.player.posX + xVel;
		const newPlayerY = this.player.posY + yVel;

		// Out of bounds
		if (newPlayerY > this.walls.length || newPlayerY < 0 || newPlayerX > this.walls[0].length || newPlayerX < 0) {
			return;
		}
		this.currentTileX = Math.floor(newPlayerX);
		this.currentTileY = Math.floor(newPlayerY);

		const currentTile = this.walls[this.currentTileY][this.currentTileX];
		if (currentTile !== 0 ) {
			return;
		}

		for (let s = 0; s < this.staticObjects.length; s++) {
			if ( this.staticObjects[s].distanceTo(newPlayerX, newPlayerY) <= 0.5) {
				return;
			}
		}

		this.player.posX = newPlayerX;
		this.player.posY = newPlayerY;
	}
};