<script setup lang="ts">
	import { mdiCached, mdiImageOutline, mdiPause, mdiVolumeHigh } from '@mdi/js'
	import { type AxiosError, type AxiosResponse } from 'axios'
	import { onMounted, ref, watch } from 'vue'
	import CaptchaAlert from './CaptchaAlert.vue'
	import CaptchaBase from './CaptchaBase.vue'
	import CaptchaBtn from './CaptchaBtn.vue'
	import CaptchaForm from './CaptchaForm.vue'
	import CaptchaImg from './CaptchaImg.vue'
	import CaptchaInformation from './CaptchaInformation.vue'
	import { locales } from './locales'
	import { type CaptchaType, type StateType } from './types'
	import SyAlert from '../SyAlert/SyAlert.vue'

	const props = withDefaults(defineProps<{
		urlCreate: string
		urlGetImage: string
		urlGetAudio: string
		service: (id: string | null, value: string | null) => Promise<AxiosResponse>
		modelValue?: string | undefined
		defaultType?: CaptchaType
		tagTitle?: string
		helpDesk?: string
	}>(), {
		modelValue: undefined,
		defaultType: 'image',
		helpDesk: '3648',
		tagTitle: 'h3',
	})

	const emit = defineEmits<{
		(e: 'update:modelValue', modelValue: string | null): void
		(e: 'update:type', type: CaptchaType): void
		(e: 'validation:click', payload: { captchaId: string | null, captchaValue: string | null }): void
		(e: 'validation:success', response: AxiosResponse): void
		(e: 'validation:error', error: unknown): void
	}>()
	const text = ref<string | null>(null)
	const type = ref<CaptchaType>(props.defaultType ?? 'image')
	const id = ref<string | null>(null)
	const state = ref<StateType>('idle')
	const errorMessage = ref<string | null>(null)

	// --- Watchers ---
	watch(() => props.modelValue, (val) => {
		text.value = val ?? null
	}, { immediate: true })

	watch(text, (val) => {
		if (val !== props.modelValue) {
			emit('update:modelValue', val ?? '')
		}
	})

	onMounted(() => {
		type.value = props.defaultType ?? 'image'
	})

	// --- Methods ---
	async function submitForm() {
		emitValidateEvent()

		if (!props.service) return

		errorMessage.value = null
		state.value = 'pending'

		try {
			const res = await props.service(id.value, text.value)
			state.value = 'resolved'
			emit('validation:success', res)
		}
		catch (error) {
			state.value = 'rejected'
			errorMessage.value = (error as AxiosError<{ message: string }>).response?.data?.message ?? 'Erreur inconnue'
			emit('validation:error', error)
		}
	}

	function createCaptchaInit() {
		text.value = null
		errorMessage.value = null
	}

	function createCaptchaSuccess(captchaId: string | null) {
		id.value = captchaId
	}

	function emitChangeValueEvent(val: string) {
		text.value = val
	}

	function emitChangeTypeEvent() {
		emit('update:type', type.value)
	}

	function emitValidateEvent() {
		emit('validation:click', {
			captchaId: id.value,
			captchaValue: text.value,
		})
	}
</script>

<template>
	<div>
		<CaptchaInformation :type="type">
			<template
				v-if="errorMessage"
				#error
			>
				<SyAlert
					class="mt-2"
					variant="outlined"
					type="error"
				>
					{{ errorMessage }}
				</SyAlert>
			</template>
		</CaptchaInformation>

		<CaptchaBase
			v-model="type"
			:url-create="urlCreate"
			:url-get-image="urlGetImage"
			:url-get-audio="urlGetAudio"
			@update:model-value="emitChangeTypeEvent"
			@create-captcha:init="createCaptchaInit"
			@create-captcha:success="createCaptchaSuccess"
		>
			<!-- Image captcha -->
			<template
				#image="{
					chooseImage,
					chooseAudio,
					url,
					state: createCaptchaState,
					isError,
					errorMessage: err
				}"
			>
				<CaptchaImg
					v-if="!isError"
					:src="url"
					:state="createCaptchaState"
					class="mt-4"
				/>

				<CaptchaAlert
					v-else
					class="mt-2"
					@click="chooseImage"
				>
					{{ err }}
				</CaptchaAlert>

				<CaptchaForm
					v-model="text"
					:label="locales.image.textfieldLabel"
					:state="createCaptchaState"
					:errors="errorMessage ? [errorMessage] : []"
					:loading="state === 'pending'"
					@update:model-value="emitChangeValueEvent"
					@submit="submitForm"
				/>

				<div class="captcha-config pt-4 d-flex flex-column ga-2 align-start">
					<p class="label-options text-textSubdued">
						{{ locales?.hardToRead }}
					</p>

					<CaptchaBtn
						:prepend-icon="mdiCached"
						@click="chooseImage"
					>
						{{ locales.image.new }}
					</CaptchaBtn>

					<CaptchaBtn
						:prepend-icon="mdiVolumeHigh"
						@click="chooseAudio"
					>
						{{ locales.image.change }}
					</CaptchaBtn>
				</div>
			</template>

			<!-- Audio captcha -->
			<template
				#audio="{
					chooseImage,
					chooseAudio,
					toggleAudio,
					state: createCaptchaState,
					isPlaying,
					isError,
					errorMessage: err
				}"
			>
				<VBtn
					v-if="!isError"
					:loading="createCaptchaState === 'pending'"
					class="captcha-audio mt-4 text-none"
					color="primary"
					height="44"
					block
					@click="toggleAudio"
				>
					<span v-if="isPlaying">
						<VIcon>{{ mdiPause }}</VIcon>
						{{ locales.pause }}
					</span>

					<span v-else>
						<VIcon>{{ mdiVolumeHigh }}</VIcon>
						{{ locales.play }}
					</span>
				</VBtn>

				<CaptchaAlert
					v-else
					class="mt-2"
					@click="chooseAudio"
				>
					{{ err }}
				</CaptchaAlert>

				<CaptchaForm
					v-model="text"
					:label="locales.audio.textfieldLabel"
					:state="createCaptchaState"
					:loading="state === 'pending'"
					:errors="errorMessage ? [errorMessage] : []"
					@update:model-value="emitChangeValueEvent"
					@submit="submitForm"
				/>
				<div class="captcha-config pt-4 d-flex flex-column ga-2 align-start">
					<p class="label-options text-textSubdued">
						{{ locales?.hardToRead }}
					</p>

					<CaptchaBtn
						:prepend-icon="mdiCached"
						@click="chooseAudio"
					>
						{{ locales.audio.new }}
					</CaptchaBtn>
					<CaptchaBtn
						:prepend-icon="mdiImageOutline"
						@click="chooseImage"
					>
						{{ locales.audio.change }}
					</CaptchaBtn>
				</div>
			</template>

			<!-- Default captcha -->
			<template
				#default="{
					chooseImage,
					chooseAudio
				}"
			>
				<div class="captcha-config pt-4 d-flex flex-column ga-2 align-start">
					<CaptchaBtn
						:prepend-icon="mdiImageOutline"
						@click="chooseImage"
					>
						{{ locales.choiceCaptcha.image }}
					</CaptchaBtn>
					<CaptchaBtn
						:prepend-icon="mdiVolumeHigh"
						@click="chooseAudio"
					>
						{{ locales.choiceCaptcha.audio }}
					</CaptchaBtn>
				</div>
			</template>
		</CaptchaBase>
	</div>
</template>

<style scoped lang="scss">
@use '@/assets/tokens';

	.label-options {
		font-size: 0.875rem;
		font-weight: 400;
	}

	.captcha-config {
		border-top: 1px solid tokens.$colors-border-subdued;
	}

	.captcha-audio {
		letter-spacing: 0%;
	}

</style>
