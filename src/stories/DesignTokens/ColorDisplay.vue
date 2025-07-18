<script setup lang="ts">
	/* eslint-disabled vuejs-accessibility/anchor-has-content */
	import { computed } from 'vue'
	import { VContainer, VRow, VCol, VCard, VCardTitle, VCardSubtitle } from 'vuetify/components'

	interface Props {
		colorCategory: string
		displayEmptyColors: boolean
		cnamColors: Record<string, string>
		paColors: Record<string, string>
		apColors: Record<string, string>
		colorTitle: string
		colorTitleLevel: number
	}

	const props = defineProps<Props>()

	const theme = computed(() => typeof window !== 'undefined' ? localStorage.getItem('storybook-theme') : 'cnam')
	const displayColors = computed(() => {
		if (theme.value === 'pa') {
			return props.paColors
		}
		if (theme.value === 'ap') {
			return props.apColors
		}
		return props.cnamColors
	})

	const titleKebabCase = props.colorTitle.toLocaleLowerCase().replace(' ', '-')
	const isEmptyObject = (obj: Record<string, string>) => {
		return Object.keys(obj).length === 0
	}
</script>

<template>
	<div
		v-if="!isEmptyObject(displayColors) || (isEmptyObject(displayColors) && displayEmptyColors && theme !== 'ap')"
		class="mb-5"
	>
		<h2
			v-if="colorTitleLevel === 2"
			:id="titleKebabCase"
			:style="`border-bottom: 1px solid rgba(38, 85, 115, 0.15); color: rgb(46, 52, 56); font-family: 'Nunito Sans', -apple-system, '.SFNSText-Regular', 'San Francisco', BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif; `"
			class="mb-2 pb-1 css-wzniqs"
		>
			<a
				aria-hidden="true"
				:href="`#${titleKebabCase}`"
				tabindex="-1"
				target="_self"
				:title="colorTitle"
				class="css-1ofkq6d"
			>
				<span style="display: none;">lien vers {{ colorTitle }}</span>
				<svg
					width="14"
					height="14"
					viewBox="0 0 14 14"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M11.841 2.159a2.25 2.25 0 00-3.182 0l-2.5 2.5a2.25 2.25 0 000 3.182.5.5 0 01-.707.707 3.25 3.25 0 010-4.596l2.5-2.5a3.25 3.25 0 014.596 4.596l-2.063 2.063a4.27 4.27 0 00-.094-1.32l1.45-1.45a2.25 2.25 0 000-3.182z"
						fill="currentColor"
					/>
					<path
						d="M3.61 7.21c-.1-.434-.132-.88-.095-1.321L1.452 7.952a3.25 3.25 0 104.596 4.596l2.5-2.5a3.25 3.25 0 000-4.596.5.5 0 00-.707.707 2.25 2.25 0 010 3.182l-2.5 2.5A2.25 2.25 0 112.159 8.66l1.45-1.45z"
						fill="currentColor"
					/>
				</svg>
			</a>
			{{ colorTitle }}
		</h2>

		<h3
			v-else
			:id="titleKebabCase"
			:style="`color: rgb(46, 52, 56); font-family: 'Nunito Sans', -apple-system, '.SFNSText-Regular', 'San Francisco', BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif; `"
			class="mb-2 css-wzniqs"
		>
			<a
				aria-hidden="true"
				:href="`#${titleKebabCase}`"
				tabindex="-1"
				target="_self"
				:title="colorTitle"
				class="css-1ofkq6d"
			>
				<span style="display: none;">lien vers {{ colorTitle }}</span>
				<svg
					width="14"
					height="14"
					viewBox="0 0 14 14"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M11.841 2.159a2.25 2.25 0 00-3.182 0l-2.5 2.5a2.25 2.25 0 000 3.182.5.5 0 01-.707.707 3.25 3.25 0 010-4.596l2.5-2.5a3.25 3.25 0 014.596 4.596l-2.063 2.063a4.27 4.27 0 00-.094-1.32l1.45-1.45a2.25 2.25 0 000-3.182z"
						fill="currentColor"
					/>
					<path
						d="M3.61 7.21c-.1-.434-.132-.88-.095-1.321L1.452 7.952a3.25 3.25 0 104.596 4.596l2.5-2.5a3.25 3.25 0 000-4.596.5.5 0 00-.707.707 2.25 2.25 0 010 3.182l-2.5 2.5A2.25 2.25 0 112.159 8.66l1.45-1.45z"
						fill="currentColor"
					/>
				</svg>
			</a>
			{{ colorTitle }}
		</h3>

		<VContainer>
			<VRow v-if="!isEmptyObject(displayColors)">
				<VCol
					v-for="(color, name) in displayColors"
					:key="name"
					cols="6"
					md="3"
					sm="4"
				>
					<VCard color="grey-lighten-4">
						<VCardTitle style="font-size: medium;">
							{{ name }}
						</VCardTitle>
						<VCardSubtitle>{{ color }}</VCardSubtitle>
						<VCard
							height="70px"
							class="color"
						>
							<div :style="{ backgroundColor: color, height: '100%', width: '100%' }" />
						</VCard>
					</VCard>
				</VCol>
			</VRow>
			<div
				v-else
				class="text-grey"
			>
				Couleurs en cours définition.
			</div>
		</VContainer>
	</div>
</template>

<style lang="scss" scoped>
	.v-card--variant-elevated.color {
		background: transparent !important;
	}
</style>
