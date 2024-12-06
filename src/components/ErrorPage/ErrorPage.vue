<script setup lang="ts">
	import type { RouteRecordRaw } from 'vue-router'
	import { locales } from './locales'
	import PageContainer from '../PageContainer/PageContainer.vue'

	withDefaults(defineProps<{
		pageTitle?: string
		message?: string
		code?: string
		codeErrorText?: string
		btnText?: string
		btnHref?: string
		btnLink?: RouteRecordRaw | string
		hideBtn?: boolean
	}>(), {
		pageTitle: undefined,
		message: undefined,
		code: undefined,
		codeErrorText: locales.errorCodeText,
		btnText: undefined,
		btnLink: '/',
		btnHref: undefined,
		hideBtn: false,
	})
</script>

<template>
	<PageContainer size="l">
		<VCard
			:elevation="0"
			class="pa-6 pa-sm-16"
		>
			<VRow class="max-width-none">
				<VCol
					:sm="$slots.illustration ? 6 : 12"
					cols="12"
					class="order-last order-sm-first text-center text-sm-left d-flex flex-column justify-center align-sm-start"
				>
					<div class="vd-code text-primary mb-4">
						<span class="d-sr-only">{{ codeErrorText }}</span>
						{{ code }}
					</div>

					<h2 class="mb-2 font-weight-bold text-h5 mb-4">
						{{ pageTitle }}
					</h2>

					<p>
						{{ message }}
					</p>

					<slot name="additional-content" />

					<slot name="action">
						<VBtn
							v-if="!hideBtn && btnText && (btnLink || btnHref)"
							:to="btnLink"
							:href="btnHref"
							color="primary"
							exact
							class="mt-6"
						>
							{{ btnText }}
						</VBtn>
					</slot>
				</VCol>

				<VCol
					v-if="$slots.illustration"
					cols="12"
					sm="6"
					class="d-flex align-center justify-center"
				>
					<slot name="illustration" />
				</VCol>
			</VRow>
		</VCard>
	</PageContainer>
</template>

<style lang="scss" scoped>
.vd-code {
	font-size: 6rem;
	line-height: 6rem;
	font-weight: 400;
}
</style>
