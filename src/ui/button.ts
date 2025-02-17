import { UiElement } from "./ui";

export class Button extends UiElement {
  constructor(text: string) {
    super(document.createElement("button"));
    this.size = { width: 100, height: 32 };
    this.addStyles(
      "rounded",
      "py-1",
      "px-2",
      "bg-blue-600",
      "hover:bg-blue-500"
    );
    this.zIndex = 10;
    this.setText(text);
  }

  setOnClick(callback: () => void) {
    this.element.addEventListener("click", callback);
  }
}
