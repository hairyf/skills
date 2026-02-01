---
name: core-timeline
description: Create sequential and parallel animations with timeline control
---

# Timeline

Timelines allow you to create complex animation sequences with precise timing control. You can chain animations, add labels, and control playback.

## Creating a Timeline

```javascript
import { createTimeline } from 'animejs';

const tl = createTimeline({
  autoplay: true,
  loop: false
});
```

## Adding Animations

Use `.add()` to add animations to the timeline:

```javascript
const tl = createTimeline();

tl.add('.box1', {
  translateX: 320,
  duration: 1000
})
.add('.box2', {
  translateY: 100,
  duration: 500
});
```

## Timeline Position

Control when animations start relative to the timeline:

```javascript
// Start at specific time (ms)
tl.add('.box', { x: 100 }, 500);

// Start relative to previous animation
tl.add('.box', { x: 100 }, '+=200');  // 200ms after previous
tl.add('.box', { x: 100 }, '-=100');  // 100ms before previous ends

// Start at same time as previous
tl.add('.box', { x: 100 }, '<');      // Start when previous starts
tl.add('.box', { x: 100 }, '<<');     // Start when previous starts (absolute)

// Start after previous ends
tl.add('.box', { x: 100 }, '>');      // Start when previous ends
tl.add('.box', { x: 100 }, '>>');     // Start when previous ends (absolute)
```

## Labels

Use labels to mark positions in the timeline:

```javascript
tl.label('start')
  .add('.box1', { x: 100 })
  .label('middle')
  .add('.box2', { y: 100 })
  .add('.box3', { x: 200 }, 'middle+=200'); // Start 200ms after 'middle' label
```

## Timeline Methods

```javascript
const tl = createTimeline();

// Control playback
tl.play();
tl.pause();
tl.restart();
tl.reverse();

// Seek to position
tl.progress = 0.5;  // 50% through timeline
tl.currentTime = 1000;  // Seek to 1000ms

// Loop control
tl.loop = 3;  // Loop 3 times
tl.loop = true;  // Infinite loop
tl.loopDelay = 500;  // 500ms delay between loops

// Callbacks
tl.onUpdate = (self) => console.log(self.progress);
tl.onComplete = () => console.log('Done');
tl.onLoop = (self) => console.log('Loop', self.loopCount);
```

## Nested Timelines

Add timelines to other timelines:

```javascript
const childTl = createTimeline();
childTl.add('.box', { x: 100 });

const parentTl = createTimeline();
parentTl.add(childTl, { progress: 1 }, 500);
```

## Defaults

Set default values for all animations in a timeline:

```javascript
const tl = createTimeline({
  defaults: {
    duration: 1000,
    ease: 'inOutQuad',
    loop: false
  }
});

tl.add('.box', { x: 100 });  // Uses defaults
```

## Additional Methods

- **`tl.sync(animation, position?)`** — Add a WAAPI or Timer so the timeline follows its progress (e.g. `tl.sync(waapiAnim, 0)`). Pauses the synced object; timeline drives playback.
- **`tl.set(targets, params, position?)`** — Apply values instantly (0-duration replace). Same params as `add()` but no animation.
- **`tl.call(callback, position?)`** — Run a function at a position: `tl.call(() => console.log('hit'), 500)`.
- **`tl.remove(targets, propertyName?)`** — Remove targets (and optionally a property) from the timeline.
- **`tl.stretch(newDuration)`** — Scale timeline duration; child durations and labels scale proportionally.
- **`tl.refresh()`** — Recompute timeline duration from children (e.g. after adding/removing).

## Key Points

- Use `createTimeline()` to create a timeline
- Chain animations with `.add()`
- Use position strings (`+=`, `-=`, `<`, `>`) for relative timing
- Labels provide named positions for complex sequences
- Set `autoplay: false` to control when timeline starts
- Use `.init()` to start the timeline manually
- Nested timelines allow complex animation hierarchies

<!--
Source references:
- https://github.com/juliangarnier/anime
- https://animejs.com/documentation
-->
