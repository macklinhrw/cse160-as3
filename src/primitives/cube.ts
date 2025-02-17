import { Color } from "../types";
import {
  gl,
  u_FragColor,
  program,
  u_ModelMatrix,
  u_whichTexture,
  uTexture0,
  uTexture1,
} from "../asg3";
import { drawTriangles3DUV } from "./triangle";
import { Matrix4 } from "../lib/cuon-matrix-cse160";

export class Cube {
  type: "cube";
  color: Color;
  textureNum: number;

  matrix: Matrix4;
  vertexBuffer: WebGLBuffer | null;
  vertices: Float32Array | null;

  UVBuffer: WebGLBuffer | null;
  UV: Float32Array | null;

  texture0: WebGLTexture | null;
  texture1: WebGLTexture | null;

  constructor() {
    this.type = "cube";
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();

    this.vertexBuffer = null;
    this.vertices = null;

    this.UVBuffer = null;
    this.UV = null;

    this.textureNum = -2;

    this.texture0 = null;
    this.texture1 = null;
  }

  // face index order
  // front - 0
  // top - 1
  // back - 2
  // bottom - 3
  // left - 4
  // right - 5
  generateVertices() {
    let tempVertices = [];
    let tempUV = [];

    // Front of Cube
    // prettier-ignore
    tempVertices.push(
      0,0,0, 1,1,0, 1,0,0,
      0,0,0, 0,1,0, 1,1,0
    );
    // prettier-ignore
    tempUV.push(
      0,0, 1,1, 1,0,
      0,0, 0,1, 1,1
    );

    // Top of Cube
    // prettier-ignore
    tempVertices.push(
      0,1,0, 0,1,1, 1,1,1,
      0,1,0, 1,1,1, 1,1,0
    );
    // prettier-ignore
    tempUV.push(
      0,0, 1,0, 1,1,
      0,0, 1,1, 0,1
    );

    // Back of Cube
    // prettier-ignore
    tempVertices.push(
      0,0,1, 1,1,1, 1,0,1,
      0,0,1, 0,1,1, 1,1,1
    );
    // prettier-ignore
    tempUV.push(
      0,0, 1,1, 1,0,
      0,0, 0,1, 1,1
    );

    // Bottom of Cube
    // prettier-ignore
    tempVertices.push(
      0,0,0, 1,0,1, 1,0,0,
      0,0,0, 0,0,1, 1,0,1
    );
    // prettier-ignore
    tempUV.push(
      0,0, 1,1, 1,0,
      0,0, 0,1, 1,1
    );

    // Left of Cube
    // prettier-ignore
    tempVertices.push(
      0,0,0, 0,1,1, 0,1,0,
      0,0,0, 0,0,1, 0,1,1
    );
    // prettier-ignore
    tempUV.push(
      0,0, 1,1, 1,0,
      0,0, 0,1, 1,1
    );

    // Right of Cube
    // prettier-ignore
    tempVertices.push(
      1,0,0, 1,1,0, 1,1,1,
      1,0,0, 1,1,1, 1,0,1
    );
    // prettier-ignore
    tempUV.push(
      0,0, 1,0, 1,1,
      0,0, 1,1, 0,1
    );

    this.vertices = new Float32Array(tempVertices);
    this.UV = new Float32Array(tempUV);
  }

  render() {
    // let xy = this.position;
    let rgba = this.color;
    // let size = this.size;

    if (this.vertices === null) {
      // Also generates UV
      this.generateVertices();
    }

    if (this.vertexBuffer === null) {
      this.vertexBuffer = gl.createBuffer();
      if (!this.vertexBuffer) {
        console.log("Failed to create the buffer object.");
        return -1;
      }
    }

    if (this.UVBuffer === null) {
      this.UVBuffer = gl.createBuffer();
      if (!this.UVBuffer) {
        console.log("Failed to create the buffer object.");
        return -1;
      }
    }

    // Bug if not using this
    gl.useProgram(program);

    gl.uniform1i(u_whichTexture, this.textureNum);
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    drawTriangles3DUV(
      this.vertices!,
      this.UV!,
      this.vertexBuffer!,
      this.UVBuffer!
    );
  }

  setImage(imagePath: string, index: number) {
    if (index === 0) {
      if (this.texture0 === null) {
        this.texture0 = gl.createTexture();
      }

      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

      const img = new Image();

      img.onload = () => {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture0);
        gl.texParameteri(
          gl.TEXTURE_2D,
          gl.TEXTURE_MIN_FILTER,
          gl.LINEAR_MIPMAP_LINEAR
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          img
        );

        // Mipmap
        gl.generateMipmap(gl.TEXTURE_2D);

        gl.uniform1i(uTexture0, 0);
      };

      img.crossOrigin = "anonymous";
      img.src = imagePath;
    } else if (index === 1) {
      if (this.texture1 === null) {
        this.texture1 = gl.createTexture();
      }

      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

      const img = new Image();

      img.onload = () => {
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.texture1);
        gl.texParameteri(
          gl.TEXTURE_2D,
          gl.TEXTURE_MIN_FILTER,
          gl.LINEAR_MIPMAP_LINEAR
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          img
        );

        // Mipmap
        gl.generateMipmap(gl.TEXTURE_2D);

        gl.uniform1i(uTexture1, 1);
      };
      img.crossOrigin = "anonymous";
      img.src = imagePath;
    }
  }
}

export function drawCube(matrix: Matrix4, rgba: number[]) {
  let cube = new Cube();
  cube.color = [rgba[0], rgba[1], rgba[2], rgba[3]];
  cube.matrix = matrix;
  cube.render();
}
