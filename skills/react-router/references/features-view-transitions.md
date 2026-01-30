---
name: features-view-transitions
description: Smooth page transitions using View Transitions API
---

# View Transitions

Enable smooth animations between page transitions using the View Transitions API.

## Basic View Transition

### Enable on Links

Add `viewTransition` prop to `Link` or `NavLink`:

```tsx
<Link to="/about" viewTransition>
  About
</Link>
```

This provides a basic cross-fade animation between pages.

### Enable on Programmatic Navigation

Use `viewTransition: true` option with `useNavigate`:

```tsx
import { useNavigate } from "react-router";

function NavigationButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() =>
        navigate("/about", { viewTransition: true })
      }
    >
      About
    </button>
  );
}
```

## Image Gallery Example

### 1. Create Gallery Route

```tsx filename=routes/image-gallery.tsx
import { NavLink } from "react-router";

export const images = [
  "https://example.com/image1.jpg",
  "https://example.com/image2.jpg",
];

export default function ImageGalleryRoute() {
  return (
    <div className="image-list">
      <h1>Image List</h1>
      <div>
        {images.map((src, idx) => (
          <NavLink
            key={src}
            to={`/image/${idx}`}
            viewTransition
          >
            <p>Image Number {idx}</p>
            <img src={src} />
          </NavLink>
        ))}
      </div>
    </div>
  );
}
```

### 2. Add Transition Styles

Assign `view-transition-name` to elements:

```css
/* Assign names during navigation */
.image-list a.transitioning img {
  view-transition-name: image-expand;
}

.image-list a.transitioning p {
  view-transition-name: image-title;
}
```

### 3. Create Detail Route

Use matching transition names:

```tsx filename=routes/image-details.tsx
import { Link } from "react-router";
import { images } from "./home";
import type { Route } from "./+types/image-details";

export default function ImageDetailsRoute({
  params,
}: Route.ComponentProps) {
  return (
    <div className="image-detail">
      <Link to="/" viewTransition>Back</Link>
      <h1>Image Number {params.id}</h1>
      <img src={images[Number(params.id)]} />
    </div>
  );
}
```

### 4. Match Transition Names

```css
.image-detail h1 {
  view-transition-name: image-title;
}

.image-detail img {
  view-transition-name: image-expand;
}
```

## Advanced Usage

### Using Render Props

```tsx
<NavLink to={`/image/${idx}`} viewTransition>
  {({ isTransitioning }) => (
    <>
      <p
        style={{
          viewTransitionName: isTransitioning
            ? "image-title"
            : "none",
        }}
      >
        Image Number {idx}
      </p>
      <img
        src={src}
        style={{
          viewTransitionName: isTransitioning
            ? "image-expand"
            : "none",
        }}
      />
    </>
  )}
</NavLink>
```

### Using useViewTransitionState Hook

```tsx
import { useViewTransitionState, Link } from "react-router";

function NavImage({ src, idx }) {
  const href = `/image/${idx}`;
  const isTransitioning = useViewTransitionState(href);

  return (
    <Link to={href} viewTransition>
      <p
        style={{
          viewTransitionName: isTransitioning
            ? "image-title"
            : "none",
        }}
      >
        Image Number {idx}
      </p>
      <img
        src={src}
        style={{
          viewTransitionName: isTransitioning
            ? "image-expand"
            : "none",
        }}
      />
    </Link>
  );
}
```

## Key Points

- Add `viewTransition` prop to `Link`, `NavLink`, or `Form`
- Use `viewTransition: true` option with `useNavigate()`
- Assign `view-transition-name` CSS property to elements
- Match transition names between routes for seamless animation
- Use `isTransitioning` from render props or `useViewTransitionState()` hook
- Provides cross-fade by default, customize with CSS

<!--
Source references:
- https://reactrouter.com/how-to/view-transitions
- https://api.reactrouter.com/v7/functions/react-router.useViewTransitionState.html
-->
