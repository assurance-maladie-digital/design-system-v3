import { computed } from 'vue'
import { useTheme } from 'vuetify'
import type { ComputedRef } from 'vue'

export function useThemeLocales<
	T extends Record<string, unknown> & { default: unknown },
>(locales: T): {
	themeLocales: ComputedRef<T[keyof T]>
} {
	const vuetifyTheme = useTheme()

	const themeLocales = computed((): T[keyof T] => {
		return (locales[vuetifyTheme.name.value as keyof T] ?? locales.default) as T[keyof T]
	})

	return {
		themeLocales,
	}
}
