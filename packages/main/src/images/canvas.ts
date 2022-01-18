import { Canvas } from 'canvas-constructor/skia';

type Render = (canvas: Canvas) => Canvas;

const createCanvas = (render: Render) => {
  const canvas = new Canvas(72 * 4, 72 * 4);
  return render(canvas).toBuffer('svg');
};

export { createCanvas };
