import { canvas } from "./asg3";

export function convertCoordinatesEventToGL(ev: MouseEvent) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = (ev.target as HTMLElement).getBoundingClientRect();

  x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

  return [x, y];
}

export function sendTextToHTML(text: string, htmlID: string) {
  const htmlEl = document.getElementById(htmlID);
  if (!htmlEl) {
    console.log(`Error finding html element with ID: ${htmlID}`);
    return;
  }

  htmlEl.innerHTML = text;
}
