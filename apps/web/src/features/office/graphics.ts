/** Below this the walk stutters and a phone heats up: the 2D screens are better than that. */
export const MIN_FPS = 18;
/** Below this, fewer pixels and no dust come before giving up on 3D. */
export const COMFORTABLE_FPS = 30;
/** Frames to skip while the scene settles, then frames to judge. */
const WARM_UP_FRAMES = 30;
const SAMPLE_FRAMES = 90;

/** Judges a first stretch of frames. Null while it is still too early to tell. */
export const isTooSlow = (frameSeconds: readonly number[], minFps = MIN_FPS): boolean | null => {
  if (frameSeconds.length < WARM_UP_FRAMES + SAMPLE_FRAMES) {
    return null;
  }
  const sample = frameSeconds.slice(WARM_UP_FRAMES, WARM_UP_FRAMES + SAMPLE_FRAMES);
  const seconds = sample.reduce((sum, frame) => sum + frame, 0);
  return sample.length / seconds < minFps;
};

let webGlSupport: boolean | null = null;

/**
 * The game must run without it: any failure here means the 2D screens. Asked once and the context
 * given back: browsers cap live contexts, and a new one per render killed the office's own.
 */
export const supportsWebGl = (): boolean => {
  if (webGlSupport === null) {
    try {
      const context = document.createElement('canvas').getContext('webgl2');
      webGlSupport = context !== null;
      context?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch {
      webGlSupport = false;
    }
  }
  return webGlSupport;
};
