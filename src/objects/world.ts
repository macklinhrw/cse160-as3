import { Cube } from "../primitives/cube";
import { Matrix4, Vector3 } from "../lib/cuon-matrix-cse160";
import { Map } from "./map";
import { Turtle } from "./turtle";
import Camera from "./camera";

export class World {
  camera: Camera;
  map: Map;
  sky: Cube;
  floor: Cube;
  turtle: Turtle;

  constructor() {
    this.camera = new Camera();
    this.map = new Map();

    this.sky = new Cube();
    this.sky.color = [0.4, 0.4, 1, 1.0];
    this.sky.matrix.scale(50, 50, 50);
    this.sky.matrix.scale(-1, -1, -1);
    this.sky.matrix.translate(-0.5, -0.5, -0.5);
    // this.sky.setImage("src/textures/sky.jpg", 0);
    this.sky.textureNum = -2;

    this.floor = new Cube();
    this.floor.color = [1.0, 0.0, 0.0, 1.0];
    this.floor.matrix.translate(0, -0.5, 0.0);
    this.floor.matrix.scale(40, 0, 40);
    this.floor.matrix.translate(-0.5, 0, -0.5);
    this.floor.setImage("src/textures/grass.png", 0);
    this.floor.textureNum = 0;
    this.floor.render();

    this.turtle = new Turtle(new Vector3([0, -0.2, 0]));
  }

  render() {
    this.map.render();

    // Draw the sky
    this.sky.render();

    // Draw the floor
    this.floor.render();

    // Draw the turtle
    this.turtle.render();
  }

  getNearestBlockPositionFromCamera(): { x: number; y: number; z: number } {
    const blockSize = 0.5;
    const center = { x: 16, y: 0, z: 16 };

    const cameraPosition = new Vector3().set(this.camera.position);
    const cameraTarget = this.camera.target;
    // Calculate the direction

    const direction = cameraPosition.sub(cameraTarget).mul(-1).normalize();
    // console.log("Direction:", direction.elements);

    const directionX = direction.elements[0];
    const directionY = direction.elements[1];
    const directionZ = direction.elements[2];

    const targetPosition = {
      x: this.camera.position.elements[0] + directionX,
      y: this.camera.position.elements[1] + directionY,
      z: this.camera.position.elements[2] + directionZ,
    };

    const blockX = Math.round(targetPosition.x / blockSize);
    const blockY = Math.round(targetPosition.y / blockSize);
    const blockZ = Math.round(targetPosition.z / blockSize);

    // clamp to world positions
    const blockPosition = {
      x: Math.max(0, Math.min(blockX + center.x, 31)),
      y: Math.max(0, Math.min(blockY + center.y, 3)),
      z: Math.max(0, Math.min(blockZ + center.z, 31)),
    };

    // // convert the coordinate system
    return blockPosition;
  }

  getNearestBlockFromCamera(): Matrix4 | null {
    const blockPosition = this.getNearestBlockPositionFromCamera();
    // console.log("g_map", g_map[blockPosition.x][blockPosition.z]);
    return this.map.blocks[blockPosition.x][blockPosition.z][blockPosition.y];
  }

  placeBlock(blockPosition: { x: number; y: number; z: number }) {
    const body = new Cube();
    body.matrix.scale(0.5, 0.5, 0.5);
    body.matrix.translate(
      blockPosition.x - 16,
      blockPosition.y - 1,
      blockPosition.z - 16
    );
    this.map.blocks[blockPosition.x][blockPosition.z][blockPosition.y] =
      new Matrix4().set(body.matrix);
  }

  removeBlock(blockPosition: { x: number; y: number; z: number }) {
    this.map.blocks[blockPosition.x][blockPosition.z][blockPosition.y] = null;
  }
}
