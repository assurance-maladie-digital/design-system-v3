<script setup lang="ts">
	import { type PropType } from 'vue'
	import { locales } from './locales'
	import type { SocialMediaLink } from './types'
	import SyIcon from '../Customs/SyIcon/SyIcon.vue'

	const props = defineProps({
		links: {
			type: Array as PropType<SocialMediaLink[]>,
			default: null,
		},
		headingLevel: {
			type: Number,
			default: 6,
			validator: (value: number) => value >= 1 && value <= 6,
		},
		useNativeHeading: {
			type: Boolean,
			default: true,
		},
		dark: {
			type: Boolean,
			default: false,
		},
	})

</script>

<template>
	<div
		class="vd-social-media-links d-flex flex-column"
		:class="{ 'vd-social-media-links--dark': props.dark }"
	>
		<component
			:is="props.useNativeHeading ? `h${props.headingLevel}` : 'span'"
			class="vd-social-media-links-label text--primary"
			:role="!props.useNativeHeading ? 'heading' : undefined"
			:aria-level="!props.useNativeHeading ? props.headingLevel : undefined"
		>
			{{ locales.followUs }}
		</component>

		<ul class="vd-social-media-links-content d-flex max-width-none">
			<li
				v-for="(social, index) in props.links"
				:key="index"
			>
				<VBtn
					:id="`social-btn-${index}`"
					:theme="dark ? 'dark' : undefined"
					:href="social.href"
					target="_blank"
					rel="noopener noreferrer"
					:icon="true"
					:aria-label="`Lien vers ${social.name}`"
					variant="text"
				>
					<SyIcon
						:icon="social.icon"
						size="30px"
						:class="{
							'vd-social-media-links-icon': true,
							'vd-social-media-links-icon--x': social.name === 'X',
						}"
						decorative
					/>
				</VBtn>
			</li>
		</ul>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/overrides/breakpoints' as bp;

.vd-social-media-links {
	display: flex;
	flex-direction: column;
}

li {
	list-style: none;
}

.vd-social-media-links-label.text--primary {
	color: rgb(var(--v-theme-primary));
	font-weight: 600;
	margin: 0;
	padding: 0;
	font-family: inherit;
	font-size: 0.875rem;
	line-height: 1.375rem;

	/* Removed fixed letter-spacing of Vuetify */
	letter-spacing: normal;
}

.vd-social-media-links-icon {
	color: rgb(var(--v-theme-on-surface-variant)) !important;
}

.vd-social-media-links-icon--x {
	transform: scale(0.75);
	transform-origin: center;
}

.v-btn--icon {
	width: calc(var(--v-btn-height) + 5px);
	height: calc(var(--v-btn-height) + 5px);
	border: 0;

	&:focus-visible {
		outline: 2px solid rgb(var(--v-theme-primary));
		outline-offset: -1px;
	}
}

.vd-social-media-links--dark {
	.vd-social-media-links-label.text--primary {
		color: rgb(var(--v-theme-onPrimary));
	}

	:deep(.v-btn--variant-text:hover) {
		background: rgb(255 255 255 / 10%);
	}

	:deep(.vd-social-media-links-icon) {
		color: rgb(var(--v-theme-onPrimary)) !important;
	}

	:deep(.v-btn--icon:focus-visible) {
		outline: 2px solid rgb(var(--v-theme-onPrimary));
		outline-offset: -1px;
	}
}

@media #{bp.$up-tablet} {
	.vd-social-media-links-label {
		text-align: right;
	}

	.vd-social-media-links-content {
		justify-content: flex-end;
	}
}

@media #{bp.$down-mobile} {
	.vd-social-media-links-label {
		text-align: left;
	}

	.vd-social-media-links-content {
		justify-content: flex-start;
	}
}
</style>
