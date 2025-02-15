import { Color } from "./types";
import { gl, u_FragColor, program, u_ModelMatrix } from "./asg1";
import { drawTriangles3D } from "./triangle";
import { Matrix4 } from "./lib/cuon-matrix-cse160";

export class Cube {
  type: "cube";
  // position: Coordinate;
  color: Color;
  // size: number;
  // segments: number;
  matrix: Matrix4;
  vertexBuffer: WebGLBuffer | null;
  vertices: Float32Array[] | null;

  constructor() {
    this.type = "cube";
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();

    this.vertexBuffer = null;
    this.vertices = null;
  }

  // face index order
  // front - 0
  // top - 1
  // back - 2
  // bottom - 3
  // left - 4
  // right - 5
  generateVertices() {
    this.vertices = [];
    // Front of Cube
    // prettier-ignore
    this.vertices.push(new Float32Array([0,0,0, 1,1,0, 1,0,0,
                      0,0,0, 0,1,0, 1,1,0]));

    // Top of Cube
    // prettier-ignore
    this.vertices.push(new Float32Array([0,1,0, 0,1,1, 1,1,1,
                      0,1,0, 1,1,1, 1,1,0]));

    // Back of Cube
    // prettier-ignore
    this.vertices.push(new Float32Array([0,0,1, 1,1,1, 1,0,1,
                      0,0,1, 0,1,1, 1,1,1]));

    // Bottom of Cube
    // prettier-ignore
    this.vertices.push(new Float32Array([0,0,0, 1,0,1, 1,0,0,
                      0,0,0, 0,0,1, 1,0,1]));

    // Left of Cube
    // prettier-ignore
    this.vertices.push(new Float32Array([0,0,0, 0,1,1, 0,1,0,
                      0,0,0, 0,0,1, 0,1,1]));

    // Right of Cube
    // prettier-ignore
    this.vertices.push(new Float32Array([1,0,0, 1,1,0, 1,1,1,
                      1,0,0, 1,1,1, 1,0,1]));
  }

  render() {
    // let xy = this.position;
    let rgba = this.color;
    // let size = this.size;

    if (this.vertices === null) {
      this.generateVertices();
    }

    if (this.vertexBuffer === null) {
      this.vertexBuffer = gl.createBuffer();
      if (!this.vertexBuffer) {
        console.log("Failed to create the buffer object.");
        return -1;
      }
    }

    // Bug if not using this
    gl.useProgram(program);

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // Front of Cube
    // prettier-ignore
    this.drawFace(this.vertices![0]);

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(
      u_FragColor,
      rgba[0] * 0.9,
      rgba[1] * 0.9,
      rgba[2] * 0.9,
      rgba[3]
    );

    // Top of Cube
    // prettier-ignore
    this.drawFace(this.vertices![1]);

    // Back of Cube
    gl.uniform4f(
      u_FragColor,
      rgba[0] * 0.8,
      rgba[1] * 0.8,
      rgba[2] * 0.8,
      rgba[3]
    );
    // prettier-ignore
    this.drawFace(this.vertices![2]);

    // Bottom of Cube
    gl.uniform4f(
      u_FragColor,
      rgba[0] * 0.7,
      rgba[1] * 0.7,
      rgba[2] * 0.7,
      rgba[3]
    );
    // prettier-ignore
    this.drawFace(this.vertices![3]);

    // Left of Cube
    gl.uniform4f(
      u_FragColor,
      rgba[0] * 0.6,
      rgba[1] * 0.6,
      rgba[2] * 0.6,
      rgba[3]
    );
    // prettier-ignore
    this.drawFace(this.vertices![4]);

    // Right of Cube
    gl.uniform4f(
      u_FragColor,
      rgba[0] * 0.8,
      rgba[1] * 0.8,
      rgba[2] * 0.8,
      rgba[3]
    );
    // prettier-ignore
    this.drawFace(this.vertices![5]);
  }

  drawFace(vertices: Float32Array) {
    // prettier-ignore
    drawTriangles3D(vertices, this.vertexBuffer!);
  }
}

export function drawCube(matrix: Matrix4, rgba: number[]) {
  let cube = new Cube();
  cube.color = [rgba[0], rgba[1], rgba[2], rgba[3]];
  cube.matrix = matrix;
  cube.render();
}
