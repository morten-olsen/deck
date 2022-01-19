import { createCanvas } from './canvas';

type Options = {
  font?: string;
  background?: string;
  color?: string;
  size?: number;
  margin?: number;
  autoScale?: boolean;
}

const createText = (text: string, {
  font = 'Impact',
  color = '#fff',
  background = '#000',
  size = 120,
  margin = 30,
  autoScale = true,
}: Options = {}) => createCanvas((canvas) => {
  if (autoScale) {
    size = 200;
  }
  canvas.setTextFont(`${size}px ${font}`);
  const { width } = canvas.measureText(text);
  const baseLine = autoScale ? width / canvas.width : 1;
  const baseLineMargin = margin * baseLine;
  
  const outerWidth = (autoScale ? width + (baseLineMargin * 2) : canvas.width);
  if (autoScale) {
    canvas.changeCanvasSize(outerWidth + baseLine * 10, outerWidth + baseLine * 10);
  } else {
    canvas.changeCanvasSize(canvas.width + 10, canvas.height + 10);
  }
  canvas.setColor(background);
  canvas.translate(outerWidth / 2, outerWidth / 2)
  canvas.printRoundedRectangle(-outerWidth / 2, -outerWidth / 2, outerWidth, outerWidth, baseLine * 50);
  canvas.setTextFont(`${size}px ${font}`);
  canvas.setColor(color);
  canvas.save();
  canvas.setTextBaseline('middle');
  canvas.setTextAlign('center');
  canvas.printText(text, 0, 0);
  canvas.restore();
  return canvas;
});

export { createText };
