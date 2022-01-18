import { Button } from '../../App';
import { createCanvas } from '../../images';
import { Layout, PositionArgs } from '../../Layout';

const backImage = createCanvas((canvas) => {
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

class BasicLayout<TButton extends Button> implements Layout<TButton> {
  #backButton?: Button;

  public position = ({
    api,
    isRoot,
    appButtons,
    stickyButtons,
  }: PositionArgs<TButton>) => {
    const buttons: (TButton | Button)[] = [];
    if (!this.#backButton) {
      this.#backButton = new Button({
        image: backImage,
        action: api.back,
      })
    }
    if (!isRoot) {
      buttons.push(this.#backButton);
    }
    buttons.push(
      ...stickyButtons,
      ...appButtons,
    );
    return buttons;
  }
}

export { BasicLayout };
