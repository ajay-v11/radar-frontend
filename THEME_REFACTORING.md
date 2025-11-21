# Theme Refactoring Guide

## Current Theme Variables Available

Your `globals.css` already has these CSS custom properties defined:

### Colors
- `--primary` - Orange color (oklch(0.7686 0.1647 70.0804)) - Use for main brand color
- `--primary-foreground` - Text on primary background
- `--background` - Main background color
- `--foreground` - Main text color
- `--card` - Card background
- `--card-foreground` - Card text
- `--muted` - Muted background
- `--muted-foreground` - Muted text
- `--accent` - Accent color
- `--border` - Border color
- `--destructive` - Error/destructive color
- `--ring` - Focus ring color

## Recommended Replacements

### Replace Hardcoded Colors with Tailwind Classes

#### Orange Colors (#f59e0b, #d97706)
Replace with: `bg-primary`, `text-primary`, `border-primary`, `hover:bg-primary/90`

#### Black/Dark Backgrounds (#0a0f0d, #000, bg-black)
Replace with: `bg-background`

#### White/Light Text (#fefefe, #fff, text-white)
Replace with: `text-foreground` or `text-primary-foreground`

#### Gray Text (#gray-300, #gray-400, #gray-500)
Replace with: `text-muted-foreground`

#### Zinc Backgrounds (bg-zinc-900, bg-zinc-800)
Replace with: `bg-card` or `bg-muted`

#### Zinc Borders (border-zinc-800, border-zinc-700)
Replace with: `border-border`

## Files That Need Updating

### High Priority (User-facing components)
1. `src/components/dashboard/CompanyInput.tsx`
2. `src/components/dashboard/ModelSelector.tsx`
3. `src/components/dashboard/VisibilityReport.tsx`
4. `src/components/landing/Hero.tsx`
5. `src/components/landing/Features.tsx`

### Medium Priority (UI components)
6. `src/components/ui/hover-border-gradient.tsx`
7. `src/components/ui/glowing-stars.tsx`
8. `src/components/ui/hero-highlight.tsx`
9. `src/components/dashboard/LoadingWizard.tsx`

## Example Refactoring

### Before:
```tsx
<div className="bg-black text-white border-zinc-800">
  <h1 className="text-[#f59e0b]">RADAR</h1>
  <p className="text-gray-400">Description</p>
  <button className="bg-orange-500 hover:bg-orange-600 text-black">
    Click me
  </button>
</div>
```

### After:
```tsx
<div className="bg-background text-foreground border-border">
  <h1 className="text-primary">RADAR</h1>
  <p className="text-muted-foreground">Description</p>
  <button className="bg-primary hover:bg-primary/90 text-primary-foreground">
    Click me
  </button>
</div>
```

## Benefits
- ✅ Consistent theming across the app
- ✅ Easy to switch themes (light/dark)
- ✅ Centralized color management
- ✅ Better maintainability
- ✅ Automatic dark mode support

## Next Steps
Would you like me to:
1. Update all components to use CSS variables?
2. Update specific components first?
3. Create a custom orange theme configuration?
