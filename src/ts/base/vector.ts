export class Vector {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(vector: Vector): Vector {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    multiply(scalar: number): Vector {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    rotateBy(degrees: number): Vector {
        degrees = -degrees * (Math.PI / 180);
        const cos = Math.cos(degrees);
        const sin = Math.sin(degrees);
        const newX = Math.round(10000 * (this.x * cos - this.y * sin)) / 10000;
        const newY = Math.round(10000 * (this.x * sin + this.y * cos)) / 10000;
        return new Vector(newX, newY);
    }

    magnitude(): number {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    setLength(length: number): Vector {
        const mag = this.magnitude();
        return new Vector(this.x * (length / mag), this.y * (length / mag));
    }

    normalize(): Vector {
        const mgn = this.magnitude();
        return new Vector(this.x / mgn, this.y / mgn);
    }

    dot(vector: Vector): number {
        return (this.x * vector.x) + (this.y * vector.y);
    }

    cross(vector: Vector): number {
        return (this.x * vector.y) - (vector.x * this.y);
    }

    rotationDiff(vector: Vector): number {
        const result =
            (Math.atan2(this.y, this.x)
            - Math.atan2(vector.y, vector.x)) 
            * (180/Math.PI);
        return result
    }
}
