import { HtmlUi, UiElement } from "./ui";

export class FpsUi extends HtmlUi {
  constructor() {
    super();

    const fpsContainerEl = new UiElement(document.createElement("div"));
    fpsContainerEl.setPositionRelativeTopRight(10, 10);
    fpsContainerEl.setBackgroundPreset("ui");
    fpsContainerEl.addStyles(
      "rounded-lg",
      "p-2",
      "text-gray-300",
      "select-none"
    );

    this.addElement(fpsContainerEl);
  }
}
