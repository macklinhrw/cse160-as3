import { canvas } from "../asg3";
import { Matrix4, Vector3 } from "../lib/cuon-matrix-cse160";

export default class Camera {
  position: Vector3; // eye
  target: Vector3; // at, center
  viewMatrix: Matrix4;
  projectionMatrix: Matrix4;
  up: Vector3; // up
  aspect: number;
  moveSpeed: number;
  rotationSpeed: number;
  lastMouseX: number | null = null;
  lastMouseY: number | null = null;
  isMouseEnabled: boolean = false;
  isLocked: boolean = false;

  constructor(position = [0, 0, -3], target = [0, 0, 100]) {
    this.position = new Vector3(position);
    this.target = new Vector3(target);
    this.viewMatrix = new Matrix4();
    this.projectionMatrix = new Matrix4();
    this.up = new Vector3([0, 1, 0]);

    this.aspect = canvas.width / canvas.height;

    this.moveSpeed = 0.5;
    this.rotationSpeed = 0.15;

    window.addEventListener("resize", (e) => {
      this.aspect = canvas.width / canvas.height;

      this.calculateViewProjection();
    });

    window.addEventListener("keydown", (e) => {
      this.handleKeyDown(e);
    });

    canvas.addEventListener("mousemove", (e) => {
      this.handleMouseMove(e);
    });

    canvas.addEventListener("mousedown", () => {
      this.isMouseEnabled = true;
    });

    canvas.addEventListener("mouseup", () => {
      // Mouse Enabled
      this.isMouseEnabled = false;
      // Reset last mouse x to prevent jumping
      this.lastMouseX = null;
      this.lastMouseY = null;
    });

    this.calculateViewProjection();
  }

  handleKeyDown(event: KeyboardEvent) {
    if (this.isLocked) return;

    switch (event.key.toLowerCase()) {
      case "w":
        this.moveForward();
        break;
      case "s":
        this.moveBackward();
        break;
      case "a":
        this.moveLeft();
        break;
      case "d":
        this.moveRight();
        break;
      case "q":
        this.turnLeft();
        break;
      case "e":
        this.turnRight();
        break;
    }
    this.calculateViewProjection();
  }

  moveForward() {
    const d = new Vector3().set(this.target).sub(this.position).normalize();
    this.position = this.position.add(d.mul(this.moveSpeed));
    this.target = this.target.add(d.mul(this.moveSpeed));
  }

  moveBackward() {
    const d = new Vector3().set(this.target).sub(this.position).normalize();
    this.position = this.position.sub(d.mul(this.moveSpeed));
    this.target = this.target.sub(d.mul(this.moveSpeed));
  }

  moveLeft() {
    const d = new Vector3().set(this.target).sub(this.position).normalize();
    const left = Vector3.cross(this.up, d).normalize();
    const moveVec = left.mul(this.moveSpeed);
    this.position = this.position.add(moveVec);
    this.target = this.target.add(moveVec);
  }

  moveRight() {
    const d = new Vector3().set(this.target).sub(this.position).normalize();
    const right = Vector3.cross(d, this.up).normalize();
    const moveVec = right.mul(this.moveSpeed);
    this.position = this.position.add(moveVec);
    this.target = this.target.add(moveVec);
  }

  turnLeft() {
    const d = new Vector3().set(this.target).sub(this.position);
    const r = Math.sqrt(
      d.elements[0] * d.elements[0] + d.elements[2] * d.elements[2]
    );
    let theta = Math.atan2(d.elements[2], d.elements[0]);
    theta -= this.rotationSpeed;
    const newX = r * Math.cos(theta);
    const newZ = r * Math.sin(theta);
    this.target.elements[0] = this.position.elements[0] + newX;
    this.target.elements[2] = this.position.elements[2] + newZ;
  }

  turnRight() {
    const d = new Vector3().set(this.target).sub(this.position);
    const r = Math.sqrt(
      d.elements[0] * d.elements[0] + d.elements[2] * d.elements[2]
    );
    let theta = Math.atan2(d.elements[2], d.elements[0]);
    theta += this.rotationSpeed;
    const newX = r * Math.cos(theta);
    const newZ = r * Math.sin(theta);
    this.target.elements[0] = this.position.elements[0] + newX;
    this.target.elements[2] = this.position.elements[2] + newZ;
  }

  handleMouseMove(event: MouseEvent) {
    if (this.isLocked) return;
    if (!this.isMouseEnabled) return;
    if (this.lastMouseX === null || this.lastMouseY === null) {
      this.lastMouseX = event.clientX;
      this.lastMouseY = event.clientY;
      return;
    }

    const mouseX = event.clientX - this.lastMouseX;
    const mouseY = event.clientY - this.lastMouseY;

    const horizontalRotation = (mouseX * this.rotationSpeed) / 40;
    const verticalRotation = (mouseY * this.rotationSpeed) / 40;

    const d = new Vector3().set(this.target).sub(this.position);
    const r = Math.sqrt(
      d.elements[0] * d.elements[0] + d.elements[2] * d.elements[2]
    );
    let theta = Math.atan2(d.elements[2], d.elements[0]);
    theta += horizontalRotation;
    const newX = r * Math.cos(theta);
    const newZ = r * Math.sin(theta);

    const distance = d.magnitude();
    const currentHeight = this.target.elements[1] - this.position.elements[1];
    const currentAngle = Math.atan2(currentHeight, r);
    const newAngle = Math.max(
      -Math.PI / 2.5,
      Math.min(Math.PI / 2.5, currentAngle - verticalRotation)
    );
    const newHeight = distance * Math.sin(newAngle);
    const newRadius = distance * Math.cos(newAngle);

    this.target.elements[0] =
      this.position.elements[0] + (newX * newRadius) / r;
    this.target.elements[1] = this.position.elements[1] + newHeight;
    this.target.elements[2] =
      this.position.elements[2] + (newZ * newRadius) / r;

    this.calculateViewProjection();
    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;
  }

  calculateViewProjection() {
    this.viewMatrix.setLookAt(
      this.position.elements[0],
      this.position.elements[1],
      this.position.elements[2],
      this.target.elements[0],
      this.target.elements[1],
      this.target.elements[2],
      this.up.elements[0],
      this.up.elements[1],
      this.up.elements[2]
    );

    this.projectionMatrix.setPerspective(50, this.aspect, 0.1, 100);
  }

  setLocked(locked: boolean) {
    this.isLocked = locked;
  }
}
