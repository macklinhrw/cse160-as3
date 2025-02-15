import { Matrix4 } from "./lib/cuon-matrix-cse160";
import { gl, u_FragColor, u_ModelMatrix } from "./asg1";
import { drawTriangle3D as drawTriangle } from "./triangle";

export class Cylinder {
  vertices: Float32Array;
  color: number[] = [1, 1, 1, 1];
  matrix: Matrix4 = new Matrix4();
  segments: number;
  vertexBuffer: WebGLBuffer;

  constructor(segments: number) {
    this.segments = segments;
    this.vertices = this.generateVertices();
    this.vertexBuffer = gl.createBuffer() as WebGLBuffer;
    if (!this.vertexBuffer) {
      console.error("Failed to create the buffer object.");
    }
  }

  generateVertices() {
    const vertices: number[] = [];

    const topY = 0.5;
    const bottomY = -0.5;
    const radius = 0.5;

    // center points for top and bottom faces
    vertices.push(0, topY, 0);
    vertices.push(0, bottomY, 0);
    // vertices around the cylinder
    for (let i = 0; i <= this.segments; i++) {
      const angle = (i / this.segments) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // Add vertices for top and bottom circles
      vertices.push(x, topY, z);
      vertices.push(x, bottomY, z);
    }

    // this.vertices = new Float32Array(vertices);
    return new Float32Array(vertices);
  }

  render() {
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    gl.uniform4f(
      u_FragColor,
      this.color[0],
      this.color[1],
      this.color[2],
      this.color[3]
    );

    const vertices = this.vertices;

    // top face
    for (let i = 2; i < vertices.length / 3 - 2; i += 2) {
      const centerIndex = 0;
      const v1Index = i;
      const v2Index = i + 2;

      drawTriangle(
        new Float32Array([
          vertices[centerIndex * 3],
          vertices[centerIndex * 3 + 1],
          vertices[centerIndex * 3 + 2],
          vertices[v1Index * 3],
          vertices[v1Index * 3 + 1],
          vertices[v1Index * 3 + 2],
          vertices[v2Index * 3],
          vertices[v2Index * 3 + 1],
          vertices[v2Index * 3 + 2],
        ]),
        this.vertexBuffer
      );
    }

    // bottom face
    for (let i = 3; i < vertices.length / 3 - 2; i += 2) {
      const centerIndex = 1;
      const v1Index = i;
      const v2Index = i + 2;

      drawTriangle(
        new Float32Array([
          vertices[centerIndex * 3],
          vertices[centerIndex * 3 + 1],
          vertices[centerIndex * 3 + 2],
          vertices[v1Index * 3],
          vertices[v1Index * 3 + 1],
          vertices[v1Index * 3 + 2],
          vertices[v2Index * 3],
          vertices[v2Index * 3 + 1],
          vertices[v2Index * 3 + 2],
        ]),
        this.vertexBuffer
      );
    }

    // side faces
    for (let i = 2; i < vertices.length / 3 - 2; i += 2) {
      const v1Index = i;
      const v2Index = i + 1;
      const v3Index = i + 2;
      const v4Index = i + 3;

      drawTriangle(
        new Float32Array([
          vertices[v1Index * 3],
          vertices[v1Index * 3 + 1],
          vertices[v1Index * 3 + 2],
          vertices[v2Index * 3],
          vertices[v2Index * 3 + 1],
          vertices[v2Index * 3 + 2],
          vertices[v3Index * 3],
          vertices[v3Index * 3 + 1],
          vertices[v3Index * 3 + 2],
        ]),
        this.vertexBuffer
      );

      drawTriangle(
        new Float32Array([
          vertices[v2Index * 3],
          vertices[v2Index * 3 + 1],
          vertices[v2Index * 3 + 2],
          vertices[v4Index * 3],
          vertices[v4Index * 3 + 1],
          vertices[v4Index * 3 + 2],
          vertices[v3Index * 3],
          vertices[v3Index * 3 + 1],
          vertices[v3Index * 3 + 2],
        ]),
        this.vertexBuffer
      );
    }
  }
}
