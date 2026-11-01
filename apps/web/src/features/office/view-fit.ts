export interface Frame {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface Size {
  width: number;
  height: number;
}

/** The shape the cameras were framed for. A narrower window sees the same width, smaller. */
const FRAMED_ASPECT = 1.6;
const MAX_FOV = 112;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/**
 * The canvas fills the screen, but only `frame` is free of HUD and panels. This keeps the camera's
 * shot inside that window: the picture still runs under the UI, where it shows through the edges.
 */
export const fitView = (fov: number, canvas: Size, frame: Frame) => {
  const narrowness = Math.max(1, FRAMED_ASPECT / (frame.width / frame.height));
  const half = Math.tan(toRadians(fov) / 2) * narrowness * (canvas.height / frame.height);
  return {
    fov: Math.min(MAX_FOV, ((2 * Math.atan(half)) / Math.PI) * 180),
    offsetX: canvas.width / 2 - (frame.left + frame.width / 2),
    offsetY: canvas.height / 2 - (frame.top + frame.height / 2),
  };
};
