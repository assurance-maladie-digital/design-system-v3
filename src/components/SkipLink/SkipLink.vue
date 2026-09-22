<script lang="ts" setup>
	import { locales as defaultLocales } from './locales'
	import { useLocales } from '@/composables/useLocales'
	import type { DeepPartial } from '@/utils/locales/mergeLocales'
	import type { SkipLinkItem } from './types'

	const props = withDefaults(
		defineProps<{
			label?: string
			skipLinks?: SkipLinkItem[]
			target?: string
			locales?: DeepPartial<typeof defaultLocales>
		}>(),
		{
			label: undefined,
			skipLinks: () => [],
			target: '#main',
			locales: () => ({}),
		},
	)

	const locales = useLocales(defaultLocales, () => props.locales)

</script>

<template>
	<nav
		:aria-label="locales.ariaLabel"
		class="sy-skip-link-container"
	>
		<ul
			v-if="skipLinks.length > 0"
			class="sy-skip-link-list"
		>
			<li
				v-for="(skipLinkItem, index) in skipLinks"
				:key="`${skipLinkItem.target}-${index}`"
			>
				<a
					:href="skipLinkItem.target"
					class="sy-skip-link text-primary d-block d-sr-only-focusable px-2"
				>
					{{ skipLinkItem.label }}
				</a>
			</li>
		</ul>

		<a
			v-else
			:href="target"
			class="sy-skip-link text-primary d-block d-sr-only-focusable px-2"
		>
			<slot>{{ label ?? locales.label }}</slot>
		</a>
	</nav>
</template>

<style lang="scss" scoped>
.sy-skip-link-list {
	margin: 0;
	padding: 0;
	list-style: none;
}

.sy-skip-link {
	z-index: 150;
	position: fixed;
	top: 0;
	right: 0;
	transition: none;
	width: 100%;
	background: rgb(var(--v-theme-surface));

	// Le skip link n'est atteignable qu'au clavier (d-sr-only-focusable) : on utilise
	// `:focus` (et non `:focus-visible`) pour garantir que le ring accompagne toujours
	// la barre quand elle devient visible. Inset (-2px) : barre pleine largeur collée au bord.
	&:focus {
		outline: 2px solid rgb(var(--v-theme-primary));
		outline-offset: -2px;
	}
}
</style>
