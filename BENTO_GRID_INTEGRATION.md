# Bento Grid Component Integration

## ✅ Completed Setup

The bento grid component has been successfully integrated into the SysNex homepage with the following setup:

### 1. Tailwind CSS Configuration
- ✅ Created `tailwind.config.js` with proper content paths
- ✅ Created `postcss.config.js` for PostCSS processing
- ✅ Created `src/styles/tailwind.css` with Tailwind directives
- ✅ Installed Tailwind CSS, PostCSS, and Autoprefixer
- ✅ Imported Tailwind CSS in `src/main.jsx`

### 2. Component Structure
- ✅ Created `/src/components/ui/` directory (shadcn-style structure)
- ✅ Created `bento-grid-01.jsx` component adapted for SysNex features
- ✅ Component uses framer-motion and lucide-react (already installed)

### 3. Integration
- ✅ Component integrated into `Home.jsx` page
- ✅ Positioned after Hero section for optimal visibility
- ✅ All dependencies verified (framer-motion@10.18.0, lucide-react@0.562.0)

## Component Features

The bento grid showcases SysNex features with animated cards:

1. **SysML v2 Native** - Typography animation showing "SysML"
2. **Flexible Layouts** - Adaptive grid layout animation
3. **Git-Native** - Global network animation
4. **Blazing Fast** - Speed indicator showing <50ms LSP latency
5. **Standards Compliant** - Security badge animation
6. **VS Code Integration** - Code editor icon animation

## File Structure

```
pages/sysnex-labs.github.io/
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
├── src/
│   ├── main.jsx                # Updated to import tailwind.css
│   ├── styles/
│   │   └── tailwind.css        # Tailwind directives
│   ├── components/
│   │   └── ui/                 # shadcn-style component directory
│   │       └── bento-grid-01.jsx
│   └── pages/
│       └── Home.jsx            # Updated to include FeaturesBentoGrid
```

## Running the Project

```bash
cd pages/sysnex-labs.github.io
npm run dev
```

The component will appear on the homepage after the Hero section.

## Customization

The component is fully customizable:
- Colors: Edit `tailwind.config.js` to change theme colors
- Content: Modify feature descriptions in `bento-grid-01.jsx`
- Layout: Adjust grid spans in the component JSX
- Animations: Tweak framer-motion animations as needed

## Notes

- The component uses Tailwind CSS classes, which are now available throughout the project
- All animations are optimized with `viewport={{ once: true }}` for performance
- The component is responsive and works on mobile devices
- Dark theme (zinc-950 background) matches SysNex branding

