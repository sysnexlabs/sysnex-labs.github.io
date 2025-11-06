# Sysnex Labs Corporate Design Style Guide

## Table of Contents
1. [Brand Identity](#brand-identity)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Logo Usage](#logo-usage)
5. [Spacing & Layout](#spacing--layout)
6. [Component Styles](#component-styles)
7. [Illustrations & Graphics](#illustrations--graphics)
8. [Accessibility](#accessibility)

---

## Brand Identity

**Sysnex Labs** specializes in Model-Based Systems Engineering (MBSE) with a focus on SysML v2, functional safety, and Git-based workflows. Our brand identity reflects precision, innovation, and technical excellence.

---

## Color Palette

### Primary Colors

#### Primary Brand Color (Cyan Blue)
- **Hex**: `#00ccff`
- **RGB**: `rgb(0, 204, 255)`
- **Usage**: Primary brand color - used for headings, navigation links, primary UI elements, and development/design phases in diagrams
- **CSS Variable**: `var(--turquoise)`

#### Secondary Brand Color (Aubergine/Magenta)
- **Hex**: `#C80064`
- **RGB**: `rgb(200, 0, 100)`
- **Usage**: Secondary brand color - used for hover states, call-to-action buttons, card titles, and verification/validation phases in diagrams. This is the aubergine/magenta color from the logo's right curve.
- **CSS Variable**: `var(--aubergine)`

#### Tertiary Highlight Color (Coral Orange)
- **Hex**: `#ff6600`
- **RGB**: `rgb(255, 102, 0)`
- **Usage**: Tertiary highlight color - used for special accents, highlights, and emphasis. Provides visual variety while maintaining brand consistency.
- **CSS Variable**: `var(--coral)`

### Background Colors

#### Dark Background
- **Hex**: `#0d0d0d`
- **RGB**: `rgb(13, 13, 13)`
- **Usage**: Primary background color for all pages
- **CSS Variable**: `var(--dark-bg)`

#### Light Text
- **Hex**: `#e6fdf8`
- **RGB**: `rgb(230, 253, 248)`
- **Usage**: Primary text color for readability on dark backgrounds
- **CSS Variable**: `var(--light-text)`

### Color Usage Guidelines

- **Primary color (`#00ccff`)**: Use for main navigation, headings (h1, h2), primary links, and development/design elements
- **Secondary color (`#C80064`)**: Use for hover states, interactive elements, card titles (h3), and verification/validation elements
- **Tertiary color (`#ff6600`)**: Use for special highlights, accents, and emphasis where additional visual variety is needed
- **Always maintain sufficient contrast** (WCAG AA minimum: 4.5:1 for normal text, 3:1 for large text)

### Color Opacity Variations

When using colors with transparency:
- **Subtle backgrounds**: `rgba(0, 204, 255, 0.03)` to `rgba(0, 204, 255, 0.06)`
- **Borders**: `rgba(0, 204, 255, 0.1)` to `rgba(0, 204, 255, 0.3)`
- **Hover effects**: `rgba(0, 204, 255, 0.4)` to `rgba(0, 204, 255, 0.6)`
- **Shadows/Glows**: `rgba(0, 204, 255, 0.15)` to `rgba(0, 204, 255, 0.3)`

---

## Typography

### Font Family

**Primary Font**: `Lexend Exa`
- **Weights**: 300 (Light), 400 (Regular), 600 (Semi-bold), 700 (Bold)
- **Fallback**: `system-ui, -apple-system, Segoe UI, Roboto, sans-serif`
- **Usage**: All text elements across the website

### Font Sizes

#### Headings
- **H1**: `clamp(2rem, 4.5vw, 3.2rem)` - Hero headings, main page titles
- **H2**: `clamp(1.75rem, 3vw, 2.5rem)` - Section headings
- **H3**: `1.5rem` - Subsection headings, card titles
- **H4**: `1.25rem` - Highlight card titles

#### Body Text
- **Base**: `1rem` (16px) - Default body text
- **Small**: `0.9rem` - Captions, metadata
- **Large**: `1.125rem` - Emphasized body text

### Typography Hierarchy

```css
/* Headings */
h1 { color: var(--turquoise); font-weight: 700; }
h2 { color: var(--turquoise); font-weight: 700; }
h3 { color: var(--aubergine); font-weight: 600; }

/* Body */
body { color: var(--light-text); font-weight: 400; }
```

### Line Heights
- **Headings**: `1.2` to `1.3`
- **Body text**: `1.6` to `1.8`
- **Lists**: `1.8`

---

## Logo Usage

### Logo Files

- **Full Logo (Dark)**: `assets/logo_dark.svg` or `assets/logo_dark.png` - For dark backgrounds
- **Icon Only (Black)**: `assets/logo_S_black.svg` or `assets/logo_S_black.png` - For navigation, small spaces
- **Icon Only (White)**: `assets/logo_S_white.svg` or `assets/logo_S_white.png` - For light backgrounds (if needed)
- **Favicon**: `assets/favicon.svg` or `assets/favicon.png` - Browser tab icon

### Logo Specifications

#### Navigation Logo
- **Height**: `56px`
- **Usage**: Top-left navigation bar
- **Hover Effect**: Scale to 1.15x with 5deg rotation, enhanced glow
- **Filter**: `drop-shadow(0 0 8px rgba(0, 204, 255, 0.3))`

#### Footer Logo
- **Height**: `22px`
- **Usage**: Footer branding
- **Hover Effect**: Scale to 1.1x

### Logo Guidelines

- ✅ **Do**: Use logo with sufficient padding (minimum 20px)
- ✅ **Do**: Maintain aspect ratio
- ✅ **Do**: Use appropriate logo variant for background
- ❌ **Don't**: Stretch or distort the logo
- ❌ **Don't**: Use logo smaller than 22px height
- ❌ **Don't**: Place logo on busy backgrounds without sufficient contrast

---

## Spacing & Layout

### Spacing Scale

- **XS**: `0.5rem` (8px) - Tight spacing
- **S**: `0.75rem` (12px) - Small gaps
- **M**: `1rem` (16px) - Base spacing
- **L**: `1.5rem` (24px) - Medium spacing
- **XL**: `2rem` (32px) - Large spacing
- **XXL**: `3rem` (48px) - Section spacing
- **XXXL**: `4rem` (64px) - Major section spacing

### Container Widths

- **Content Container**: `max-width: 960px` - Main content area
- **Benefits Grid**: `max-width: 1200px` - Wide content sections
- **Full Width**: `100%` - Hero sections, backgrounds

### Padding

- **Page Padding**: `1.25rem` (20px) - Standard page margins
- **Section Padding**: `2rem` to `5rem` - Vertical section spacing
- **Card Padding**: `1.25rem` (20px) - Internal card spacing

### Grid System

- **Feature Cards**: `repeat(auto-fit, minmax(280px, 1fr))` - Responsive grid
- **Highlight Cards**: `repeat(auto-fit, minmax(280px, 1fr))` - Responsive grid
- **Benefits Grid**: `repeat(auto-fit, minmax(280px, 1fr))` - Responsive grid

---

## Component Styles

### Buttons

#### Primary Button
```css
.btn.primary {
  background: var(--aubergine);
  color: #fff;
  border: 1px solid var(--aubergine);
  padding: 0.75rem 1.1rem;
  border-radius: 10px;
}
```
- **Hover**: Lighter aubergine (`#E0337A`), slight lift (`translateY(-2px)`)
- **Usage**: Main call-to-action buttons

#### Ghost Button
```css
.btn.ghost {
  border: 1px solid var(--turquoise);
  color: var(--turquoise);
  background: transparent;
  padding: 0.75rem 1.1rem;
  border-radius: 10px;
}
```
- **Hover**: Subtle background (`rgba(0, 204, 255, 0.08)`), slight lift
- **Usage**: Secondary actions

### Cards

#### Standard Card
- **Background**: `linear-gradient(180deg, rgba(0, 204, 255, 0.06), rgba(13, 13, 13, 0.9))`
- **Border**: `1px solid rgba(255, 255, 255, 0.08)`
- **Border Radius**: `12px`
- **Padding**: `1.25rem`
- **Hover**: Lift effect (`translateY(-4px)`), enhanced border color, top gradient line

#### Highlight Card
- **Background**: `linear-gradient(135deg, rgba(0, 204, 255, 0.06), rgba(13, 13, 13, 0.9))`
- **Border**: `1px solid rgba(0, 204, 255, 0.2)`
- **Left Accent**: 4px gradient line on hover
- **Title Color**: `var(--aubergine)`

### Navigation

- **Background**: `rgba(13, 13, 13, 0.85)` with backdrop blur
- **Link Color**: `var(--turquoise)`
- **Active/Hover**: `var(--aubergine)` with slight lift
- **Sticky**: Fixed to top with z-index: 10

### Forms & Inputs

- **Focus State**: `outline: 2px solid var(--turquoise)` with 4px offset
- **Border Radius**: `10px` for inputs, `12px` for containers

---

## Illustrations & Graphics

### SVG Diagrams

#### V-Model Diagram (`vmodel_diagram.svg`)
- **ViewBox**: `0 0 1400 900`
- **Colors**:
  - Development/Design: `#00ccff` (cyan blue - primary)
  - Verification/Validation: `#C80064` (aubergine/magenta - secondary)
  - Highlights/Accents: `#ff6600` (coral orange - tertiary)
  - Background: `#0d0d0d`
- **Font**: Lexend Exa
- **Arrow Markers**: 10x10px

#### Process Header (`process_header.svg`)
- **ViewBox**: `0 0 1200 450`
- **Colors**: Same as V-Model
- **Shows**: Shift Left quality model with animated curves

#### Tools Header (`tools_header.svg`)
- **ViewBox**: `0 0 1200 300`
- **Abstract**: VS Code-like development environment representation

### SVG Guidelines

- ✅ **Do**: Use consistent color palette (`#00ccff`, `#C80064`, `#ff6600`, `#0d0d0d`)
- ✅ **Do**: Use Lexend Exa font family
- ✅ **Do**: Maintain viewBox proportions
- ✅ **Do**: Include proper accessibility attributes
- ❌ **Don't**: Use colors outside the brand palette
- ❌ **Don't**: Use fonts other than Lexend Exa

### Image Guidelines

- **Format**: PNG for logos, SVG for diagrams
- **Optimization**: Compress images for web
- **Alt Text**: Always include descriptive alt text
- **Responsive**: Use `max-width: 100%` for responsive images

---

## Accessibility

### Color Contrast

- **Text on Dark Background**: Minimum 4.5:1 contrast ratio
- **Large Text**: Minimum 3:1 contrast ratio
- **Interactive Elements**: Clear focus states

### Focus States

All interactive elements must have visible focus indicators:
```css
:focus-visible {
  outline: 2px solid var(--turquoise);
  outline-offset: 4px;
  border-radius: 4px;
}
```

### ARIA Labels

- Navigation: `role="navigation"` with `aria-label`
- Headers: `role="banner"`
- Main content: `role="main"`
- Sections: Proper heading hierarchy (h1 → h2 → h3)

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Tab order should be logical
- Skip links for main content

### Reduced Motion

Respect user preferences:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Animation & Transitions

### Standard Transitions

- **Duration**: `0.3s` for most interactions
- **Easing**: `ease` for smooth transitions
- **Hover Effects**: Subtle transforms (`translateY(-2px)` to `translateY(-4px)`)

### Animation Guidelines

- ✅ **Do**: Use subtle, purposeful animations
- ✅ **Do**: Respect reduced motion preferences
- ✅ **Do**: Animate transforms and opacity (GPU-accelerated)
- ❌ **Don't**: Overuse animations
- ❌ **Don't**: Animate layout properties (width, height, margin)

---

## Responsive Design

### Breakpoints

- **Mobile**: `< 900px` - Single column layouts
- **Tablet**: `900px - 1200px` - Two column layouts
- **Desktop**: `> 1200px` - Multi-column layouts

### Mobile Considerations

- Navigation: Horizontal scroll or hamburger menu
- Grids: Stack to single column
- Typography: Use `clamp()` for fluid sizing
- Touch Targets: Minimum 44x44px

---

## Implementation Notes

### CSS Variables

All colors are defined as CSS variables in `:root`:
```css
:root {
  --turquoise: #00ccff;  /* Primary - cyan blue from logo left curve */
  --aubergine: #C80064;  /* Secondary - aubergine/magenta from logo right curve */
  --coral: #ff6600;      /* Tertiary - coral orange for highlights */
  --dark-bg: #0d0d0d;
  --light-text: #e6fdf8;
}
```

### Usage

Always use CSS variables instead of hardcoded colors:
- ✅ `color: var(--turquoise);`
- ❌ `color: #00ccff;`

### File Structure

```
/
├── index.html
├── about.html
├── methods.html
├── tools.html
├── process.html
├── contact.html
├── style.css
├── assets/
│   ├── logo_dark.png
│   ├── logo_S_black.png
│   ├── logo_S_white.png
│   ├── favicon.png
│   ├── vmodel_diagram.svg
│   ├── process_header.svg
│   └── tools_header.svg
└── STYLE_GUIDE.md (this file)
```

---

## Version History

- **v1.1** (Current): Updated to use aubergine/magenta (`#C80064`) as secondary color, matching the logo's right curve
- **v1.0**: Initial style guide with blueish cyan primary color (`#00ccff`)
- Colors aligned with `logo_dark.png` brand identity - logo features cyan blue left curve and aubergine/magenta right curve

---

## Contact

For questions about brand guidelines or design implementation, refer to the main website or contact the development team.

---

**Last Updated**: 2024
**Maintained by**: Sysnex Labs Development Team

