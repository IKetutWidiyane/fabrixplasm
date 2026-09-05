# FABRIXPLASM

> Digital Design. Physical Precision.

FABRIXPLASM is an experimental interactive company profile website concept for a modern digital fabrication and advanced manufacturing company.

The project combines industrial aesthetics with immersive web interactions to showcase fabrication processes such as CNC machining, laser cutting, plasma cutting, and 3D printing.

The website is designed as a single-page interactive experience with a strong focus on 3D, motion design, scroll-based storytelling, and visual interaction.

---

## ✦ Concept

FABRIXPLASM represents the connection between digital design and physical manufacturing.

The core idea is:

**Digital → Machine → Material → Object**

The website visualizes this process through an immersive industrial interface rather than a conventional corporate landing page.

The Hero section introduces the brand through a 3D plasma cutting scene, where a plasma nozzle interacts with a steel plate containing the FP mark.

The following sections will use image sequences and scroll-driven animation to visualize different fabrication processes.

---

## ✦ Hero Concept

The Hero is built around a real-time 3D fabrication scene.

### Main elements

- FABRIXPLASM brand identity
- Large editorial typography
- Industrial plasma nozzle
- Steel plate
- FP mark
- Plasma arc
- Sparks
- Cinematic camera movement
- Mouse-based parallax
- Scroll-driven transitions

### Hero visual sequence

```text
FABRIXPLASM
       ↓
DIGITAL DESIGN.
PHYSICAL PRECISION.
       ↓
Plasma Nozzle
       ↓
Plasma Arc
       ↓
Steel Plate
       ↓
FP Mark
       ↓
Sparks / Cutting Effect
       ↓
Scroll
       ↓
Next Fabrication Process

The 3D Hero is intentionally used as the main visual focal point while the following sections rely primarily on optimized image sequences and motion design.

✦ Planned Sections

The initial version consists of six major sections.

01 — HERO
     3D Plasma Fabrication Scene

02 — CNC MACHINING
     Image Sequence

03 — LASER CUTTING
     Image Sequence

04 — PLASMA CUTTING
     Image Sequence

05 — 3D PRINTING
     Image Sequence

06 — FABRICATION
     Image Sequence / Final Visual

The goal is to keep the experience visually rich while avoiding unnecessary WebGL usage throughout the entire website.

✦ Technology
Core
Next.js
React
TypeScript
Tailwind CSS
Animation
GSAP
GSAP ScrollTrigger
Lenis
3D
Three.js
React Three Fiber
@react-three/drei
Rendering
WebGL
HTML5 Canvas
CSS transforms
GPU-accelerated animation
✦ Animation Architecture

The project separates continuous 3D animation from high-level scroll animation.

                    FABRIXPLASM
                         │
                         ▼
                    HeroScene
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
       Nozzle        Steel Plate       Camera
          │              │
          ▼              ▼
        Plasma          FP Mark
          │
          ▼
       Sparks
Animation responsibilities

HeroScene

Camera
Lighting
Global scene coordination
Mouse target
Global movement

PlasmaNozzle

Idle movement
Mouse interaction
Scroll response

SteelPlate

Subtle parallax
Position and rotation
Physical anchor for FP Mark

FPMark

Remains attached to the steel plate
Represents the FABRIXPLASM identity

PlasmaArc

Plasma energy effect
Controlled flickering
Cutting-point alignment

Sparks

Lightweight particle animation
Directional movement
Cutting impact effect

GSAP / ScrollTrigger

Hero entrance
Typography animation
Scroll transitions
Section transitions

Lenis

Smooth scrolling
Scroll synchronization with GSAP
✦ Performance Philosophy

FABRIXPLASM is designed to look visually complex without unnecessarily increasing rendering cost.

The project follows these principles:

Avoid React state for per-frame animation
Use refs for Three.js object manipulation
Use useFrame for continuous 3D animation
Use damping for smooth movement
Use GSAP for timeline-based animation
Avoid multiple animation loops
Avoid unnecessary object allocation inside useFrame
Keep the number of particles controlled
Optimize 3D models and textures
Lazy-load heavy assets where possible
Use image sequences through Canvas rather than large video files when appropriate
Respect prefers-reduced-motion

The main 3D experience is limited to the Hero to keep the overall website lightweight.

✦ Asset Credits

This project uses third-party assets for development and visual presentation.

3D Model — Plasma / Industrial Nozzle

Asset: Nozzle
Creator: KamilFekner
Platform: Sketchfab
License: Creative Commons Attribution (CC BY)

The original model is credited to its creator. The model is used as part of the FABRIXPLASM Hero visual concept and may be modified, optimized, or incorporated into the project's 3D scene as permitted by the applicable license.

Original asset:
Nozzle by KamilFekner on Sketchfab

Metal Texture — Metal 061 A

Asset: Metal 061 A
Creator / Source: ambientCG
License: CC0

The Metal 061 A material is provided by ambientCG under the Creative Commons CC0 license.

CC0 permits the asset to be used, modified, and incorporated into projects without requiring attribution, including commercial use.

The texture is used for the steel / metal surface in the FABRIXPLASM 3D environment.

✦ Asset Sources
3D Model

Nozzle — KamilFekner
Sketchfab

Texture

Metal 061 A — ambientCG

✦ Project Structure
fabrixplasm/
│
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   │
│   ├── hero/
│   │   ├── Hero.tsx
│   │   ├── HeroScene.tsx
│   │   ├── PlasmaNozzle.tsx
│   │   ├── SteelPlate.tsx
│   │   ├── FPMark.tsx
│   │   ├── PlasmaArc.tsx
│   │   └── Sparks.tsx
│   │
│   ├── navigation/
│   │   └── Navbar.tsx
│   │
│   └── ui/
│       ├── MagneticButton.tsx
│       └── CustomCursor.tsx
│
├── animations/
│   ├── heroIntro.ts
│   ├── heroScroll.ts
│   └── heroMouse.ts
│
├── hooks/
│   ├── useLenis.ts
│   ├── useMousePosition.ts
│   └── useReducedMotion.ts
│
├── data/
│   └── company.ts
│
├── public/
│   ├── models/
│   │   └── hero/
│   │
│   ├── textures/
│   │   └── hero/
│   │
│   └── images/
│       └── hero/
│
└── README.md
✦ Design Direction

FABRIXPLASM follows an industrial, minimal, and cinematic visual language.

Visual characteristics
Dark industrial environment
Brushed metal
Steel surfaces
Subtle imperfections
Strong typography
Technical information
High contrast
Controlled orange plasma accents
Minimal UI
Large whitespace
Editorial composition
Smooth transitions

The interface avoids excessive gradients, glassmorphism, neon effects, and generic AI-generated visual patterns.

The goal is to make the website feel like a combination of:

Industrial Design + Engineering + Digital Experience

✦ Brand Direction
Brand

FABRIXPLASM

Positioning

Digital Fabrication & Advanced Manufacturing

Possible tagline

Digital Design. Physical Precision.

Alternative:

From Digital to Physical.

Alternative:

Precision. Material. Motion.

✦ Development Status

The project is currently in active development.

Current focus
 Next.js setup
 React / TypeScript setup
 GSAP setup
 Lenis setup
 Three.js setup
 React Three Fiber setup
 Hero layout
 3D nozzle
 Steel plate
 FP mark
 Plasma arc
 Sparks
 Mouse interaction
 Hero intro animation
 Hero scroll animation
 Image sequence system
 CNC section
 Laser section
 Plasma section
 3D printing section
 Final fabrication section
 Mobile optimization
 Performance optimization
 Accessibility refinement
✦ License

The source code of this project is intended for educational, experimental, and portfolio purposes.

Third-party assets remain subject to their respective licenses.

Third-party assets
Nozzle 3D model — KamilFekner — Creative Commons Attribution (CC BY)
Metal 061 A — ambientCG — Creative Commons CC0

Third-party assets should not be assumed to be covered by the project's own source-code license.

Please review the original asset licenses before redistributing the assets independently or using them in another project.

✦ Credits

Design & Development
FABRIXPLASM

3D Asset
KamilFekner / Sketchfab

Material
ambientCG

Built with
Next.js · React · TypeScript · Three.js · React Three Fiber · GSAP · Lenis