import { UiElement } from "./ui";

export class FullWidthContainer extends UiElement {
  constructor(height: number = 64) {
    super(document.createElement("div"));
    this.size = { width: this.canvasWidth - 20, height: height };
    this.setPositionRelativeBottomLeft(10, 10);
    this.setBackgroundPreset("ui");
    this.addStyles("rounded-lg", "p-2", "text-gray-300", "select-none");
  }
}
