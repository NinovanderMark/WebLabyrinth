export class Item {
    sprite: number;
    amount: number;
    name: string;

    constructor(name: string, sprite: number, amount: number = 1) {
        this.amount = amount;
        this.sprite = sprite;
        this.name = name;
    }
}