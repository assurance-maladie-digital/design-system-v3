<script setup lang="ts">
	import { locales } from './locales'
	import type { CaptchaType } from './types'

	interface Props {
		type?: CaptchaType | string
		tagTitle?: string
	}

	withDefaults(defineProps<Props>(), {
		type: undefined,
		tagTitle: 'h3',
	})
</script>

<template>
	<div>
		<div class="d-flex flex-row align-center">
			<component
				:is="tagTitle"
				class="captcha-title text-textBase"
			>
				{{ locales.information.securityCheck }}
			</component>
		</div>

		<div
			v-if="type"
		>
			<div v-if="type === 'image'">
				<p class="captcha-instructions text-textSubdued">
					{{ locales.information.image.text }}
				</p>

				<slot name="error" />
			</div>

			<div v-if="type === 'audio'">
				<p class="captcha-instructions text-textSubdued">
					{{ locales.information.audio.text }}
				</p>

				<slot name="error" />
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.captcha-title {
		font-weight: 700;
		font-size: 1.125rem;
		line-height: 150%;
		margin: 0;
		padding: 0;
	}

	.captcha-instructions {
		font-size: 1rem;
		line-height: 150%;
		font-weight: 400;
	}
</style>
