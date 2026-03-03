## Design System Guidelines (Figma Ready)

Source Figma: https://www.figma.com/design/Oi18J2FpwvtskMMH0geuFo/app-ui-token  
Scope: Tokens + usage guidance for designers and engineers.

---

### 1) Color Tokens
- **Primary / Brand**
  - brand: `#00afbc`
  - blue: `#2479f0`, blue-hover: `#4094fb`, blue-10%: `#2479f01a`
  - purple: `#b32fe7`, purple-hover: `#cc5bf9`, purple-20%: `#b32fe733`
  - orange: `#fa8c16`, orange-20%: `#fa8c1633`
- **Secondary**
  - cyan: `#00afbc`, cyan-hover: `#00cad5`
  - magenta: `#eb2f96`
- **Buy / Sell**
  - buy: `#ea365a`, hover `#f5627f`, 10% `#ea365a1a`, 20% `#ea365a33`, reverse-text `#cf2245`
  - sell: `#00afbc`, hover `#00cad5`, 10% `#00b0bd1a`, 20% `#00b0bd33`, reverse-text `#0098a6`
- **Semantic**
  - error `#cf2245`, success `#129757`, warning `#fa8c16`, info `#2479f0`, brand `#00afbc`
- **Text**
  - primary `#1a1b1c`, secondary `#3a3b3e`, tertiary `#6e7073`, description `#adaeb4`, disabled `#cfd0d4`
  - brand `#00afbc`, error `#cf2245`, blue `#2479f0`, disable-text `#cfd0d4`, disable-trade-text `#ffffffe5`
- **Background**
  - primary `#ffffff`, secondary `#f5f6f6`, tertiary `#e5e6e8`, disabled `#eff0f2`, pop-ups `#ffffff`, mask `#00000080`
- **Border**
  - primary `#0000000a`, secondary `#00000014`, tertiary `#0000001f`
  - thickness presets: 0.5 / 1 / 1.33 / 1.5 / 2 px (use primary color)
- **Palettes**
  - Red 1-10: `#fff0f3` … `#5c0c1d`
  - Blue 1-10: `#e6f4ff` … `#0a1e53`
  - Cyan 1-9: `#dbffff` … `#034c54`
  - Purple 1-10: `#faeeff` … `#3a0550`
  - Orange 1-10: `#fff7e6` … `#612500`
  - Green 1-10: `#ddfced` … `#032d19`
  - Magenta 1-10: `#fff0f6` … `#4d0433`
  - Volcano 1-10: `#fff2e8` … `#5f0f05`
- **Transparency helpers**
  - t4 `#0000000a`, t6 `#0000000f`, white-w12 `#ffffff1f`, black-b25 `#00000040`

### 2) Typography
- Families: `PingFang HK` (primary), `Inter` (numeric/mono)
- Sizes (size / line-height / weight):
  - xxxs 9/14 400
  - xxs 10/14 400 | xxs-medium 10/14 500
  - xs 11/16 400 | xs-medium 11/16 500
  - s 12/18 400 | s-medium 12/18 500 | s-num-medium 12/18 500 (Inter)
  - body 14/20 400 | body-medium 14/20 500 | body-semibold 14/20 600 | body-num-medium 14/20 500 (Inter)
  - body15 15/22 400 | body15-medium 15/22 500
  - h7 16/24 400 | h7-medium 16/24 500 | h7-semibold 16/24 600 | h7-num-semibold 16/24 600 (Inter)
  - h6 18/26 500 | h6-semibold 18/26 600
  - h5-num-semibold 20/28 600 (Inter)
  - h3-num-bold 28/40 700 (Inter)
  - h2-num-bold 32/46 700 (Inter)
- Weights: 400 / 500 / 600 / 700

### 3) Spacing (px)
- Base: 0, 2, 4, 6, 8, 12, 16, 20, 24
- Extended: 32, 40, 48, 64, 80, 96, 128, 160, 192, 224, 256

### 4) Radius (px)
- 4, 6, 8, 12, 16, 20, 32, 999 (pill)

### 5) Shadows
- small: `0 1px 2px 0 rgba(0,0,0,0.05)`
- medium: `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)`
- large: `0 8px 16px 0 rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)`
- xl: `0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)`
- figmaLarge: drop shadow color `#00000014`, offset (0, 8), radius 32

### 6) Breakpoints
- sm 640px | md 768px | lg 1024px | xl 1280px | 2xl 1536px

### 7) Component Guidelines — Button
- Variants: primary, secondary, success, error, warning, info
- Sizes: sm (h-8 px-3 text-sm), md (h-10 px-4 text-body), lg (h-12 px-6 text-base)
- Defaults: variant=primary, size=md, disabled=false, children required
- States: default, hover, focus (ring-2 ring-offset-2 matching variant), disabled (opacity 50%, pointer-events none)
- Type: React.forwardRef<HTMLButtonElement>, extends ButtonHTMLAttributes
- Accessibility: keyboard focusable, visible focus ring, aria-* passthrough
- Usage snippet:
  ```tsx
  import { Button } from '@/components/ui/Button';

  <Button variant="primary" size="md">Primary</Button>
  <Button variant="secondary" size="md">Secondary</Button>
  <Button variant="error" size="md" disabled>Disabled</Button>
  ```

### 8) Layout Patterns (from reference example)
- Status/Top bar: height 54 + 52; padding ~16px; icons 16px.
- Navigation tabs: height 40, left/right 16px; active uses underline/fill; sub items widths 28–77px.
- Asset summary: two columns, left (label+unit+dot+value), right (today PnL); vertical rhythm 16/24.
- Table buttons: height 32, width 72/90, radius 4–8.
- List item (favorites): height 64, horizontal padding 16px, multi-column text.
- Bottom bar: 50 + 34 stacked; keep safe-area inset on mobile.
- Spacing: horizontal 16px as default gutter; vertical 16–24 between modules.

### 9) Figma Handoff Tips
- Mirror tokens in Figma styles: colors, text styles, radius, shadows, spacing grid.
- Name mapping: align style names to code keys (e.g., `Text/Primary`, `Background/Secondary`, `Radius/8`).
- Components: ensure variants/states in Figma match code props (Button: variant/size/disabled).
- Contrast: ensure text vs. background ≥ 4.5:1; focus ring visible on all backgrounds.

### 10) Files in Repo
- Tokens: `src/styles/design-tokens.ts`
- Styleguide: `/styleguide`
- Components docs & playground: `/components`
- Button specs (text): `src/app/components/components/ButtonSpecs.txt`

### 11) How Designers Use This
- Apply Figma color/text styles that match the tokens above.
- Reuse component variants/states consistent with code props.
- Keep padding, radius, and shadow presets from the tokens for new components.
- Use spacing scale for vertical rhythm; default gutter 16px.

### 12) How Engineers Use This
- Import tokens: `import { designTokens } from '@/styles/design-tokens';`
- Use Button API: `variant`, `size`, `disabled`, `children`, plus native button props.
- Align layout spacings/radius/shadows with tokens to avoid drift.

---

For any new components, mirror the pattern: define variants/sizes/states in Figma that map 1:1 to props, keep tokens sourced from the tables above, and verify accessibility (focus, contrast, keyboard).


