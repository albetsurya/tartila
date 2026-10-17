/**
 * cn - Class name utility.
 * Joins conditional class names with proper spacing.
 */
export const cn = (
  ...classes: Array<string | undefined | false | null>
): string => classes.filter(Boolean).join(' ')
