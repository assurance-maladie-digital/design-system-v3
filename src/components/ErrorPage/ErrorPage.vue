<script setup lang="ts">
	import type { RouteRecordRaw } from 'vue-router'
	import { locales } from './locales'
	import PageContainer from '../PageContainer/PageContainer.vue'

	type MessagePart =
		| { type: 'text'; value: string }
		| { type: 'phone'; value: string }

	// Fonction pour formater le message et ajouter des liens tel: aux numéros de téléphone
	const splitMessage = (message?: string): MessagePart[] => {
		// Regex pour détecter les numéros de téléphone
		if (!message)
			return []

		const regex = /\b(\d{10})\b/g
		const parts: MessagePart[] = []
		let lastIndex = 0
		let match: RegExpExecArray | null

		while ((match = regex.exec(message)) !== null) {
			if (match.index > lastIndex) {
				parts.push({
					type: 'text',
					value: message.slice(lastIndex, match.index),
				})
			}

			parts.push({
				type: 'phone',
				value: match[1],
			})

			lastIndex = regex.lastIndex
		}

		if (lastIndex < message.length) {
			parts.push({
				type: 'text',
				value: message.slice(lastIndex),
			})
		}

		return parts
	}

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
	<PageContainer size="md">
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
					<div
						v-if="code"
						class="sy-code text-primary mb-4"
					>
						<span class="d-sr-only">{{ codeErrorText }}</span>
						{{ code }}
					</div>

					<h1
						v-if="pageTitle"
						class="mb-2 font-weight-bold text-h5 mb-4"
					>
						{{ pageTitle }}
					</h1>

					<p v-if="message">
						<template
							v-for="(part, index) in splitMessage(message)"
							:key="index"
						>
							<span v-if="part.type === 'text'">
								{{ part.value }}
							</span>
							<a
								v-else
								:href="`tel:${part.value}`"
							>
								{{ part.value }}
							</a>
						</template>
					</p>

					<slot name="additional-content" />

					<slot name="action">
						<VBtn
							v-if="!hideBtn && btnText && (btnLink || btnHref)"
							:to="btnLink"
							:href="btnHref"
							color="primary"
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
.sy-code {
	font-size: 6rem;
	line-height: 6rem;
	font-weight: 400;
}
</style>
