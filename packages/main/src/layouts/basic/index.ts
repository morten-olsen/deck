import { Button } from '../../App';
import { Layout, PositionArgs } from '../../Layout';
import { createBack } from '../../images';

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
        image: createBack(),
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
