import {
  g_joint1Angle,
  g_joint2Angle,
  g_joint3Angle,
  g_neckAngle,
} from "../asg3";
import { Cube } from "../primitives/cube";
import { Cylinder } from "../primitives/cylinder";
import { Matrix4, Vector3 } from "../lib/cuon-matrix-cse160";

export class Turtle {
  position: Vector3;

  constructor(position: Vector3 = new Vector3([0, 0, 0])) {
    this.position = position;
  }

  render() {
    let body = new Cube();
    const position = this.position.elements;
    body.color = [0.1, 0.6, 0.1, 1];
    // body.matrix.rotate(-5, 1, 0, 0);
    let bodyCoordsRotMat = new Matrix4(body.matrix);
    body.matrix.translate(
      -0.3 + position[0],
      -0.2 + position[1],
      0 + position[2]
    );
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
    neck.matrix.translate(
      -0.23 + position[0],
      -0.27 + position[1],
      0.3 + position[2]
    );
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
    leftArm.matrix.translate(
      -0.1 + position[0],
      -0.25 + position[1],
      -0.1 + position[2]
    );
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
    botRightLeg.matrix.translate(
      0.4 + position[0],
      -0.25 + position[1],
      0.65 + position[2]
    );
    botRightLeg.matrix.rotate(-50 + g_joint2Angle, 0, 1, 0);
    botRightLeg.matrix.scale(0.25, 0.1, 0.15);
    botRightLeg.render();

    // Right Arm
    let rightArm = new Cube();
    rightArm.color = [0.6, 0.7, 0.6, 1];
    rightArm.matrix = new Matrix4(bodyCoordsRotMat);
    rightArm.matrix.translate(
      0 + position[0],
      -0.25 + position[1],
      0.65 + position[2]
    );
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
    botLeftArm.matrix.translate(
      0.3 + position[0],
      -0.25 + position[1],
      0.05 + position[2]
    );
    botLeftArm.matrix.rotate(50 - g_joint2Angle, 0, 1, 0);
    botLeftArm.matrix.scale(0.25, 0.1, 0.15);
    botLeftArm.render();

    let tail = new Cylinder(32);
    tail.color = [0.6, 0.7, 0.6, 1];
    tail.matrix = new Matrix4(bodyCoordsRotMat);
    tail.matrix.translate(
      0.71 + position[0],
      -0.2 + position[1],
      0.4 + position[2]
    );
    tail.matrix.rotate(-80 - (g_neckAngle - 55) / 2, 0, 0, 1);
    tail.matrix.scale(0.08, 0.2, 0.1);
    tail.render();
  }
}
