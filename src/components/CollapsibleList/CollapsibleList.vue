<script lang="ts" setup>
	import { computed } from 'vue'
	import { useDisplay } from 'vuetify'
	import type { ListItem } from './types'
	import SyHeading from '@/components/SyHeading/SyHeading.vue'

	const props = withDefaults(defineProps<{
		listTitle: string | null
		items: ListItem[]
		headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
	}>(), {
		headingLevel: 4,
	})

	const { smAndDown } = useDisplay()

	const isMobile = computed(() => smAndDown.value)
</script>

<template>
	<VExpansionPanels
		v-if="isMobile"
		class="vd-collapse-list-mobile"
		variant="accordion"
		flat
	>
		<VExpansionPanel
			class="vd-panel"
			elevation="0"
			bg-color="transparent"
		>
			<VExpansionPanelTitle
				class="vd-panel-title text-subtitle-2 pl-0 py-4"
			>
				{{ props.listTitle }}
			</VExpansionPanelTitle>

			<VExpansionPanelText class="vd-panel-text">
				<ul class="pl-0">
					<li
						v-for="(item, index) in props.items"
						:key="index"
						class="py-3"
					>
						<a
							:href="item.href"
							:aria-label="item.text"
							class="text-body-2 text-decoration-none text--primary"
						>
							{{ item.text }}
						</a>
					</li>
				</ul>
			</VExpansionPanelText>
		</VExpansionPanel>
	</VExpansionPanels>

	<div
		v-else
		class="vd-collapse-list"
	>
		<SyHeading
			:class="headingLevel === 4 ? 'text-subtitle-1 font-weight-bold mb-3' : 'font-weight-bold mb-3'"
			:level="headingLevel"
		>
			{{ listTitle }}
		</SyHeading>

		<ul
			class="
			pl-0"
		>
			<li
				v-for="(item, index) in items"
				:key="index"
				:class="{ 'mb-2': index < items.length - 1 }"
			>
				<a
					:href="item.href"
					:aria-label="item.ariaLabel"
					class="text-body-2 text-decoration-none text--primary"
				>
					{{ item.text }}
				</a>
			</li>
		</ul>
	</div>
</template>

<style lang="scss" scoped>
.vd-panel {
	background-color: transparent;
}

.vd-panel-title :deep(.v-expansion-panel-title__overlay) {
	background: transparent !important;
}

.vd-panel-text :deep(.v-expansion-panel-text__wrapper) {
	padding: 0;
}

li {
	list-style: none;
}

a {
	// Ne transitionne que le soulignement (sinon `all` anime l'outline → flash noir au focus)
	transition: border-color 0.15s;
	padding-top: 1px; // Add top padding to account for bottom border
	border-bottom: 1px solid transparent;
	color: black;

	// Soulignement en survol uniquement ; le focus utilise le ring (indicateur unique)
	&:hover {
		border-color: currentcolor;
	}

	&:focus-visible {
		outline: 2px solid rgb(var(--v-theme-primary));
		outline-offset: 3px;
		border-radius: 2px;
	}
}

.v-theme--dark a :deep() {
	color: white;
}

// En contexte sombre (ex. footer), le ring de focus des liens passe en onPrimary
.v-theme--dark a:focus-visible {
	outline-color: rgb(var(--v-theme-on-primary));
}

.vd-collapse-list a {
	color: rgb(var(--v-theme-text-base));
}

.vd-collapse-list :deep() {
	.text-subtitle-1 {
		font-size: 1.125rem !important;
		letter-spacing: 0.0015em !important;
		line-height: 1.75rem;
	}
}

.v-theme--dark .vd-collapse-list :deep() {
	h4,
	ul,
	a,
	button {
		color: white !important;
	}
}

.vd-collapse-list-mobile :deep() {
	.v-expansion-panel-title {
		font-weight: 700 !important;

		&:focus-visible {
			outline: 2px solid rgb(var(--v-theme-primary));
			outline-offset: 3px;
			border-radius: 4px;
		}
	}

	.text-subtitle-2 {
		font-size: 1rem !important;
		letter-spacing: 0.001em !important;
		line-height: 1.375rem;
		font-weight: 600;
	}

	.v-icon {
		color: rgb(0 0 0 / 54%) !important;
	}
}

.v-theme--dark .vd-collapse-list-mobile :deep() {
	button {
		color: white !important;
	}

	// Ring du titre du panel en onPrimary sur fond sombre
	.v-expansion-panel-title:focus-visible {
		outline-color: rgb(var(--v-theme-on-primary));
	}
}
</style>
