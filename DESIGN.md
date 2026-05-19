# LetMeFind Design System

## Design Philosophy

LetMeFind uses a **Material Design 3** inspired system with focus on:
- **Progressive Disclosure:** Stage-by-stage information reveal
- **Dark-Light Neutral:** Minimalist palette emphasizing content
- **Responsive Fluidity:** 320px → 1280px seamless adaptation
- **Turkish-English Bilingual:** Context-aware language

## 🎨 Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| primary | #000000 | Text, CTAs |
| on-surface | #1a1c1d | Body text |
| surface | #f9f9fa | Backgrounds |
| surface-container | #eeeeef | Cards, sections |
| surface-container-high | #e8e8e9 | Hover, elevated |
| outline | #7e7576 | Borders |
| error | #ba1a1a | Errors, warnings |

## 🔤 Typography

**Font:** Inter (Google Fonts)  
**Weights:** 300, 400, 500, 600, 700, 800

| Level | Size | Weight | Line Height |
|-------|------|--------|-------------|
| H1 | 32px | 700 | 1.2 |
| H2 | 24px | 600 | 1.3 |
| H3 | 20px | 600 | 1.4 |
| Body | 16px | 400 | 1.5 |
| Body Small | 14px | 400 | 1.5 |
| Label | 12px | 500 | 1.4 |

## 📏 Spacing Grid (4px unit)

```
xs: 4px    sm: 8px    md: 16px
lg: 32px   xl: 64px   xxl: 128px
```

## 📱 Responsive Breakpoints

| Breakpoint | Device | Columns |
|-----------|--------|---------|
| 320px | Mobile | 1 |
| 768px | Tablet | 2 |
| 1024px | Laptop | 3 |
| 1280px | Desktop | 3 + sidebar |

All pages render correctly at each breakpoint with no dummy data visible.

## 🎭 Component Patterns

### Search Input
- Height: 48px (touch-friendly)
- Padding: 12px 16px
- Border: 1px solid outline
- Radius: 1rem

### Button (Primary)
- Background: #000000
- Color: #ffffff
- Padding: 12px 24px
- Radius: 1rem
- States: Hover (+10% brightness), Focus (outline), Disabled (50% opacity)

### Product Card
- Image aspect: 4:3
- Width: 100% mobile, 48% tablet, 30% desktop
- Shadow on hover: 0 4px 12px rgba(0,0,0,0.1)

### Comparison Table
- Header: Sticky, background #e8e8e9
- Rows: Alternating #f9f9fa / #ffffff
- Cell padding: 12px

### Gemini Overlay
- Position: Fixed bottom-right
- Width: 90% mobile (max 400px), 350px desktop
- Animation: Slide-up 200ms ease-out
- Z-index: 9999

## 🎬 Animations

| Action | Duration | Easing | Effect |
|--------|----------|--------|--------|
| Button hover | 200ms | ease-out | Background shift |
| Loading spinner | 2s | linear | Rotation |
| Chat slide-in | 200ms | ease-out | translateY(-20px) |
| Page fade | 300ms | ease-in-out | Opacity 0→1 |

## ♿ Accessibility

- **Contrast:** AA standard (7:1 body, 4.5:1 labels)
- **Touch targets:** 44×44px minimum
- **Keyboard nav:** Full support (Tab/Shift+Tab)
- **ARIA labels:** On dynamic content
- **Focus visible:** 2px outline on keyboard focus
- **Semantic HTML:** Proper heading hierarchy, form labels

## 🔍 Design Validation

- [x] Color contrast meets WCAG AA
- [x] Touch targets 44×44px minimum
- [x] Responsive at all breakpoints
- [x] No dummy data visible
- [x] Branding consistent (LetMeFind)
- [x] Loading states clear (1.6s thinking stage)
- [x] Keyboard navigation works
- [x] Screen reader compatible

---

**Design System v1.0** | Last Updated: May 19, 2026
