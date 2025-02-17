// references
// https://www.typescriptlang.org/docs/handbook/intro.html
export class Vector3 {
  constructor(opt_src?: any);
  elements: Float32Array;

  set(src: Vector3): Vector3;

  // operations
  add(other: Vector3): Vector3;
  sub(other: Vector3): Vector3;
  div(scalar: number): Vector3;
  mul(scalar: number): Vector3;
  magnitude(): number;
  normalize(): Vector3;

  // static functions
  static dot(other1: Vector3, other2: Vector3): number;
  static cross(other1: Vector3, other2: Vector3): Vector3;
}

export class Vector4 {
  constructor(opt_src?: any);
  elements: Float32Array;
}

export class Matrix4 {
  constructor(opt_src?: any);
  elements: Float32Array;
  setIdentity(): Matrix4;
  set(src: Matrix4): Matrix4;
  multiply(other: Matrix4): Matrix4;
  concat(other: Matrix4): Matrix4;
  multiplyVector3(pos: Vector3): Vector3;
  multiplyVector4(pos: Vector4): Vector4;
  transpose(): Matrix4;
  setInverseOf(other: Matrix4): Matrix4;
  invert(): Matrix4;
  setOrtho(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ): Matrix4;
  ortho(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ): Matrix4;
  setFrustum(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ): Matrix4;
  frustum(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ): Matrix4;
  setPerspective(
    fovy: number,
    aspect: number,
    near: number,
    far: number
  ): Matrix4;
  perspective(fovy: number, aspect: number, near: number, far: number): Matrix4;
  setScale(x: number, y: number, z: number): Matrix4;
  scale(x: number, y: number, z: number): Matrix4;
  setTranslate(x: number, y: number, z: number): Matrix4;
  translate(x: number, y: number, z: number): Matrix4;
  setRotate(angle: number, x: number, y: number, z: number): Matrix4;
  rotate(angle: number, x: number, y: number, z: number): Matrix4;
  setLookAt(
    eyeX: number,
    eyeY: number,
    eyeZ: number,
    centerX: number,
    centerY: number,
    centerZ: number,
    upX: number,
    upY: number,
    upZ: number
  ): Matrix4;
  lookAt(
    eyeX: number,
    eyeY: number,
    eyeZ: number,
    centerX: number,
    centerY: number,
    centerZ: number,
    upX: number,
    upY: number,
    upZ: number
  ): Matrix4;
  dropShadow(plane: Float32Array, light: Float32Array): Matrix4;
  dropShadowDirectionally(
    normX: number,
    normY: number,
    normZ: number,
    planeX: number,
    planeY: number,
    planeZ: number,
    lightX: number,
    lightY: number,
    lightZ: number
  );
}
