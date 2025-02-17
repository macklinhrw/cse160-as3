import { nanoid } from "nanoid";
import { canvas } from "../asg3";

export class HtmlUi {
  elements: { [kee: string]: UiElement };
  rendered: boolean;
  canvasWidth: number;
  canvasHeight: number;

  constructor() {
    this.elements = {};
    this.rendered = false;

    const canvasRect = canvas.getBoundingClientRect();
    this.canvasWidth = canvasRect.width;
    this.canvasHeight = canvasRect.height;

    // handler for resize
    window.addEventListener("resize", () => {
      const canvasRect = canvas.getBoundingClientRect();
      this.canvasWidth = canvasRect.width;
      this.canvasHeight = canvasRect.height;
      for (const element of Object.values(this.elements)) {
        element.resetOffset(canvasRect);
      }
      this.delete();
      this.render();
    });
  }

  addElement(element: UiElement, render: boolean = this.rendered) {
    this.elements[element.id] = element;
    if (render) {
      element.render();
    }
  }

  removeElement(element: UiElement, render: boolean = this.rendered) {
    delete this.elements[element.id];
    if (render) {
      element.delete();
    }
  }

  getElement(id: string) {
    return this.elements[id];
  }

  render() {
    if (this.rendered) {
      return;
    }

    Object.values(this.elements).forEach((element) => {
      element.render();
    });

    this.rendered = true;
  }

  delete() {
    Object.values(this.elements).forEach((element) => {
      element.delete();
    });

    this.rendered = false;
  }
}

export class UiElement {
  element: HTMLElement;
  id: string;
  position: { x: number; y: number };
  offset: { x: number; y: number };
  canvasWidth: number;
  canvasHeight: number;
  size: { width: number; height: number };
  styles: string[];
  rendered: boolean;
  visible: boolean;
  zIndex: number;

  children: { [key: string]: UiElement };

  constructor(
    element: HTMLElement,
    size: { width: number; height: number } = { width: 10, height: 10 },
    position: { x: number; y: number } = { x: 0, y: 0 },
    zIndex: number = 0
  ) {
    this.element = element;
    this.id = nanoid();
    this.position = position;
    this.size = size;
    this.visible = true;
    this.rendered = false;
    this.zIndex = zIndex;

    // Canvas offset and width/height
    const canvasRect = canvas.getBoundingClientRect();
    this.offset = { x: canvasRect.left, y: canvasRect.top };
    this.canvasWidth = canvasRect.width;
    this.canvasHeight = canvasRect.height;

    this.styles = [];
    this.children = {};
  }

  resetOffset(canvasRect: DOMRect | null = null) {
    if (canvasRect === null) {
      canvasRect = canvas.getBoundingClientRect();
    }
    this.offset = { x: canvasRect.left, y: canvasRect.top };
    this.canvasWidth = canvasRect.width;
    this.canvasHeight = canvasRect.height;
  }

  render() {
    if (this.rendered || !this.visible) {
      return;
    }

    for (const child of Object.values(this.children)) {
      child.render();
    }

    this.element.style.position = "absolute";
    this.element.style.left = `${this.position.x + this.offset.x}px`;
    this.element.style.top = `${this.position.y + this.offset.y}px`;
    this.element.style.width = `${this.size.width}px`;
    this.element.style.height = `${this.size.height}px`;
    this.element.style.zIndex = `${this.zIndex}`;
    this.styles.forEach((style) => {
      this.element.classList.add(style);
    });
    document.body.appendChild(this.element);
    this.rendered = true;
  }

  delete() {
    if (!this.rendered) {
      return;
    }

    Object.values(this.children).forEach((child) => {
      child.delete();
    });

    document.body.removeChild(this.element);
    this.rendered = false;
  }

  setParent(parent: UiElement) {
    parent.children[this.id] = this;
  }

  setVisible(visible: boolean) {
    this.visible = visible;
    for (const child of Object.values(this.children)) {
      child.setVisible(visible);
    }
    if (visible) {
      this.render();
    } else {
      this.delete();
    }
  }

  removeChild(child: UiElement) {
    delete this.children[child.id];
  }

  setPosition(x: number, y: number) {
    this.position = { x, y };
  }

  setPositionRelativeTopLeft(x: number, y: number) {
    this.setPosition(x, y);
  }

  setPositionRelativeTopRight(x: number, y: number) {
    const relativeX = this.canvasWidth - x - this.size.width;
    const relativeY = y;
    this.setPosition(relativeX, relativeY);
  }

  setPositionRelativeBottomLeft(x: number, y: number) {
    const relativeX = x;
    const relativeY = this.canvasHeight - y - this.size.height;
    this.setPosition(relativeX, relativeY);
  }

  setPositionRelativeBottomRight(x: number, y: number) {
    const relativeX = this.canvasWidth - x - this.size.width;
    const relativeY = this.canvasHeight - y - this.size.height;
    this.setPosition(relativeX, relativeY);
  }

  setText(text: string) {
    this.element.textContent = text;
  }

  setBackground(color: { r: number; g: number; b: number; a: number }) {
    this.element.style.backgroundColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
  }

  setBackgroundPreset(preset: "ui") {
    switch (preset) {
      case "ui":
        this.setBackground({ r: 0, g: 0, b: 0, a: 0.5 });
        break;
    }
  }

  addStyles(...styles: string[]) {
    styles.forEach((style) => {
      this.styles.push(style);
    });
  }

  removeStyles(...styles: string[]) {
    styles.forEach((style) => {
      this.styles = this.styles.filter((s) => s !== style);
    });
  }

  setSize(width: number, height: number) {
    this.size = { width, height };
  }

  setHeight(height: number) {
    this.size = { width: this.size.width, height };
  }

  setWidth(width: number) {
    this.size = { width, height: this.size.height };
  }
}
