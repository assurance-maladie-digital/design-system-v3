/**
 * Composable for generating unique IDs for components
 * Helps avoid duplicate IDs when multiple instances of a component are used
 */

// No imports needed

// Counter to ensure uniqueness across the application
let counter = 0

/**
 * Generate a unique ID based on a base string
 * @param baseId - The base ID to use (should be descriptive of the element)
 * @returns A unique ID string
 */
export function useId(baseId: string): string {
	return `${baseId}-${++counter}`
}
