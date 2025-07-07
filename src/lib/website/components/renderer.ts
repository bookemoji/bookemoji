import { debounce } from "../renderer-utils.js";

type CreateRendererOptions = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
};

export type TimeInfo = {
  time: DOMHighResTimeStamp;
  seconds: number;
  delta: number;
  deltaMS: number;
};

type FrameCallback = (time: TimeInfo, context: CanvasRenderingContext2D) => void;

export const createRenderer = (options: CreateRendererOptions) => {
  const { context, width: initialWidth, height: initialHeight } = options;

  let width: number = initialWidth;
  let height: number = initialHeight;

  let animationId: number;
  let running: boolean = false;
  const lastFrame: DOMHighResTimeStamp = performance.timeOrigin;
  let startTime: DOMHighResTimeStamp = performance.timeOrigin;

  let callbacks: FrameCallback[] = [];

  function frame(timeInfo: TimeInfo) {
    context.clearRect(0, 0, width, height);
    callbacks.forEach((cb) => cb(timeInfo, context));
  }

  function loop(time: DOMHighResTimeStamp) {
    const delta = time - lastFrame;
    const deltaMS = delta / 1000;
    frame({
      delta,
      deltaMS,
      time,
      seconds: time / 1000,
    });

    if (running) {
      animationId = window.requestAnimationFrame(loop);
    } else {
      window.cancelAnimationFrame(animationId);
    }
  }

  const start = () => {
    startTime = performance.now();
    running = true;
    loop(startTime);
  };

  const stop = () => {
    running = false;
  };

  return {
    isRunning: () => running,
    start,

    onFrame: (frameCallback: FrameCallback) => {
      callbacks.push(frameCallback);

      return () => {
        callbacks = callbacks.filter((f) => f === frameCallback);
      };
    },

    onResize: (callback: (width: number, height: number) => void | Promise<void>) => {
      let wasRunningBeforeResize: boolean = running;
      const dbCallback = debounce(() => {
        width = window.innerWidth;
        height = window.innerHeight;
        callback(width, height);
        if (wasRunningBeforeResize) {
          start();
        }
      }, 150);

      const cb = () => {
        if (running) {
          wasRunningBeforeResize = true;
          stop();
        }

        dbCallback();
      };

      window.addEventListener("resize", cb);
      return () => {
        window.removeEventListener("resize", cb);
      };
    },
    stop,
  };
};
