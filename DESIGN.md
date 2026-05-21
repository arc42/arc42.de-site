---
name: arc42
description: Resourcen für Softwarearchitektur
colors:
  primary: "#374769"
  secondary: "#ff6347"
  tertiary: "#00008b"
  neutral-bg: "#ffffff"
  neutral-surface: "#dcdcdc"
  neutral-text: "#3d4144"
typography:
  display:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", sans-serif'
    fontWeight: "bold"
  headline:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", sans-serif'
    fontWeight: "bold"
  body:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", sans-serif'
    fontSize: "16px"
    lineHeight: "1.5"
rounded:
  md: "6px"
  lg: "8px"
spacing:
  sm: "10px"
  md: "20px"
  lg: "40px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.lg}"
    padding: "10px 22px"
  button-anmeldung:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.lg}"
    padding: "10px 22px"
  timeline-card:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.md}"
    padding: "20px 30px"
---

# Design System: arc42

## 1. Overview

**Creative North Star: "The Trusted Guide"**

The arc42 site operates as a reliable, authoritative reference for software architecture. Its aesthetic reflects a utilitarian, clear, and structured approach, emphasizing content readability and frictionless utility over embellishment. The design must feel expert, reliable, and trustworthy, speaking directly to software architects, developers, and HR personnel. It actively rejects generic, flashy "SaaS-cream" tropes. Instead, it relies on a sober academic blue paired with highly contrasting warm accents to highlight critical actions like training registration.

**Key Characteristics:**
- **Information-First**: Content density and legibility take precedence over decorative elements.
- **Academic and Grounded**: A mature palette anchored by dark blues communicates reliability and experience.
- **Utilitarian Interactivity**: Components look like their function—flat, clear, and unambiguous.

## 2. Colors

Academic Blue & Warm Accents. The palette is rooted in stable, professional dark blues, punctuated by vivid, unmissable warm tones for high-priority actions.

### Primary
- **Slate Blue** (#374769): The workhorse action color. Used for standard buttons and interactive elements, providing a grounded, reliable anchor.

### Secondary
- **Action Tomato** (#ff6347): High-contrast accent reserved strictly for critical conversions, primarily the "Anmeldung" (registration) flows.

### Tertiary
- **Spine Blue** (#00008b): A pure, deep dark blue used specifically for structural elements like the timeline spine, reinforcing the "blueprint" feel.

### Neutral
- **Canvas White** (#ffffff): The default page background.
- **Gainsboro Surface** (#dcdcdc): Used for timeline cards and secondary container backgrounds to distinguish structural blocks without heavy borders.
- **Text Gray** (#3d4144): Deep, highly legible gray for body copy to reduce eye strain compared to pure black.

**The Restraint Rule.** The vivid Action Tomato is used sparingly and only for conversion. If everything is loud, nothing is. Let the blues do the heavy lifting for the structure.

## 3. Typography

**Display Font:** System Sans-Serif (-apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", sans-serif)
**Body Font:** System Sans-Serif (-apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", sans-serif)

**Character:** Utilitarian, native, and highly legible. By relying on system sans-serif stacks, the site feels instantly familiar and snappy across any operating system, reflecting its pragmatic, "no-nonsense" engineering audience.

### Hierarchy
- **Display** (bold): Hero headers. Commands attention without feeling overly styled.
- **Headline** (bold): Section dividers and article titles.
- **Body** (normal, 16px, 1.5): Standard reading text. Optimized for long-form technical documentation.

## 4. Elevation

The system is fundamentally flat and layered by default, relying on tonal contrasts (e.g., Gainsboro Surface against Canvas White) rather than shadows to separate content blocks.

### Shadow Vocabulary
- **Hover Lift** (`box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19)`): An aggressive, distinctive dual-layer shadow applied to buttons exclusively on `:hover` to provide unambiguous tactile feedback.

**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to interactive state (hover or focus) to explicitly invite clicks.

## 5. Components

Components are utilitarian and clear, prioritizing recognizable affordances over modern minimalism. 

### Buttons
- **Shape:** Gently rounded rectangles (8px radius).
- **Primary:** Slate Blue (#374769) background with white text, padded horizontally (10px 22px). Text is bold.
- **Hover / Focus:** Transitions over 0.4s to a lighter blue (#4b7ba3) and pale goldenrod text (#EEE8AA) while lifting aggressively with a heavy dual-layer shadow.
- **Anmeldung / Registration:** Adopts Action Tomato (#ff6347) to dominate the visual hierarchy.

### Cards / Containers (Timeline)
- **Corner Style:** Slightly rounded (6px radius).
- **Background:** Gainsboro (#dcdcdc).
- **Shadow Strategy:** Flat. Depth is conveyed by the layout and connection to the timeline spine, not by drop shadows.
- **Internal Padding:** Generous padding (20px 30px) for clear reading.

## 6. Do's and Don'ts

Guardrails to preserve the "Trusted Guide" authority.

### Do:
- **Do** use system sans-serif fonts to maintain a fast, native, and utilitarian feel.
- **Do** reserve the Action Tomato color strictly for primary conversions like "Anmeldung".
- **Do** keep cards and surfaces flat at rest, using Gainsboro or light gray tints to distinguish regions.

### Don't:
- **Don't** use generic, untrustworthy, or overly flashy "SaaS-cream" designs.
- **Don't** apply heavy drop shadows to static content blocks; save shadows for interactive hover states.
- **Don't** use decorative gradients or glassmorphism. They dilute the expert, engineering-focused tone.