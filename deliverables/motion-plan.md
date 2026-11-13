# Motion plan

Result: PASS  
Scenes: 4  
Desktop: PASS · 390px: PASS · reduced motion: PASS

## Fresh external candidates reviewed

1. Motion for React `whileInView` / `inView`: https://motion.dev/examples/react-scroll-triggered and https://motion.dev/docs/inview — selected as the implementation reference for per-section and per-card viewport lifecycle. It maps cleanly to real content, IntersectionObserver semantics and reduced-motion handling.
2. Motion for React hover gestures: https://motion.dev/docs/react-hover-animation — selected for desktop-only product/media micro-feedback, paired with focus/press states and never required to read content.
3. GSAP ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/ — reviewed but not selected for this site because the required editorial reveals and product interactions do not justify a second, heavier animation system.

The local motion component catalogue was queried for `product cards editorial reveal hover`; it returned no matching component. The decision is recorded as NOT_ADOPTED with a specific reason in `deliverables/motion-usage.json`.

## Selected scenes

| Scene | Responsibility and location | Effect | Why | Desktop / 390px | Reduced motion and failure safety |
|---|---|---|---|---|---|
| Layered hero entrance | Narrative; Home hero | Eyebrow, heading, copy and CTA enter in a restrained 60–90ms sequence while the active banner remains readable | Establishes hierarchy without obscuring real product/factory subjects | 20px vertical movement / opacity only with no displacement | Immediate static content; no autoplay dependency |
| Viewport section and card reveal | Content; every public route and every repeated card set | Each section and each card starts only after its own real viewport intersection; 20–28px rise, 500–650ms, bounded stagger | Satisfies perceptible coverage and keeps catalogue reading ordered | Smaller 12–18px movement and shorter stagger on 390px | Base content visible; enhancement marker only after motion initializes; fallback visibility never marks unreached items completed |
| Product/media interaction | Interaction; product cards, gallery triggers, manufacturing images | Desktop hover/focus lifts 4px and scales image up to 1.02; press/focus feedback on touch/keyboard | Helps discover clickable media while keeping garment proportions stable | Hover plus focus / focus and press only, no hover dependency | No transform; focus indication remains visible |
| RFQ and FAQ state transition | Conversion; FAQ accordion and inquiry actions | Height/opacity transition for accordion; CTA arrow moves 3px; submit state changes without layout jump | Clarifies interaction and next action | Same structure with shorter duration on 390px | Immediate state change with no nonessential movement |

## Lifecycle constraints

- No global timer may mark off-screen sections revealed or completed.
- `fallback-visible` and `hasAnimated` remain separate states.
- Every public page’s first and last major section and every repeated card collection will be checked on desktop and 390px.
- JavaScript-disabled, blocked motion script, slow-load and normal modes retain readable content.
- All observers, timers and listeners are cleaned up on unmount; no video is used.
