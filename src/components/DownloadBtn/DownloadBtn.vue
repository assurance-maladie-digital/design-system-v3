<script lang="ts" setup>
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { downloadFile } from '@/utils/functions/downloadFile'
	import { mdiDownload } from '@mdi/js'
	import type { AxiosResponse } from 'axios'
	import deepmerge from 'deepmerge'
	import { computed, ref, useAttrs } from 'vue'
	import { config } from './config'

	type State = 'idle' | 'loading' | 'success' | 'error'

	export interface FileInfo {
		name: string
		type: string
	}

	export interface Props {
		filePromise: () => Promise<AxiosResponse<Blob>>
		fallbackFilename?: string
	}

	defineOptions({
		inheritAttrs: false,
	})

	const props = withDefaults(defineProps<Props & CustomizableOptions>(), {
		fallbackFilename: undefined,
	})
	const emits = defineEmits(['error', 'success'])
	const attrs = useAttrs()
	const state = ref<State>('idle')
	const options = useCustomizableOptions(config, props)
	const btnOptions = computed(() => deepmerge(options.value.btn, attrs))

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
		:class="btnOptions.variant === 'outlined' ? 'outlined-style' : ''"
		:loading="state === 'loading'"
		class="vd-download-btn"
		data-testid="download-btn"
		v-bind="btnOptions"
		@click="download"
	>
		<slot name="icon">
			<VIcon v-bind="options.icon">
				{{ mdiDownload }}
			</VIcon>
		</slot>

		<slot />
	</VBtn>
</template>

<style lang="scss" scoped>
.vd-download-btn :deep() {
  .v-btn__content {
    flex-wrap: wrap;
  }

  .v-icon {
    flex: none;
  }
}

.outlined-style {
  border: 1px solid currentColor;
}
</style>
