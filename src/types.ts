import { Circle } from "./primitives/circle";
import { Point } from "./primitives/point";
import { Triangle } from "./primitives/triangle";

// Types
export type Coordinate = [number, number, number?];
export type Color = [number, number, number, number];
export type DrawableShapes = "triangle" | "point" | "circle";
export type Shape = Point | Triangle | Circle;

// Save system
export type SaveType = { shapesList: Shape[] };

// Note: This type definition was generated with AI (for download function)
declare global {
  interface Navigator {
    msSaveOrOpenBlob?: (blob: Blob, defaultName?: string) => boolean;
  }
}
