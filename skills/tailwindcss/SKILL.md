---
name: tailwindcss
description: Tailwind CSS utility-first CSS framework. Use when styling web applications with utility classes, building responsive designs, or customizing design systems with theme variables.
metadata:
  author: Hairyf
  version: "2026.1.28"
  source: Generated from https://github.com/tailwindlabs/tailwindcss.com, scripts located at https://github.com/hairyf/skills
---

# Tailwind CSS

> The skill is based on Tailwind CSS v4.1.18, generated at 2026-01-28.

Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces. Instead of writing custom CSS, you compose designs using utility classes directly in your markup. Tailwind v4 introduces CSS-first configuration with theme variables, making it easier to customize your design system.

## Core References

| Topic | Description | Reference |
|-------|-------------|-----------|
| Utility Classes | Understanding Tailwind's utility-first approach and styling elements | [core-utility-classes](references/core-utility-classes.md) |
| Theme Variables | Design tokens, customizing theme, and theme variable namespaces | [core-theme](references/core-theme.md) |
| Responsive Design | Mobile-first breakpoints, responsive variants, and container queries | [core-responsive](references/core-responsive.md) |
| Variants | Applying utilities conditionally with state, pseudo-class, and media query variants | [core-variants](references/core-variants.md) |
| Preflight | Tailwind's base styles and how to extend or disable them | [core-preflight](references/core-preflight.md) |

## Features

### Dark Mode

| Topic | Description | Reference |
|-------|-------------|-----------|
| Dark Mode | Implementing dark mode with the dark variant and custom strategies | [features-dark-mode](references/features-dark-mode.md) |

### Customization

| Topic | Description | Reference |
|-------|-------------|-----------|
| Custom Styles | Adding custom styles, utilities, variants, and working with arbitrary values | [features-custom-styles](references/features-custom-styles.md) |
| Functions & Directives | Tailwind's CSS directives and functions for working with your design system | [features-functions-directives](references/features-functions-directives.md) |
| Content Detection | How Tailwind detects classes and how to customize content scanning | [features-content-detection](references/features-content-detection.md) |

## Key Recommendations

- **Use utility classes directly in markup** - Compose designs by combining utilities
- **Customize with theme variables** - Use `@theme` directive to define design tokens
- **Mobile-first responsive design** - Use unprefixed utilities for mobile, prefixed for breakpoints
- **Use complete class names** - Never construct classes dynamically with string interpolation
- **Leverage variants** - Stack variants for complex conditional styling
- **Prefer CSS-first configuration** - Use `@theme`, `@utility`, and `@custom-variant` over JavaScript configs
