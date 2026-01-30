/**
 * Animation control utility
 * Provides a central way to disable/enable animations across the app
 */

// Global flag to control animations
export const ANIMATIONS_DISABLED = true;

/**
 * Utility function to conditionally apply animation props
 */
export function getAnimationProps(props: Record<string, any>) {
  return ANIMATIONS_DISABLED ? {} : props;
}

/**
 * Utility to get animation-safe className (removes animation classes when disabled)
 */
export function getAnimationClassName(className: string) {
  if (!ANIMATIONS_DISABLED) return className;
  
  // Remove animation-related classes when animations are disabled
  return className
    .replace(/animate-\w+/g, '')
    .replace(/transition-\w+/g, '')
    .replace(/duration-\w+/g, '')
    .replace(/ease-\w+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}