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
  const { context, width, height } = options;

  let animationId: number = -1;
  let running: boolean = false;
  let lastFrame: DOMHighResTimeStamp = performance.timeOrigin;
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
    }
  }

  return {
    start: () => {
      startTime = performance.now();
      running = true;
      loop(startTime);
    },

    onFrame: (frameCallback: FrameCallback) => {
      callbacks.push(frameCallback);

      return () => {
        callbacks = callbacks.filter((f) => f === frameCallback);
      };
    },
    stop: () => {
      running = false;
    },
  };
};
