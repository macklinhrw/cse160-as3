import { initShaders } from "./lib/cuon-utils";
import { Cube } from "./cube";
import { Matrix4 } from "./lib/cuon-matrix-cse160";
import { Cylinder } from "./cylinder";

// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  "attribute vec4 a_Position;\n" +
  "uniform mat4 u_ModelMatrix;\n" +
  "uniform mat4 u_GlobalRotateMatrix;\n" +
  "void main() {\n" +
  "  gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n" +
  // "  gl_Position = a_Position;\n" +
  "}\n";

// Fragment shader program
var FSHADER_SOURCE =
  "precision mediump float;\n" +
  "uniform vec4 u_FragColor;\n" + // uniform変数
  "void main() {\n" +
  "  gl_FragColor = u_FragColor;\n" +
  "}\n";

// Globals
export let canvas: HTMLCanvasElement;
export let gl: WebGLRenderingContext;
export let a_Position: number;
export let u_FragColor: WebGLUniformLocation;
export let u_Size: WebGLUniformLocation;
export let u_ModelMatrix: WebGLUniformLocation;
export let u_GlobalRotateMatrix: WebGLUniformLocation;
export let program: WebGLProgram;

// Globals for drawing UI
let g_globalAngle = 5;
let g_joint1Angle = 0;
let g_joint2Angle = 0;
let g_joint3Angle = 0;

// animations
let g_joint1AnimationRunning = false;
let g_joint2AnimationRunning = false;
let g_joint3AnimationRunning = false;
let g_neckAngle = 55;
let g_neckAnimating = false;

let g_mouseRotX = 0;
let g_mouseRotY = 0;

function setupWebGL() {
  // Retrieve <canvas> element
  let canvasTmp = document.getElementById("webgl") as HTMLCanvasElement | null;
  if (!canvasTmp) {
    console.log("Failed to get the canvas.");
    return;
  }
  canvas = canvasTmp;

  // Get the rendering context for WebGL
  // let glTmp = getWebGLContext(canvas);
  let glTmp = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!glTmp) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }
  gl = glTmp;

  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to intialize shaders.");
    return;
  }
  program = gl.program;

  // // Get the storage location of a_Position
  let a_PositionTmp = gl.getAttribLocation(gl.program, "a_Position");
  if (a_PositionTmp < 0) {
    console.log("Failed to get the storage location of a_Position");
    return;
  }
  a_Position = a_PositionTmp;

  // Get the storage location of u_FragColor
  let u_FragColorTmp = gl.getUniformLocation(gl.program, "u_FragColor");
  if (!u_FragColorTmp) {
    console.log("Failed to get the storage location of u_FragColor");
    return;
  }
  u_FragColor = u_FragColorTmp;

  // Get the storage location of u_Size
  // let u_SizeTmp = gl.getUniformLocation(gl.program, "u_Size");
  // if (!u_SizeTmp) {
  //   console.log("Failed to get the storage location of u_Size");
  //   return;
  // }
  // u_Size = u_SizeTmp;

  let u_ModelMatrixTmp = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  if (!u_ModelMatrixTmp) {
    console.log("Failed to get the storage location of u_ModelMatrix");
    return;
  }
  u_ModelMatrix = u_ModelMatrixTmp;

  // Set initial value for matrix
  let identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

  let u_GlobalRotateMatrixTmp = gl.getUniformLocation(
    gl.program,
    "u_GlobalRotateMatrix"
  );
  if (!u_GlobalRotateMatrixTmp) {
    console.log("Failed to get the storage location of u_ModelMatrix");
    return;
  }
  u_GlobalRotateMatrix = u_GlobalRotateMatrixTmp;
}

function convertCoordinatesEventToGL(ev: MouseEvent) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = (ev.target as HTMLElement).getBoundingClientRect();

  x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

  return [x, y];
}

function addActionsForHtmlUI() {
  // Button Events
  // let buttonRed = document.getElementById("b_red") as HTMLButtonElement;
  // buttonRed.onclick = () => {
  //   g_selectedColor = [1.0, 0.0, 0.0, 1.0];
  // };

  let sliderCameraAngle = document.getElementById(
    "slider_camera_angle"
  ) as HTMLInputElement;
  sliderCameraAngle.addEventListener("input", (event) => {
    g_globalAngle = Number((event.target as HTMLInputElement).value);
    renderScene();
  });

  let sliderJoint1 = document.getElementById(
    "slider_joint_1"
  ) as HTMLInputElement;
  sliderJoint1.addEventListener("input", (event) => {
    g_joint1Angle = Number((event.target as HTMLInputElement).value);
    renderScene();
  });

  let sliderJoint2 = document.getElementById(
    "slider_joint_2"
  ) as HTMLInputElement;
  sliderJoint2.addEventListener("input", (event) => {
    g_joint2Angle = Number((event.target as HTMLInputElement).value);
    renderScene();
  });

  let sliderJoint3 = document.getElementById(
    "slider_joint_3"
  ) as HTMLInputElement;
  sliderJoint3.addEventListener("input", (event) => {
    g_joint3Angle = Number((event.target as HTMLInputElement).value);
    renderScene();
  });

  let buttonToggleJoint1Animation = document.getElementById(
    "b_toggle_joint1_animation"
  ) as HTMLButtonElement;
  buttonToggleJoint1Animation.onclick = () => {
    g_joint1AnimationRunning = !g_joint1AnimationRunning;
  };

  let buttonToggleJoint2Animation = document.getElementById(
    "b_toggle_joint2_animation"
  ) as HTMLButtonElement;
  buttonToggleJoint2Animation.onclick = () => {
    g_joint2AnimationRunning = !g_joint2AnimationRunning;
  };

  let buttonToggleJoint3Animation = document.getElementById(
    "b_toggle_joint3_animation"
  ) as HTMLButtonElement;
  buttonToggleJoint3Animation.onclick = () => {
    g_joint3AnimationRunning = !g_joint3AnimationRunning;
  };
}

function main() {
  // Set up canvas and gl variables
  setupWebGL();
  // Set up shader programs and connect GLSL variables
  connectVariablesToGLSL();

  // Set up actions for HTML UI elements
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = (ev) => {
    if (ev.buttons == 1) {
      click(ev);
    }
  };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.15, 0.15, 0.7, 1.0);

  // Clear <canvas>
  // gl.clear(gl.COLOR_BUFFER_BIT);
  // renderScene();
  requestAnimationFrame(tick);
}

function click(ev: MouseEvent) {
  if (ev.shiftKey) {
    g_neckAnimating = !g_neckAnimating;
  } else {
    let [x, y] = convertCoordinatesEventToGL(ev);
    g_mouseRotY = x * 180;
    g_mouseRotX = y * 90;
  }
  renderScene();
}

let g_startTime = performance.now() / 1000;
let g_seconds = performance.now() / 1000 - g_startTime;

function tick() {
  g_seconds = performance.now() / 1000 - g_startTime;
  // console.log(g_seconds);
  updateAnimationAngles();
  renderScene();
  requestAnimationFrame(tick);
}

function updateAnimationAngles() {
  if (g_joint1AnimationRunning) {
    g_joint1Angle = Math.abs(15 * Math.sin(g_seconds));
  }
  if (g_joint2AnimationRunning) {
    g_joint2Angle = Math.abs(10 * Math.sin(g_seconds * 3));
  }
  if (g_joint3AnimationRunning) {
    g_joint3Angle = Math.abs(5 * Math.sin(g_seconds * 3));
  }
  if (g_neckAnimating) {
    g_neckAngle = 55 + 10 * Math.sin(g_seconds * 2);
  }
}

function renderScene() {
  const startTime = performance.now();

  let globalRotMat4 = new Matrix4()
    .rotate(g_globalAngle, 0, 1, 0)
    .rotate(g_mouseRotX, 1, 0, 0)
    .rotate(g_mouseRotY, 0, 1, 0);

  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat4.elements);

  // Clear <canvas>
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

  // var len = g_shapesList.length;
  // for (var i = 0; i < len; i++) {
  //   let shape = g_shapesList[i];
  //   shape.render();
  // }

  gl.uniform4f(u_FragColor, 1, 1, 1, 1);

  // prettier-ignore
  // drawTriangle3D(new Float32Array([-1,0,0, -0.5,-1,0, 0,0,0]))

  let body = new Cube();
  body.color = [0.1, 0.6, 0.1, 1];
  body.matrix.rotate(-5, 1, 0, 0);
  let bodyCoordsRotMat = new Matrix4(body.matrix);
  body.matrix.translate(-0.3, -0.2, 0);
  body.matrix.scale(1, 0.15, 0.8);
  let bodyCoordsMat = new Matrix4(body.matrix);
  body.render();

  let bodyTop = new Cube();
  bodyTop.color = [0.1, 0.6, 0.1, 1];
  bodyTop.matrix = new Matrix4(bodyCoordsMat);
  bodyTop.matrix.translate(0.1, 0.5, 0.1);
  bodyTop.matrix.scale(0.8, 0.8, 0.8);
  let bodyTopCoordsMat = new Matrix4(bodyTop.matrix);
  bodyTop.render();

  let curShellCoordsMat = bodyTopCoordsMat;
  for (let i = 0; i < 6; i++) {
    let sizeMod = i * 0.05;
    let bodyTopA = new Cube();
    bodyTopA.color = [0.1, 0.6, 0.1, 1];
    bodyTopA.matrix = curShellCoordsMat;
    bodyTopA.matrix.translate(0.1 + sizeMod / 2, 0.5, 0.1 + sizeMod / 2);
    bodyTopA.matrix.scale(0.8 - sizeMod, 0.8 - sizeMod, 0.8 - sizeMod);
    curShellCoordsMat = new Matrix4(bodyTopA.matrix);
    bodyTopA.render();
  }

  let bodyBottom = new Cube();
  bodyBottom.color = [0.7, 0.7, 0.7, 1];
  bodyBottom.matrix = new Matrix4(bodyCoordsMat);
  bodyBottom.matrix.translate(0.05, -0.3, 0.05);
  bodyBottom.matrix.scale(0.9, 0.3, 0.9);
  bodyBottom.render();

  let bodyBottomA = new Cube();
  bodyBottomA.color = [0.7, 0.7, 0.7, 1];
  bodyBottomA.matrix = new Matrix4(bodyCoordsMat);
  bodyBottomA.matrix.translate(0.075, -0.5, 0.1);
  bodyBottomA.matrix.scale(0.85, 0.3, 0.8);
  bodyBottomA.render();

  let neck = new Cube();
  neck.color = [0.6, 0.7, 0.6, 1];
  neck.matrix = new Matrix4(bodyCoordsRotMat);
  neck.matrix.translate(-0.23, -0.27, 0.3);
  neck.matrix.rotate(g_neckAngle, 0, 0, 1);
  let neckCoordsMat = new Matrix4(neck.matrix);
  neck.matrix.scale(0.08, 0.3, 0.19);
  neck.render();

  let head = new Cube();
  head.color = [0.6, 0.7, 0.6, 1];
  head.matrix = new Matrix4(neckCoordsMat);
  head.matrix.translate(-0.1, 0.35, -0.005);
  head.matrix.rotate(-g_neckAngle, 0, 0, 1);
  let headCoordsMat = new Matrix4(head.matrix);
  head.matrix.scale(0.2, 0.2, 0.2);
  head.render();

  let leftEye = new Cube();
  leftEye.color = [0.9, 0.9, 0.9, 1];
  leftEye.matrix = new Matrix4(headCoordsMat);
  leftEye.matrix.translate(0.06, 0.1, -0.01);
  let leftEyeCoordsMat = new Matrix4(leftEye.matrix);
  leftEye.matrix.scale(0.05, 0.05, 0.03);
  leftEye.render();

  let leftEyeA = new Cube();
  leftEyeA.color = [0.1, 0.1, 0.1, 1];
  leftEyeA.matrix = new Matrix4(leftEyeCoordsMat);
  leftEyeA.matrix.translate(0.005, 0.01, -0.015);
  leftEyeA.matrix.scale(0.025, 0.025, 0.02);
  leftEyeA.render();

  let rightEye = new Cube();
  rightEye.color = [0.9, 0.9, 0.9, 1];
  rightEye.matrix = new Matrix4(headCoordsMat);
  rightEye.matrix.translate(0.06, 0.1, 0.18);
  let rightEyeCoordsMat = new Matrix4(rightEye.matrix);
  rightEye.matrix.scale(0.05, 0.05, 0.03);
  rightEye.render();

  let rightEyeA = new Cube();
  rightEyeA.color = [0.1, 0.1, 0.1, 1];
  rightEyeA.matrix = new Matrix4(rightEyeCoordsMat);
  rightEyeA.matrix.translate(0.005, 0.01, 0.025);
  rightEyeA.matrix.scale(0.025, 0.025, 0.02);
  rightEyeA.render();

  // Top Left Arm
  let leftArm = new Cube();
  leftArm.color = [0.6, 0.7, 0.6, 1];
  leftArm.matrix = new Matrix4(bodyCoordsRotMat);
  leftArm.matrix.rotate(70 - g_joint1Angle, 0, 1, 0);
  leftArm.matrix.translate(-0.1, -0.25, -0.1);
  let leftArmCoordsMat = new Matrix4(leftArm.matrix);
  leftArm.matrix.scale(0.25, 0.1, 0.15);
  leftArm.render();

  let leftArmA = new Cube();
  leftArmA.color = [0.6, 0.7, 0.6, 1];
  leftArmA.matrix = new Matrix4(leftArmCoordsMat);
  leftArmA.matrix.translate(0.25, 0, 0);
  leftArmA.matrix.rotate(-20 - g_joint2Angle, 0, 1, 0);
  let leftArmACoordsMat = new Matrix4(leftArmA.matrix);
  leftArmA.matrix.scale(0.2, 0.1, 0.15);
  leftArmA.render();

  let leftArmB = new Cube();
  leftArmB.color = [0.6, 0.7, 0.6, 1];
  leftArmB.matrix = new Matrix4(leftArmACoordsMat);
  leftArmB.matrix.translate(0.2, 0, 0);
  leftArmB.matrix.rotate(-20 - g_joint3Angle, 0, 1, 0);
  leftArmB.matrix.scale(0.1, 0.1, 0.15);
  leftArmB.render();

  // Bot Right
  let botRightLeg = new Cube();
  botRightLeg.color = [0.6, 0.7, 0.6, 1];
  botRightLeg.matrix = new Matrix4(bodyCoordsRotMat);
  botRightLeg.matrix.translate(0.4, -0.25, 0.65);
  botRightLeg.matrix.rotate(-50 + g_joint2Angle, 0, 1, 0);
  botRightLeg.matrix.scale(0.25, 0.1, 0.15);
  botRightLeg.render();

  // Right Arm
  let rightArm = new Cube();
  rightArm.color = [0.6, 0.7, 0.6, 1];
  rightArm.matrix = new Matrix4(bodyCoordsRotMat);
  rightArm.matrix.translate(0, -0.25, 0.65);
  rightArm.matrix.rotate(-70 + g_joint1Angle, 0, 1, 0);
  let rightArmCoordsMat = new Matrix4(rightArm.matrix);
  rightArm.matrix.scale(0.25, 0.1, 0.15);
  rightArm.render();

  let rightArmA = new Cube();
  rightArmA.color = [0.6, 0.7, 0.6, 1];
  rightArmA.matrix = new Matrix4(rightArmCoordsMat);
  rightArmA.matrix.translate(0.175, 0, 0.014);
  rightArmA.matrix.rotate(20 + g_joint2Angle, 0, 1, 0);
  let rightArmACoordsMat = new Matrix4(rightArmA.matrix);
  rightArmA.matrix.scale(0.2, 0.1, 0.15);
  rightArmA.render();

  let rightArmB = new Cube();
  rightArmB.color = [0.6, 0.7, 0.6, 1];
  rightArmB.matrix = new Matrix4(rightArmACoordsMat);
  rightArmB.matrix.translate(0.135, 0, 0.013);
  rightArmB.matrix.rotate(20 + g_joint3Angle, 0, 1, 0);
  rightArmB.matrix.scale(0.1, 0.1, 0.15);
  rightArmB.render();

  // Bot Left Arm
  let botLeftArm = new Cube();
  botLeftArm.color = [0.6, 0.7, 0.6, 1];
  botLeftArm.matrix = new Matrix4(bodyCoordsRotMat);
  botLeftArm.matrix.translate(0.3, -0.25, 0.05);
  botLeftArm.matrix.rotate(50 - g_joint2Angle, 0, 1, 0);
  botLeftArm.matrix.scale(0.25, 0.1, 0.15);
  botLeftArm.render();

  let tail = new Cylinder(32);
  tail.color = [0.6, 0.7, 0.6, 1];
  tail.matrix = new Matrix4(bodyCoordsRotMat);
  tail.matrix.translate(0.71, -0.2, 0.4);
  tail.matrix.rotate(-80 - (g_neckAngle - 55) / 2, 0, 0, 1);
  tail.matrix.scale(0.08, 0.2, 0.1);
  tail.render();

  const duration = performance.now() - startTime;

  // Performance display
  sendTextToHTML(
    "ms: " + Math.floor(duration) + " fps: " + Math.floor(10000 / duration),
    "numdot"
  );
}

function sendTextToHTML(text: string, htmlID: string) {
  const htmlEl = document.getElementById(htmlID);
  if (!htmlEl) {
    console.log(`Error finding html element with ID: ${htmlID}`);
    return;
  }

  htmlEl.innerHTML = text;
}

main();
