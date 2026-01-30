---
name: createPortal
description: React DOM API for rendering children into different DOM nodes
---

# createPortal

`createPortal` lets you render some children into a different part of the DOM. Useful for modals, tooltips, and other overlays.

## Usage

```js
import { createPortal } from 'react-dom';

function Modal({ children, isOpen }) {
  if (!isOpen) return null;
  
  return createPortal(
    <div className="modal">
      {children}
    </div>,
    document.body
  );
}
```

### Basic structure

```js
createPortal(children, domNode, key?);
```

- `children`: React node to render
- `domNode`: DOM node to render into
- `key`: Optional key for the portal

## Key Points

- **Different DOM location**: Renders children in different DOM node
- **React tree preserved**: Still part of React component tree
- **Event bubbling**: Events bubble according to React tree, not DOM tree
- **Context access**: Can access parent context

## Common Patterns

### Modal dialog

```js
function Modal({ children, isOpen, onClose }) {
  if (!isOpen) return null;
  
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
}
```

### Tooltip

```js
function Tooltip({ children, content }) {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const ref = useRef(null);
  
  return (
    <>
      <div
        ref={ref}
        onMouseEnter={() => {
          const rect = ref.current.getBoundingClientRect();
          setPosition({ top: rect.bottom, left: rect.left });
          setShow(true);
        }}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      {show && createPortal(
        <div
          className="tooltip"
          style={{ position: 'fixed', ...position }}
        >
          {content}
        </div>,
        document.body
      )}
    </>
  );
}
```

### Dropdown menu

```js
function Dropdown({ children, menu }) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  
  return (
    <>
      <button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        {children}
      </button>
      {isOpen && createPortal(
        <div className="dropdown-menu">
          {menu}
        </div>,
        document.body
      )}
    </>
  );
}
```

## Event Handling

Events from portals bubble according to React tree:

```js
function App() {
  return (
    <div onClick={() => console.log('App clicked')}>
      <Modal>
        <button onClick={() => console.log('Button clicked')}>
          Click me
        </button>
      </Modal>
    </div>
  );
  // Clicking button logs both "Button clicked" and "App clicked"
}
```

## When to use createPortal

Use `createPortal` when:
- Rendering modals or dialogs
- Creating tooltips or popovers
- Building dropdown menus
- Need to escape parent container (z-index, overflow)

Don't use `createPortal` when:
- Regular component rendering is sufficient
- No need to escape parent container
- Simple nested components work fine

## Best Practices

- **Cleanup**: Always clean up portals when component unmounts
- **Accessibility**: Ensure portals are accessible (focus management, ARIA)
- **Event handling**: Be aware of event bubbling behavior
- **Performance**: Don't create unnecessary portals

<!--
Source references:
- https://react.dev/reference/react-dom/createPortal
-->
