import Camera from "../objects/camera";
import { Button } from "../ui/button";
import { FullWidthContainer } from "../ui/fullWidthContainer";
import { HtmlUi, UiElement } from "../ui/ui";
import { Vector3 } from "./cuon-matrix-cse160";

export class PokemonGame {
  playerHealth: number;
  monsterHealth: number;
  camera: Camera;
  cameraOriginalPosition: Vector3;
  cameraOriginalTarget: Vector3;
  turn: "player" | "monster";
  ui: HtmlUi;
  originalUi: HtmlUi;
  lastTickTime: number | null = null;
  audio: HTMLAudioElement | null = null;
  elapsedTime: number = 0;
  statusContainer: UiElement | null = null;
  shouldStart: boolean = false;

  constructor(camera: Camera, ui: HtmlUi, originalUi: HtmlUi) {
    // Game
    this.playerHealth = 10;
    this.monsterHealth = 10;
    this.turn = "player";

    // Camera
    this.camera = camera;
    this.cameraOriginalPosition = new Vector3().set(this.camera.position);
    this.cameraOriginalTarget = new Vector3().set(this.camera.target);

    // UI
    this.ui = ui;
    this.originalUi = originalUi;
    this.initUi();

    // Play audio
    this.audio = new Audio("src/audio/pokemon-battle.mp3");
  }

  initUi() {
    const ui = this.ui;

    // Create HTML UI
    const uiContainerEl = new FullWidthContainer(100);
    this.statusContainer = uiContainerEl;
    uiContainerEl.setText(`Pokemon status`);

    const buttonShowEl = new Button("Show");
    buttonShowEl.setOnClick(() => {
      uiContainerEl.setVisible(true);
      buttonShowEl.setVisible(false);
    });
    buttonShowEl.setSize(50, 28);
    buttonShowEl.setPositionRelativeBottomRight(10, 10);
    buttonShowEl.addStyles("text-sm");
    buttonShowEl.visible = false;

    const buttonAttack = new Button("Attack");
    buttonAttack.setSize(100, 40);
    buttonAttack.setPositionRelativeBottomLeft(20, 20);
    buttonAttack.addStyles("text-xs");
    buttonAttack.setParent(uiContainerEl);
    buttonAttack.setOnClick(() => {
      this.monsterHealth -= 1;
    });

    // const buttonRemoveBlock = new Button("Remove Block");
    // buttonRemoveBlock.setSize(100, 40);
    // buttonRemoveBlock.setPositionRelativeBottomLeft(140, 20);
    // buttonRemoveBlock.addStyles("text-xs");
    // buttonRemoveBlock.setParent(uiContainerEl);
    // buttonRemoveBlock.setOnClick(() => {
    //   // g_world.removeBlock(g_world.getNearestBlockPositionFromCamera());
    // });

    const buttonEl = new Button("Hide");
    buttonEl.setParent(uiContainerEl);
    buttonEl.setOnClick(() => {
      uiContainerEl.setVisible(false);
      buttonShowEl.setVisible(true);
    });
    buttonEl.setSize(60, 32);
    buttonEl.setPositionRelativeBottomRight(20, 20);

    ui.addElement(uiContainerEl);
    ui.addElement(buttonEl);
    ui.addElement(buttonShowEl);
    ui.addElement(buttonAttack);
  }

  start() {
    this.originalUi.delete();
    if (this.audio) {
      this.audio.play();
      this.audio.volume = 0.3;
      this.audio.loop = true;
    }

    // move camera
    this.camera.setLocked(true);
    this.camera.position.elements[0] = -2;
    this.camera.position.elements[1] = 0.7;
    this.camera.position.elements[2] = -2.7;
    this.camera.target.elements[0] = 49.4;
    this.camera.target.elements[1] = -32.77;
    this.camera.target.elements[2] = 80.34;
    this.camera.up.elements[0] = 0;
    this.camera.up.elements[1] = 1;
    this.camera.up.elements[2] = 0;
    this.camera.calculateViewProjection();
  }

  tick() {
    // duration in milliseconds
    const duration =
      this.lastTickTime !== null ? performance.now() - this.lastTickTime : 0;
    this.elapsedTime += duration;

    // Set Display Status
    if (this.statusContainer) {
      this.statusContainer.setText(
        `Health: ${this.playerHealth}, Monster Health: ${this.monsterHealth}, Turn: ${this.turn}`
      );
    }

    if (this.monsterHealth <= 0) {
      this.cleanup();
    }

    this.lastTickTime = performance.now();
  }

  render() {
    if (this.shouldStart) {
      this.ui.render();
      console.log("render");
    }
  }

  cleanup() {
    console.log("cleanup");
    this.shouldStart = false;

    // Camera
    this.camera.position = this.cameraOriginalPosition;
    this.camera.target = this.cameraOriginalTarget;
    this.camera.calculateViewProjection();
    this.camera.setLocked(false);

    // UI
    this.ui.delete();
    // this.statusContainer?.delete();
    this.originalUi.render();

    // Audio
    if (this.audio) {
      this.audio.pause();
      this.audio.remove();
      this.audio = null;
    }
  }
}
