import { createCanvas } from './canvas';

const createBack = () => createCanvas((canvas) => {
  const width = canvas.width * 0.3;
  const height = canvas.width * 0.6;
  const centerX = canvas.width / 2 - 20;
  const centerY = canvas.width / 2;
  canvas.setStrokeWidth(30);
  canvas.setStroke('#666');
  canvas.beginPath()
  canvas.moveTo(centerX + width / 2, centerY - height / 2)
  canvas.lineTo(centerX - width / 2, centerY)
  canvas.lineTo(centerX + width / 2, centerY + height / 2)
  canvas.stroke();
  return canvas;
});

export { createBack };
