<script setup lang="ts">
	import type { PropType } from 'vue'
	import { locales } from './locales'
	import type { SocialMediaLink } from './types'

	const props = defineProps({
		links: {
			type: Array as PropType<SocialMediaLink[]>,
			default: null,
		},
	})
</script>

<template>
	<div class="d-flex flex-column">
		<span class="vd-social-media-links-label text-subtitle-2 text--primary">
			{{ locales.followUs }}
		</span>

		<ul class="d-flex max-width-none">
			<li
				v-for="(social, index) in props.links"
				:key="index"
			>
				<VBtn
					id="social-btn"
					:href="social.href"
					target="_blank"
					rel="noopener noreferrer"
					:icon="true"
					variant="text"
				>
					<VIcon
						size="30px"
						class="vd-social-media-links-icon"
					>
						{{ social.icon }}
					</VIcon>
				</VBtn>
			</li>
		</ul>
	</div>
</template>

<style lang="scss" scoped>
@import '../../assets/tokens.scss';

.vd-social-media-links {
  display: flex;
  flex-direction: column;
}

li {
  list-style: none;
}

.vd-social-media-links-label.text--primary {
  color: $blue-base;
}

.v-theme--dark .vd-social-media-links-label.text--primary {
  color: white;
}

.vd-social-media-links-icon {
  color: $grey-base;
}

.v-btn--icon {
  width: calc(var(--v-btn-height) + 5px);
  height: calc(var(--v-btn-height) + 5px);
  border: 0;
}

.v-theme--dark .v-btn--variant-text:hover :deep() {
  background: rgba(white, 0.1);
}

@media (min-width: 768px) {
  .vd-social-media-links-label {
    text-align: right;
  }
}

@media (max-width: 767px) {
  .vd-social-media-links-label {
    text-align: left;
  }
}
</style>
