export type ProgressEventLike = {
  loaded?: number;
  total?: number;
};

export type ProgressHandler = (e: ProgressEventLike) => void;

export type Task<T> = (update: ProgressHandler) => Promise<T>;

export interface ProgressOptions {
  minDuration?: number;
  onProgress?: (percent: number) => void;
}

const DEFAULT_MIN_DURATION = 2000;

export function withProgress<T>(
  task: Task<T>,
  options?: ProgressOptions,
): Promise<T>;

export function withProgress(
  options: ProgressOptions,
): <T>(task: Task<T>) => Promise<T>;

export function withProgress<T>(
  arg1: Task<T> | ProgressOptions,
  arg2?: ProgressOptions,
) {
  if (typeof arg1 === "function") {
    return runWithProgress(arg1, arg2);
  }

  return <T>(task: Task<T>) => runWithProgress(task, arg1);
}

async function runWithProgress<T>(
  task: Task<T>,
  options: ProgressOptions = {},
): Promise<T> {
  const {
    minDuration = DEFAULT_MIN_DURATION,
    onProgress,
  } = options;

  const controller = onProgress
    ? createProgressController(minDuration, onProgress)
    : null;

  const startTime = Date.now();
  let result: T | undefined;
  let error: unknown;

  try {
    result = await task(controller?.updateReal ?? noop);
  } catch (e) {
    error = e;
  }

  const elapsed = Date.now() - startTime;
  const remaining = minDuration - elapsed;

  if (remaining > 0) {
    await sleep(remaining);
  }

  controller?.stop();

  if (error) throw error;
  return result as T;
}

function createProgressController(
  minDuration: number,
  onProgress: (p: number) => void,
) {
  const start = Date.now();
  let lastPercent = 0;

  const update = (realPercent = 0) => {
    const elapsed = Date.now() - start;

    const easedPercent = Math.min(
      99,
      Math.round((elapsed / minDuration) * 100),
    );

    const percent = Math.max(easedPercent, realPercent);

    if (percent > lastPercent && percent < 100) {
      lastPercent = percent;
      onProgress(percent);
    }
  };

  const interval = setInterval(update, 50);

  return {
    updateReal(event: ProgressEventLike) {
      const real = event.total
        ? Math.round((event.loaded! * 100) / event.total)
        : 0;

      update(real);
    },

    stop() {
      clearInterval(interval);
      onProgress(100);
    },
  };
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function noop() { }
