<script setup lang="ts">
	import type { PropType } from 'vue'
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
	})
</script>

<template>
	<div class="d-flex flex-column">
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
						class="vd-social-media-links-icon"
						decorative
					/>
				</VBtn>
			</li>
		</ul>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

.vd-social-media-links {
	display: flex;
	flex-direction: column;
}

li {
	list-style: none;
}

.vd-social-media-links-label.text--primary {
	color: tokens.$blue-base;
	font-weight: 600;
	margin: 0;
	padding: 0;
	font-family: inherit;
	font-size: 0.875rem;
	line-height: 1.375rem;
	/* Removed fixed letter-spacing of Vuetify */
	letter-spacing: normal;
}

.v-theme--dark .vd-social-media-links-label.text--primary {
	color: white;
}

.vd-social-media-links-icon {
	color: tokens.$grey-base;
}

.v-btn--icon {
	width: calc(var(--v-btn-height) + 5px);
	height: calc(var(--v-btn-height) + 5px);
	border: 0;

	&:focus-visible {
		outline: 3px solid tokens.$blue-base;
		outline-offset: -1px;
	}
}

.v-theme--dark {
	.v-btn--variant-text:hover :deep() {
		background: rgba(white, 0.1);
	}

	.v-btn--icon:focus-visible {
		outline: 3px solid white;
		outline-offset: -1px;
	}
}

@media (width >= 768px) {
	.vd-social-media-links-label {
		text-align: right;
	}

	.vd-social-media-links-content {
		justify-content: flex-end;
	}
}

@media (width <= 767px) {
	.vd-social-media-links-label {
		text-align: left;
	}

	.vd-social-media-links-content {
		justify-content: flex-start;
	}
}
</style>
