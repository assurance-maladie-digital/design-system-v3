<script setup lang="ts">
	import {
		mdiFile,
		mdiTrayArrowUp,
		mdiDeleteOutline,
		mdiEyeOutline,
		mdiAlertCircle,
		mdiCheckCircle,
	} from '@mdi/js'
	import { cnamContextualTokens } from '@/designTokens/tokens/cnam/cnamContextual'
	import { locales as defaultLocales } from './locales'

	type FileState = 'initial' | 'success' | 'error' | 'loading'

	defineEmits<{
		(e: 'upload', item: string): void
		(e: 'preview', item: string): void
		(e: 'delete', item: string): void
	}>()

	withDefaults(defineProps<{
		itemId: string
		title: string
		fileName?: string
		message?: string
		optional?: boolean
		state?: FileState
		progress?: number
		showUploadBtn?: boolean
		showDeleteBtn?: boolean
		showPreviewBtn?: boolean
		tag?: string
		locales?: typeof defaultLocales
	}>(), {
		fileName: undefined,
		message: undefined,
		optional: false,
		state: 'initial',
		progress: undefined,
		showUploadBtn: true,
		showDeleteBtn: true,
		showPreviewBtn: false,
		tag: 'div',
		locales: () => defaultLocales,
	})

	defineSlots<{
		'file-icon'(props: { state: FileState }): void
	}>()

</script>

<template>
	<component
		:is="tag"
		class="file-item"
	>
		<div class="file-item__description">
			<div class="file-item__content">
				<span
					class="file-item__icon"
				>
					<slot
						name="file-icon"
						:state
					>
						<span
							v-if="state === 'success'"
							class="d-sr-only"
						>
							{{ locales.success }}
						</span>

						<span
							v-else-if="state === 'error'"
							class="d-sr-only"
						>
							{{ locales.error }}
						</span>

						<VIcon
							v-if="state === 'error'"
							:size="cnamContextualTokens.iconSize.default"
							:aria-label="locales.error"
							color="error"
						>{{ mdiAlertCircle }}</VIcon>

						<VIcon
							v-else-if="state === 'success'"
							:size="cnamContextualTokens.iconSize.default"
							:aria-label="locales.success"
							color="success"
						>{{ mdiCheckCircle }}</VIcon>

						<VIcon
							v-else
							:size="cnamContextualTokens.iconSize.default"
							color="primary"
						>{{ mdiFile }}</VIcon>
					</slot>
				</span>
				<div>
					<div class="file-item__title">
						{{ title }}
					</div>
					<div class="file-item__name text-base">
						{{ fileName }}
					</div>
					<div
						v-if="message || optional"
						class="file-item__message text-base"
					>
						{{ message ?? locales.optionalDocument }}
					</div>
					<div
						v-if="state === 'error'"
						class="file-item__error-message text-error"
					>
						{{ locales.error }}
					</div>
				</div>
			</div>
			<div class="file-item__actions">
				<VBtn
					v-if="(state === 'initial' || state == 'error') && showUploadBtn"
					class="file-item__action file-item__action-upload text-primary"
					variant="text"
					@click="$emit('upload', itemId)"
				>
					<span>Importer</span>
					<template #prepend>
						<VIcon
							color="primary"
						>
							{{ mdiTrayArrowUp }}
						</VIcon>
					</template>
				</VBtn>
				<VBtn
					v-if="state === 'success' && showPreviewBtn"
					class="file-item__action file-item__action-preview text-primary"
					variant="text"
					@click="$emit('preview', itemId)"
				>
					<span>{{ locales.see }}</span>
					<template #prepend>
						<VIcon
							color="primary"
						>
							{{ mdiEyeOutline }}
						</VIcon>
					</template>
				</VBtn>
				<VBtn
					v-if="state === 'success' && showDeleteBtn"
					class="file-item__action file-item__action-delete text-error"
					variant="text"
					@click="$emit('delete', itemId)"
				>
					<span>{{ locales.delete }}</span>
					<template #prepend>
						<VIcon
							color="error"
						>
							{{ mdiDeleteOutline }}
						</VIcon>
					</template>
				</VBtn>
			</div>
		</div>

		<div
			v-if="state === 'loading'"
			class="file-item__message-progress"
		>
			<p class="d-sr-only">
				{{ locales.uploading }}
			</p>
			<VProgressLinear
				:indeterminate="progress === undefined"
				:model-value="progress"
				:progress="progress"
				height="7"
				color="primary"
				rounded="true"
			/>
		</div>
	</component>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

.file-item {
	display: flex;
	flex-direction: column;
	gap: tokens.$gap-3;
	padding-block: tokens.$padding-4;
	border-bottom: 1px solid tokens.$colors-border-subdued;
}

.file-item__title {
	font-size: tokens.$font-size-body-text;
}

.file-item__name {
	font-size: 0.875rem;
	color: tokens.$colors-text-base;
}

.file-item__description {
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;

	> * {
		grid-column: 1 / -1;
	}

	> *:nth-child(1),
	> *:nth-child(2) {
		grid-column: 1 / 2;
	}

	> .file-item__actions {
		grid-column-start: 2;
		grid-row: span 2;
	}
}

.file-item__content {
	display: flex;
	gap: tokens.$gap-4;
	align-items: center;
}

.file-item__actions {
	display: flex;
	flex-direction: column;
	align-items: end;
	justify-content: center;
	margin-left: auto;
	height: 100%;
	gap: tokens.$gap-1;

	@media screen and (min-width: tokens.$container-tablet-max-width) {
		flex-direction: row;
	}
}

.file-item__action {
	display: flex;
	justify-content: end;
	text-transform: unset;
	padding: 0.625rem 1.25rem;
	font-weight: bold;
}

.file-item__message {
	font-size: 0.875rem;
	color: tokens.$colors-text-subdued;
}

.file-item__message-success,
.file-item__message-error {
	margin-top: tokens.$gap-3;
}

.file-item__message-error {
	display: flex;
	align-items: center;
	gap: tokens.$gap-4;
}

</style>
