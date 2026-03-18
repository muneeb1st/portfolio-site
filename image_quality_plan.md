# Hero Image Quality Improvement Plan

This plan focuses on maintaining high visual quality for the hero profile picture on desktop displays while preserving the existing UI layout and dimensions.

## The Problem
On high-density displays (Retina, 4K, etc.), a 128px image rendered in a 128px space can appear "soft" or low quality because it lacks enough pixels to match the screen's pixel density.

## Proposed Resolution

### 1. High-Density (Retina) Circular Fill
*   **Approach**: We will restore the dedicated `div` wrapper to guarantee a perfectly circular frame, but we will increase the `sizes` attribute to force the browser to load a higher-resolution variant.
*   **Implementation**: 
    - Restore the `<div className="relative w-32 h-32 mx-auto mb-6">` wrapper.
    - Use `<Image fill ... />` inside the wrapper.
    - **CRITICAL**: Set `sizes="256px"`. Even though the display size is 128px (`w-32`), setting `sizes="256px"` tricks Next.js/Browser into providing a 2x resolution source, ensuring sharpness on PC/Retina screens.
    - Ensure `object-cover` and `rounded-full` are applied to maintain the circular "fill" look.

### 2. Quality Tuning
- Set `quality={95}` or `quality={100}`.
- Keep `priority` for instant loading.

### 3. Maintaining UI Integrity
- The `div` wrapper with `w-32 h-32` ensures the frame remains exactly as it was, preventing the "pill" shape seen in previous attempts.

## Verification
*   Inspect the image in Chrome/Edge DevTools.
*   Check the "Current Src" in the and verify it is serving a higher resolution than the rendered size.
*   Verify that the layout remains identical to the current production state.
