---
name: core-parameters
description: Animation parameters including duration, delay, easing, loop, and callbacks
---

# Animation Parameters

Animation parameters control timing, behavior, and lifecycle of animations.

## Duration

Set animation duration in milliseconds:

```javascript
animate('.box', {
  x: 100,
  duration: 1000  // 1 second
});
```

## Delay

Add delay before animation starts:

```javascript
animate('.box', {
  x: 100,
  delay: 500  // Wait 500ms before starting
});
```

## Easing

Control animation acceleration:

```javascript
animate('.box', {
  x: 100,
  ease: 'inOutQuad'  // Built-in easing
});

// Common easings
ease: 'linear'
ease: 'inQuad', 'outQuad', 'inOutQuad'
ease: 'inCubic', 'outCubic', 'inOutCubic'
ease: 'inElastic', 'outElastic', 'inOutElastic'
ease: 'inBounce', 'outBounce', 'inOutBounce'
```

## Loop

Repeat animation:

```javascript
animate('.box', {
  x: 100,
  loop: true        // Infinite loop
});

animate('.box', {
  x: 100,
  loop: 3            // Loop 3 times
});

animate('.box', {
  x: 100,
  loop: true,
  alternate: true    // Alternate direction each loop
});
```

## Loop Delay

Delay between loop iterations:

```javascript
animate('.box', {
  x: 100,
  loop: true,
  loopDelay: 500  // 500ms pause between loops
});
```

## Direction

Control animation direction:

```javascript
animate('.box', {
  x: 100,
  direction: 'normal'   // Forward
});

animate('.box', {
  x: 100,
  direction: 'reverse'  // Backward
});

animate('.box', {
  x: 100,
  direction: 'alternate'  // Alternate each loop
});
```

## Autoplay

Control whether animation starts automatically:

```javascript
const anim = animate('.box', {
  x: 100,
  autoplay: false  // Don't start automatically
});

// Start manually
anim.play();
```

## Callbacks

### onUpdate

Called on each frame:

```javascript
animate('.box', {
  x: 100,
  onUpdate: (self) => {
    console.log(self.progress);  // 0 to 1
    console.log(self.currentTime);
  }
});
```

### onComplete

Called when animation completes:

```javascript
animate('.box', {
  x: 100,
  onComplete: (self) => {
    console.log('Animation complete');
  }
});
```

### onLoop

Called on each loop iteration:

```javascript
animate('.box', {
  x: 100,
  loop: 3,
  onLoop: (self) => {
    console.log('Loop', self.loopCount);
  }
});
```

### onBegin

Called when animation begins:

```javascript
animate('.box', {
  x: 100,
  onBegin: (self) => {
    console.log('Animation started');
  }
});
```

## Animation Control

```javascript
const anim = animate('.box', {
  x: 100,
  autoplay: false
});

// Control methods
anim.play();
anim.pause();
anim.restart();
anim.reverse();
anim.seek(500);  // Seek to 500ms

// Properties
anim.progress = 0.5;      // Set progress (0-1)
anim.currentTime = 1000;  // Set time in ms
anim.paused = true;       // Pause/play
```

## Key Points

- Duration is in milliseconds
- Delay adds wait time before animation starts
- Easing controls acceleration curve
- Loop can be boolean or number
- `alternate` reverses direction each loop
- `autoplay: false` prevents automatic start
- Callbacks provide lifecycle hooks
- Use animation instance methods for manual control

<!--
Source references:
- https://github.com/juliangarnier/anime
- https://animejs.com/documentation
-->
