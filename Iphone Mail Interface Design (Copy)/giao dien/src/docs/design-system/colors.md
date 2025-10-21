# Color System
## Liquid Glass iOS 26 Design System

---

## Primary Colors

### iOS Blue (Primary Action Color)
```tsx
#007AFF
```
**Usage:**
- Primary buttons
- Links và interactive text
- Active states
- Icon colors for primary actions
- Navigation elements

**Tailwind class:**
```tsx
text-[#007AFF]
bg-[#007AFF]
border-[#007AFF]
```

---

## Text Colors

### Color Palette
```tsx
// Primary Text
--text-primary: #000000 (black)
text-black

// Secondary Text
--text-secondary: #717182
text-gray-800

// Tertiary Text (metadata, timestamps)
--text-tertiary: #8E8E93
text-gray-500

// Disabled/Placeholder Text
--text-disabled: #C7C7CC
text-gray-400
placeholder:text-gray-400

// Link/Action Text
--text-action: #007AFF
text-[#007AFF]

// Destructive Text
--text-destructive: #DC2626
text-red-600

// Success Text
--text-success: #16A34A
text-green-600

// Warning Text
--text-warning: #EA580C
text-orange-600
```

### Usage Examples
```tsx
// Headings
<h2 className="text-[17px] text-black">Heading</h2>

// Body text
<p className="text-[15px] text-gray-800">Body content</p>

// Metadata
<span className="text-[13px] text-gray-500">2 giờ trước</span>

// Actions
<button className="text-[17px] text-[#007AFF]">Button</button>

// Destructive
<button className="text-[15px] text-red-600">Delete</button>
```

---

## Background Colors

### Gradient Backgrounds

#### Main Background
```tsx
bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50
```
**Hex values:**
- `blue-50`: #EFF6FF
- `purple-50`: #FAF5FF
- `pink-50`: #FDF2F8

#### Overlay Gradient
```tsx
bg-gradient-to-br from-white/40 via-blue-100/30 to-purple-100/30
```
**Hex values:**
- `blue-100`: #DBEAFE (at 30% opacity)
- `white`: #FFFFFF (at 40% opacity)
- `purple-100`: #F3E8FF (at 30% opacity)

#### Blur Orb Colors
```tsx
// Blue orb
bg-blue-300/20    // #93C5FD at 20% opacity

// Purple orb
bg-purple-300/20  // #D8B4FE at 20% opacity

// Pink orb
bg-pink-200/10    // #FBCFE8 at 10% opacity
```

### Surface Backgrounds

#### Glass Surfaces
```tsx
// Primary Surface (30% white)
bg-white/30 backdrop-blur-xl
border border-white/40

// Secondary Surface (20% white) - for nested items
bg-white/20 backdrop-blur-xl
border border-white/30

// Header Surface (70% white) - more solid
bg-white/70 backdrop-blur-2xl
border-b border-gray-200/50

// Modal Surface (90% white) - most solid
bg-white/90 backdrop-blur-2xl
border border-white/50
```

#### Active/Hover States
```tsx
active:bg-white/20     // List items
active:bg-gray-200/50  // Icon buttons
active:bg-gray-100/50  // Modal buttons
hover:bg-gray-100/50   // Desktop hover
```

---

## Avatar & Category Colors

### Avatar Gradients
```tsx
const AVATAR_COLORS = {
  blue: "bg-gradient-to-br from-blue-400 to-blue-600",
  pink: "bg-gradient-to-br from-pink-400 to-pink-600",
  purple: "bg-gradient-to-br from-purple-400 to-purple-600",
  green: "bg-gradient-to-br from-green-400 to-green-600",
  orange: "bg-gradient-to-br from-orange-400 to-orange-600",
  teal: "bg-gradient-to-br from-teal-400 to-teal-600",
  indigo: "bg-gradient-to-br from-indigo-400 to-indigo-600",
  red: "bg-gradient-to-br from-red-400 to-red-600",
}
```

**Hex values:**
```tsx
// Blue
from-blue-400: #60A5FA
to-blue-600: #2563EB

// Pink
from-pink-400: #F472B6
to-pink-600: #DB2777

// Purple
from-purple-400: #C084FC
to-purple-600: #9333EA

// Green
from-green-400: #4ADE80
to-green-600: #16A34A

// Orange
from-orange-400: #FB923C
to-orange-600: #EA580C
```

**Usage:**
```tsx
<div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-sm">
  <span className="text-white text-[17px]">NA</span>
</div>
```

---

## Status & Semantic Colors

### Priority Colors
```tsx
const PRIORITY_COLORS = {
  high: {
    text: "text-orange-600",        // #EA580C
    bg: "bg-orange-500/10",         // #F97316 at 10%
    icon: "text-orange-600",
  },
  medium: {
    text: "text-blue-600",          // #2563EB
    bg: "bg-blue-500/10",           // #3B82F6 at 10%
    icon: "text-blue-600",
  },
  low: {
    text: "text-gray-600",          // #4B5563
    bg: "bg-gray-500/10",           // #6B7280 at 10%
    icon: "text-gray-600",
  },
}
```

**Usage:**
```tsx
<div className="flex items-center gap-3">
  <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
    <Flag className="w-4 h-4 text-orange-600" />
  </div>
  <div className="text-[15px] text-orange-600">Cao</div>
</div>
```

### Action Colors
```tsx
const ACTION_COLORS = {
  primary: {
    bg: "bg-[#007AFF]",
    text: "text-white",
    hover: "hover:bg-blue-700",
    active: "active:scale-98",
  },
  secondary: {
    bg: "bg-white/30 backdrop-blur-xl",
    text: "text-black",
    border: "border border-white/40",
    active: "active:bg-white/40",
  },
  destructive: {
    bg: "bg-red-500/20",
    text: "text-red-600",
    border: "border border-red-300/40",
    active: "active:bg-red-500/30",
  },
  disabled: {
    bg: "bg-gray-300",
    text: "text-gray-500",
    cursor: "cursor-not-allowed",
  },
}
```

### Status Colors
```tsx
const STATUS_COLORS = {
  success: {
    bg: "bg-green-500/10",
    text: "text-green-600",       // #16A34A
    icon: "text-green-600",
  },
  warning: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-600",      // #CA8A04
    icon: "text-yellow-600",
  },
  error: {
    bg: "bg-red-500/10",
    text: "text-red-600",         // #DC2626
    icon: "text-red-600",
  },
  info: {
    bg: "bg-blue-500/10",
    text: "text-blue-600",        // #2563EB
    icon: "text-[#007AFF]",
  },
}
```

---

## Tag & Badge Colors

### Color Variants
```tsx
const TAG_COLORS = {
  blue: "bg-blue-500/20 text-blue-700",       // #3B82F6 at 20%, #1D4ED8
  purple: "bg-purple-500/20 text-purple-700", // #A855F7 at 20%, #7E22CE
  pink: "bg-pink-500/20 text-pink-700",       // #EC4899 at 20%, #BE185D
  green: "bg-green-500/20 text-green-700",    // #22C55E at 20%, #15803D
  orange: "bg-orange-500/20 text-orange-700", // #F97316 at 20%, #C2410C
  teal: "bg-teal-500/20 text-teal-700",       // #14B8A6 at 20%, #0F766E
  indigo: "bg-indigo-500/20 text-indigo-700", // #6366F1 at 20%, #4338CA
  red: "bg-red-500/20 text-red-700",          // #EF4444 at 20%, #B91C1C
}
```

**Usage:**
```tsx
<span className="px-2 py-1 bg-blue-500/20 text-blue-700 text-[12px] rounded-full">
  Design
</span>
```

---

## Icon Background Colors

### Colored Circle Backgrounds
```tsx
const ICON_BG_COLORS = {
  calendar: "bg-blue-500/10 text-[#007AFF]",
  users: "bg-purple-500/10 text-purple-600",
  tag: "bg-pink-500/10 text-pink-600",
  flag: "bg-orange-500/10 text-orange-600",
  message: "bg-blue-500/10 text-[#007AFF]",
  delete: "bg-red-500/10 text-red-600",
  success: "bg-green-500/10 text-green-600",
}
```

**Usage:**
```tsx
<div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
  <Calendar className="w-4 h-4 text-[#007AFF]" />
</div>
```

---

## Border Colors

### Standard Borders
```tsx
// Glass surface borders
border-white/40      // Primary surfaces
border-white/30      // Secondary surfaces
border-white/50      // Modals

// Dividers
border-gray-200/50   // List item separators, header borders

// Colored borders
border-red-300/40    // Destructive elements
border-blue-300/40   // Info elements
```

**Usage:**
```tsx
// Card border
<div className="border border-white/40">

// List separator
<div className="border-b border-gray-200/50 last:border-b-0">

// Modal border
<div className="border border-white/50">
```

---

## Shadow Colors

### Shadow Definitions
```tsx
// Soft shadows for cards
shadow-xl shadow-black/5     // Most common

// Medium shadows
shadow-lg shadow-black/5

// Button shadows with color
shadow-lg shadow-blue-500/30  // Primary button shadow

// Modal shadows
shadow-2xl                    // No custom color needed
```

**Usage:**
```tsx
// Card
<div className="shadow-xl shadow-black/5">

// Primary button
<button className="shadow-lg shadow-blue-500/30">

// Modal
<div className="shadow-2xl">
```

---

## Special Effects

### Like Button Colors
```tsx
// Unliked state
<Heart className="w-5 h-5 text-gray-500" />
<span className="text-[13px] text-gray-500">{count}</span>

// Liked state
<Heart className="w-5 h-5 fill-red-500 text-red-500" />
<span className="text-[13px] text-red-500">{count}</span>
```

### Progress Bar Gradient
```tsx
<div className="h-2 bg-gray-200/50 rounded-full overflow-hidden">
  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
</div>
```

---

## Opacity Scale Reference

```tsx
/90  // 90% - Modal backgrounds
/70  // 70% - Header backgrounds
/50  // 50% - Borders, input backgrounds
/40  // 40% - Primary card borders, overlay gradients
/30  // 30% - Primary card backgrounds, secondary borders
/20  // 20% - Secondary card backgrounds, tags, blur orbs
/10  // 10% - Icon backgrounds, status backgrounds
/5   // 5%  - Shadows
```

---

## Color Accessibility

### Contrast Ratios
- Black text on white/30 background: ✅ WCAG AA compliant
- iOS Blue (#007AFF) on white: ✅ WCAG AA compliant
- Gray-500 (#6B7280) on white: ✅ WCAG AA compliant

### Best Practices
1. Always use `text-black` for primary headings
2. Use `text-gray-500` for secondary text (not gray-400)
3. Never use white text on transparent backgrounds < 70% opacity
4. Use `text-[#007AFF]` for all interactive elements
5. Red (#DC2626) for destructive actions only

---

## Quick Reference

```tsx
// Most Used Colors
#007AFF               // iOS Blue
text-black            // Primary text
text-gray-500         // Secondary text
bg-white/30           // Primary cards
bg-white/70           // Headers
shadow-black/5        // Shadows
border-white/40       // Card borders
border-gray-200/50    // Dividers
```

---

**Last Updated:** 2025-10-20
