<script setup lang="ts">
	import {
		mdiFolder,
		mdiTrayArrowUp,
		mdiDeleteOutline,
		mdiEyeOutline,
	} from '@mdi/js'
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
					:class="{
						'bg-backgroundInfoSubdued': state === 'initial',
						'bg-backgroundSuccessSubdued': state === 'success',
						'bg-backgroundErrorSubdued': state === 'error',
					}"
				>
					<slot
						name="file-icon"
						:state
					>
						<VIcon
							:size="22"
							class=""
							:color="state === 'success' ? 'success' : state === 'error' ? 'error' : 'primary'"
						>{{ mdiFolder }}</VIcon>
					</slot>
				</span>
				<div>
					<div class="file-item__title">
						{{ title }}
					</div>
					<div class="file-item__name text-base">
						{{ fileName }}
					</div>
				</div>
			</div>
			<div
				v-if="message || optional"
				class="file-item__message"
			>
				{{ message ?? locales.optionalDocument }}
			</div>
			<div
				v-if="state === 'success'"
				class="file-item__message-success"
			>
				<VChip
					color="success"
					variant="flat"
					density="compact"
				>
					{{ locales.success }}
				</VChip>
			</div>
			<div
				v-if="state === 'error'"
				class="file-item__message-error"
			>
				<VChip
					color="backgroundErrorContrasted"
					variant="flat"
					density="compact"
				>
					{{ locales.error }}
				</VChip>
				<p
					class="text-error"
				>
					{{ locales.errorOccurred }}
				</p>
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
			<p class="text-primary">
				{{ locales.uploading }}
			</p>
			<VProgressLinear
				height="7"
				:indeterminate="progress === undefined"
				:model-value="progress"
				:progress="progress"
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
	padding: tokens.$padding-4;
	border-radius: tokens.$radius-rounded;
	background-color: tokens.$colors-background-surface;
}

.file-item__icon {
	padding: 9px;
	border-radius: tokens.$radius-rounded;
	background-color: tokens.$colors-background-main;
}

.file-item__title {
	font-size: tokens.$font-size-body-text;
	font-weight: bold;
}

.file-item__name {
	font-size: 0.875rem;
	color: tokens.$colors-text-base;
}

.file-item__description {
	display: grid;
	grid-template-columns: 1fr auto;
	grid-template-rows: auto auto;
	grid-auto-flow: column;
	align-items: start;

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
	gap: tokens.$gap-1;
}

.file-item__action {
	display: flex;
	justify-content: end;
	text-transform: unset;
	padding: 0.625rem 1.25rem;
	font-weight: bold;
}

.file-item__message {
	margin-top: tokens.$gap-1;
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

.file-item__message-progress {
	display: grid;
	grid-template-columns: auto 1fr;
	align-items: center;
	gap: tokens.$gap-4;
}

</style>
