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
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'

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

						<SyIcon
							v-if="state === 'error'"
							:icon="mdiAlertCircle"
							:size="cnamContextualTokens.iconSize.default"
							color="error"
							decorative
						/>

						<SyIcon
							v-else-if="state === 'success'"
							:icon="mdiCheckCircle"
							:size="cnamContextualTokens.iconSize.default"
							color="success"
							decorative
						/>

						<SyIcon
							v-else
							:size="cnamContextualTokens.iconSize.default"
							color="primary"
							:icon="mdiFile"
							decorative
						/>
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
						class="file-item__error-message text-error"
						role="status"
					>
						<div v-if="state === 'error'">
							{{ locales.error }}
						</div>
					</div>
				</div>
			</div>
			<div class="file-item__actions">
				<VBtn
					v-if="(state === 'initial' || state == 'error') && showUploadBtn"
					class="file-item__action file-item__action-upload text-primary"
					variant="text"
					:aria-label="locales.importLabel(title)"
					@click="$emit('upload', itemId)"
				>
					<span>{{ locales.import }}</span>
					<template #prepend>
						<SyIcon
							color="primary"
							:icon="mdiTrayArrowUp"
							decorative
						/>
					</template>
				</VBtn>
				<VBtn
					v-if="state === 'success' && showPreviewBtn"
					class="file-item__action file-item__action-preview text-primary"
					variant="text"
					:aria-label="locales.seeLabel(title)"
					@click="$emit('preview', itemId)"
				>
					<span>{{ locales.see }}</span>
					<template #prepend>
						<SyIcon
							color="primary"
							:icon="mdiEyeOutline"
							decorative
						/>
					</template>
				</VBtn>
				<VBtn
					v-if="state === 'success' && showDeleteBtn"
					class="file-item__action file-item__action-delete text-error"
					variant="text"
					:aria-label="locales.deleteLabel(title)"
					@click="$emit('delete', itemId)"
				>
					<span>{{ locales.delete }}</span>
					<template #prepend>
						<SyIcon
							color="error"
							:icon="mdiDeleteOutline"
							decorative
						/>
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

	&:first-child:last-child {
		border-bottom: none;
	}
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
