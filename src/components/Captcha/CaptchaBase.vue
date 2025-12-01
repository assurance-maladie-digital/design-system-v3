<script setup lang="ts">
	import { onMounted, ref, watch } from 'vue'
	import {
		createCaptchaAudio,
		createCaptchaImage,
		getCaptchaAudioUrl,
		getCaptchaImageUrl,
	} from './captchaApi'
	import type { CaptchaType, StateType } from './types'
	import type { locales as defaultLocales } from './locales'

	const props = defineProps<{
		modelValue: CaptchaType
		urlCreate: string
		urlGetImage: string
		urlGetAudio: string
		locale: string
		locales: typeof defaultLocales
	}>()

	const emit = defineEmits<{
		(e: 'update:modelValue', modelValue: CaptchaType): void
		(e: 'create-captcha:init'): void
		(e: 'create-captcha:error', error: Error): void
		(e: 'create-captcha:success', id: string | null): void
	}>()

	const type = ref<CaptchaType>(props.modelValue)
	const id = ref<string | null>(null)
	const url = ref<string | null>(null)
	const audioElement = ref<HTMLAudioElement | null>(null)
	const isPlaying = ref(false)
	const isError = ref(false)
	const errorMessage = ref<string | null>(null)
	const state = ref<StateType>('idle')

	onMounted(async () => {
		await chooseType(props.modelValue)
	})

	watch(() => props.modelValue, async (newType) => {
		if (type.value !== newType) {
			type.value = newType
			await chooseType(newType)
		}
	})

	async function chooseType(selectedType: CaptchaType) {
		updateType(selectedType)
		resetError()

		switch (selectedType) {
		case 'image':
			createImage()
			break
		case 'audio':
			createAudio()
			break
		default:
			break
		}
	}

	function chooseImage() {
		chooseType('image')
	}

	function chooseAudio() {
		chooseType('audio')
	}

	function createImage() {
		emitCreateInitEvent()
		resetValues()

		createCaptchaImage(
			props.urlCreate,
			(captchaId: string) => {
				id.value = captchaId
				url.value = getCaptchaImageUrl(props.urlGetImage, captchaId)
				emitCreateSuccessEvent()
				state.value = 'resolved'
			},
			onCreateCaptchaError,
			props.locale,
		)
	}

	function createAudio() {
		emitCreateInitEvent()
		resetValues()

		createCaptchaAudio(
			props.urlCreate,
			(captchaId: string) => {
				id.value = captchaId
				url.value = getCaptchaAudioUrl(props.urlGetAudio, captchaId)

				audioElement.value = new Audio(url.value)
				audioElement.value.addEventListener('ended', () => {
					isPlaying.value = false
				})
				audioElement.value.addEventListener('error', () => {
					onCreateCaptchaError(new Error('Audio failed to load'))
				})

				emitCreateSuccessEvent()
				state.value = 'resolved'
			},
			onCreateCaptchaError,
			props.locale,
		)
	}

	function resetValues() {
		// Stop audio and clean up in a safe order
		if (audioElement.value) {
			try {
				audioElement.value.pause()
			}
			catch {
				// Ignore errors if audio element is already disposed
			}
			audioElement.value = null
		}

		url.value = null
		id.value = null
		state.value = 'pending'
	}

	function resetError() {
		isError.value = false
		errorMessage.value = null
	}

	function toggleAudio() {
		if (!audioElement.value) return

		if (isPlaying.value) {
			audioElement.value.pause()
			isPlaying.value = false
		}
		else {
			audioElement.value.play()
			isPlaying.value = true
		}
	}

	function onCreateCaptchaError(error: Error) {
		isError.value = true

		try {
			errorMessage.value = JSON.parse(error.message)
		}
		catch {
			errorMessage.value = props.locales.defaultErrorMessage
		}

		emitCreateErrorEvent(error)
		state.value = 'rejected'
	}

	function updateType(selectedType: CaptchaType) {
		type.value = selectedType
		emitTypeChangeEvent(selectedType)
	}

	function emitTypeChangeEvent(newType: CaptchaType) {
		emit('update:modelValue', newType)
	}

	function emitCreateInitEvent() {
		emit('create-captcha:init')
	}

	function emitCreateErrorEvent(error: Error) {
		emit('create-captcha:error', error)
	}

	function emitCreateSuccessEvent() {
		emit('create-captcha:success', id.value)
	}
</script>

<template>
	<div class="captcha">
		<slot
			v-if="type === 'image'"
			name="image"
			:choose-image="chooseImage"
			:choose-audio="chooseAudio"
			:url="url"
			:is-error="isError"
			:error-message="errorMessage"
			:state="state"
		/>

		<slot
			v-else-if="type === 'audio'"
			name="audio"
			:choose-image="chooseImage"
			:choose-audio="chooseAudio"
			:toggle-audio="toggleAudio"
			:url="url"
			:is-error="isError"
			:error-message="errorMessage"
			:is-playing="isPlaying"
			:state="state"
		/>

		<slot
			v-else
			name="default"
			:choose-image="chooseImage"
			:choose-audio="chooseAudio"
			:is-error="isError"
			:error-message="errorMessage"
			:state="state"
		/>
	</div>
</template>
