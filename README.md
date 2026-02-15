# with-ease-progress

[![npm version](https://img.shields.io/npm/v/with-ease-progress)](https://www.npmjs.com/package/with-ease-progress)
[![license](https://img.shields.io/npm/l/with-ease-progress)](LICENSE)
[![downloads](https://img.shields.io/npm/dm/with-ease-progress)](https://www.npmjs.com/package/with-ease-progress)

Smooth progress tracking for async tasks in JavaScript/TypeScript.

This small utility ensures a minimum progress duration and smooth updates, perfect for tracking task progress in a user-friendly way.

## Demo

<table>
  <tr>
    <td><b>Before</b></td>
    <td><b>After</b> <code>{ minDuration: 2000 } // 2s</code></td>
  </tr>
  <tr>
    <td>
      <img src="assets/before.gif" alt="Avant" width="320" />
    </td>
    <td>
      <img src="assets/after.gif" alt="Après" width="320" />
    </td>
  </tr>
</table>

## Installation

```bash
npm install with-ease-progress
# or
yarn add with-ease-progress
```

## Usage

### Direct

```typescript
import { withEaseProgress } from "with-ease-progress";

// Simulate an async task
await withEaseProgress(
  async (update) => {
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 100));
      update({ loaded: i, total: 100 });
    }
  },
  {
    minDuration: 2000,
    onProgress: (p) => console.log("Progress:", p + "%"),
  }
);

// Output:
//   Progress: 10%
//   Progress: 25%
//   Progress: 40%
//   ...
```

- `update` is a function that accepts an object `{ loaded: number, total: number }`
- `onProgress` is called with the smooth progress percentage
- `minDuration` ensures the progress bar moves smoothly even if the task finishes quickly

### Curryable (functional-friendly)

```typescript
const uploadWithProgress = withEaseProgress({
  minDuration: 1500,
  onProgress: p => console.log(p),
});

await uploadWithProgress(update => uploadFile(update));
```

### Features

- Works with any async task
- Smooth progress updates, prevents jumps
- Supports TypeScript and provides typings
- Functional-friendly / curryable usage
- ESM + CJS compatible

### License

MIT
