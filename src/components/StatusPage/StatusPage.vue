<script setup lang="ts">
	import type { RouteRecordRaw } from 'vue-router'
	import PageContainer from '../PageContainer/PageContainer.vue'
	import { useId } from 'vue'
	import type { PageAriaRole } from '../types'
	import SyHeading from '../SyHeading/SyHeading.vue'

	type MessagePart =
		| { type: 'text', value: string }
		| { type: 'phone', value: string }

	// Fonction pour formater le message et ajouter des liens tel: aux numéros de téléphone
	const splitMessage = (message?: string): MessagePart[] => {
		// Regex pour détecter les numéros de téléphone
		if (!message)
			return []

		const regex = /\b(\d{4}|\d{10})\b/g
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
				value: match[1]!,
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
		uniqueId?: string
		role?: PageAriaRole
	}>(), {
		pageTitle: undefined,
		message: undefined,
		code: undefined,
		codeErrorText: 'Code d\'erreur\xa0: ',
		btnText: undefined,
		btnLink: '/',
		btnHref: undefined,
		hideBtn: false,
		uniqueId: useId(),
		role: undefined,
	})

	const emit = defineEmits(['btn-click'])
	const emitClickEvent = (): void => {
		emit('btn-click')
	}
</script>

<template>
	<PageContainer
		size="md"
		:unique-id="uniqueId"
		:role="role"
		:aria-labelledby="role ? `${uniqueId}-title` : undefined"
	>
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

					<SyHeading
						v-if="pageTitle"
						:id="role ? `${uniqueId}-title` : undefined"
						class="mb-2 font-weight-bold text-h5 mb-4"
						:level="1"
					>
						{{ pageTitle }}
					</SyHeading>

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
							:to="btnHref ? undefined : btnLink"
							:href="btnHref"
							color="primary"
							class="mt-6"
							@click="emitClickEvent"
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
