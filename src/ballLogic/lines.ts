export class Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  constructor(x1: number, y1: number, x2: number, y2: number) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.closePath();
  }
  reverse() {
    const x = this.x1;
    const y = this.y1;
    this.x1 = this.x2;
    this.y1 = this.y2;
    this.x2 = x;
    this.y2 = y;
    return this;
  }
}
