<script setup lang="ts">
	import { mdiCached, mdiImageOutline, mdiPause } from '@mdi/js'
	import { ref, watch } from 'vue'
	import CaptchaAlert from './CaptchaAlert.vue'
	import CaptchaBase from './CaptchaBase.vue'
	import CaptchaBtn from './CaptchaBtn.vue'
	import CaptchaForm from './CaptchaForm.vue'
	import CaptchaHelpdesk from './CaptchaHelpdesk.vue'
	import CaptchaImg from './CaptchaImg.vue'
	import CaptchaInformation from './CaptchaInformation.vue'
	import volumeUp from './icons/volumeUp.vue'
	import { locales as defaultLocales } from './locales'
	import { type CaptchaType, type StateType } from './types'

	const props = withDefaults(defineProps<{
		urlCreate: string
		urlGetImage: string
		urlGetAudio: string
		modelValue?: string | undefined
		errorMessage?: string
		type?: CaptchaType
		tagTitle?: string
		helpDesk?: string | false
		locale?: string
		locales?: typeof defaultLocales
	}>(), {
		modelValue: undefined,
		errorMessage: undefined,
		type: 'image',
		helpDesk: '3648',
		tagTitle: 'h3',
		locale: navigator.language,
		locales: () => defaultLocales,
	})

	const emit = defineEmits<{
		(e: 'update:modelValue', modelValue: string | null): void
		(e: 'update:type', type: CaptchaType): void
		(e: 'imageError'): void
		(e: 'audioError'): void
		(e: 'creationError'): void
	}>()
	const text = ref<string | null>(null)
	const type = ref<CaptchaType>(props.type)
	const id = ref<string | null>(null)
	const state = ref<StateType>('idle')
	const captchaValid = ref<boolean>(false)

	watch(() => props.modelValue, (val) => {
		text.value = val ?? null
	}, { immediate: true })

	watch(() => props.type, (val) => {
		type.value = val
	}, { immediate: true })

	watch(text, (val) => {
		if (val !== props.modelValue) {
			emit('update:modelValue', val ?? '')
		}
	})

	function createCaptchaInit() {
		text.value = null
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

	function emitErrorEvent(err: Error) {
		if (err.message === 'Audio failed to load') {
			emit('audioError')
		}
		else {
			emit('creationError')
		}
	}

</script>

<template>
	<div>
		<CaptchaInformation
			:type="type"
			:locales
		/>

		<CaptchaBase
			v-model="type"
			:url-create="urlCreate"
			:url-get-image="urlGetImage"
			:url-get-audio="urlGetAudio"
			:locales
			:locale
			@update:model-value="emitChangeTypeEvent"
			@create-captcha:init="createCaptchaInit"
			@create-captcha:success="createCaptchaSuccess"
			@create-captcha:error="emitErrorEvent"
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
					:locales
					class="mt-4"
					@image-error="emit('imageError')"
				/>

				<CaptchaAlert
					v-else
					:locales
					class="mt-2"
					@click="chooseImage"
				>
					{{ err }}
				</CaptchaAlert>

				<CaptchaForm
					v-model="text"
					:locales
					:label="locales.image.textfieldLabel"
					:state="createCaptchaState"
					:errors="props.errorMessage ? [props.errorMessage] : []"
					:loading="state === 'pending'"
					:success="captchaValid"
					@update:model-value="emitChangeValueEvent"
				/>

				<div class="captcha-config pt-4 d-flex flex-column ga-2 align-start">
					<p class="label-options text-textSubdued">
						{{ locales.hardToRead }}
					</p>

					<CaptchaBtn
						data-test-id="captcha-image-new"
						:prepend-icon="mdiCached"
						@click="chooseImage"
					>
						{{ locales.image.new }}
					</CaptchaBtn>

					<CaptchaBtn
						data-test-id="captcha-image-change"
						@click="chooseAudio"
					>
						<volume-up
							fill="#0C419A"
							aria-hidden="true"
							height="16"
							width="16"
						/>
						{{ locales.image.change }}
					</CaptchaBtn>

					<CaptchaHelpdesk
						:phone-number="props.helpDesk"
						:localized-message="locales.helpDesk"
					/>
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
					:aria-label="createCaptchaState === 'pending' ? locales.audio.loading : undefined"
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
						<volume-up
							fill="#fff"
							aria-hidden="true"
							height="16"
							width="16"
						/>
						{{ locales.play }}
					</span>
				</VBtn>

				<CaptchaAlert
					v-else
					:locales
					class="mt-2"
					@click="chooseAudio"
				>
					{{ err }}
				</CaptchaAlert>

				<CaptchaForm
					v-model="text"
					:locales
					:label="locales.audio.textfieldLabel"
					:state="createCaptchaState"
					:loading="state === 'pending'"
					:errors="props.errorMessage ? [props.errorMessage] : []"
					:success="captchaValid"
					@update:model-value="emitChangeValueEvent"
				/>
				<div class="captcha-config pt-4 d-flex flex-column ga-2 align-start">
					<p class="label-options text-textSubdued">
						{{ locales.hardToRead }}
					</p>

					<CaptchaBtn
						data-test-id="captcha-audio-new"
						:prepend-icon="mdiCached"
						@click="chooseAudio"
					>
						{{ locales.audio.new }}
					</CaptchaBtn>
					<CaptchaBtn
						data-test-id="captcha-audio-change"
						:prepend-icon="mdiImageOutline"
						@click="chooseImage"
					>
						{{ locales.audio.change }}
					</CaptchaBtn>
					<CaptchaHelpdesk
						:phone-number="props.helpDesk"
						:localized-message="locales.helpDesk"
					/>
				</div>
			</template>

			<template
				#default="{
					chooseImage,
					chooseAudio
				}"
			>
				<div class="captcha-config pt-4 d-flex flex-column ga-2 align-start">
					<p class="label-options text-textSubdued">
						{{ locales.choiceCaptchaTitle }}
					</p>
					<CaptchaBtn
						:prepend-icon="mdiImageOutline"
						@click="chooseImage"
					>
						{{ locales.choiceCaptcha.image }}
					</CaptchaBtn>
					<CaptchaBtn
						@click="chooseAudio"
					>
						<volume-up
							fill="#0C419A"
							aria-hidden="true"
							height="16"
							width="16"
						/>
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

.captcha-audio :deep(.v-btn__content) span {
	display: flex;
	align-items: center;
	gap: tokens.$gap-2;
	letter-spacing: 0%;
}

</style>
