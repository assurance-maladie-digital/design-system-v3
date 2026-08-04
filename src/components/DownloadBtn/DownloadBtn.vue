<script setup lang="ts">
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { downloadFile } from '@/utils/functions/downloadFile'
	import { mdiDownload } from '@mdi/js'
	import type { AxiosResponse } from 'axios'
	import deepmerge from 'deepmerge'
	import { computed, ref, useAttrs } from 'vue'
	import { config } from './config'
	import { locales as defaultLocales } from './locales'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import { useLocales } from '@/composables/useLocales'
	import type { DeepPartial } from '@/utils/locales/mergeLocales'

	type State = 'idle' | 'loading' | 'success' | 'error'

	export interface FileInfo {
		name: string
		type: string | undefined
	}

	export interface Props {
		filePromise: () => Promise<AxiosResponse<Blob>>
		fallbackFilename?: string
		backgroundColor?: string
		dark?: boolean
		locales?: DeepPartial<typeof defaultLocales>
	}

	defineOptions({
		inheritAttrs: false,
	})

	const props = withDefaults(defineProps<Props & CustomizableOptions>(), {
		fallbackFilename: undefined,
		backgroundColor: 'white',
		dark: false,
		locales: () => ({}),
	})

	const locales = useLocales(defaultLocales, () => props.locales)

	const emits = defineEmits(['error', 'success'])
	const attrs = useAttrs()
	const state = ref<State>('idle')
	const options = useCustomizableOptions(config, props)
	const btnOptions = computed(() => deepmerge(options.value.btn, attrs))
	const isDark = computed(() => props.dark ?? false)
	const buttonColor = computed(() => isDark.value ? 'white' : options.value.btn.color)
	const buttonBgColor = computed(() => isDark.value ? 'transparent' : props.backgroundColor)
	const iconColor = computed(() => isDark.value ? 'white' : options.value.icon.color)

	/**
	 * Get filename and content type from headers
	 */
	function getFileInfo(header: Record<string, string>): FileInfo {
		const contentType = header['content-type']
		const contentDispositionHeader = header['content-disposition']
		let fileName: string | undefined

		fileName = contentDispositionHeader
			?.split(';')
			?.find((str: string) => str.includes('filename='))
			?.split('=')?.[1]

		if (!fileName) {
			fileName = props.fallbackFilename || 'file'
		}

		return {
			name: fileName,
			type: contentType,
		}
	}

	async function download(): Promise<void> {
		state.value = 'loading'

		try {
			const { data, headers } = await props.filePromise()
			const { name, type } = getFileInfo(headers as Record<string, string>)
			downloadFile(data, name, type)
		}
		catch (error) {
			state.value = 'error'
			emits('error', error)
			return
		}
		state.value = 'success'
		emits('success')
	}

	defineExpose({
		getFileInfo, download, state,
	})

</script>

<template>
	<VBtn
		v-bind="btnOptions"
		:loading="state === 'loading'"
		class="sy-download-btn"
		:class="{ 'sy-download-btn--dark': isDark }"
		:color="buttonColor"
		:style="`background-color: ${buttonBgColor}`"
		data-testid="download-btn"
		@click="download"
	>
		<slot name="icon">
			<SyIcon
				v-bind="options.icon"
				:icon="mdiDownload"
				:color="iconColor"
				decorative
			/>
		</slot>

		<slot />

		<template #loader>
			<p
				class="d-sr-only"
				aria-live="polite"
			>
				{{ locales.loader }}
			</p>
			<VProgressCircular
				color="currentColor"
				indeterminate
				width="2"
			/>
		</template>
	</VBtn>
</template>

<style lang="scss" scoped>
.sy-download-btn :deep() {
	.v-btn__content {
		flex-wrap: wrap;
	}

	.v-icon {
		flex: none;
	}
}

.sy-download-btn:focus-visible {
	outline: 2px solid rgb(var(--v-theme-primary));
	outline-offset: 3px;
}

.sy-download-btn--dark:focus-visible {
	outline-color: rgb(var(--v-theme-onPrimary));
}
</style>
