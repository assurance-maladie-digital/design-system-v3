<script setup lang="ts">
	import { mdiCached, mdiImageOutline, mdiPause } from '@mdi/js'
	import { computed, readonly as readonlyState, ref, toRef, watch } from 'vue'
	import CaptchaAlert from './CaptchaAlert.vue'
	import CaptchaBase from './CaptchaBase.vue'
	import CaptchaBtn from './CaptchaBtn.vue'
	import CaptchaForm from './CaptchaForm.vue'
	import CaptchaHelpdesk from './CaptchaHelpdesk.vue'
	import CaptchaImg from './CaptchaImg.vue'
	import CaptchaInformation from './CaptchaInformation.vue'
	import volumeUp from './icons/volumeUp.vue'
	import { locales as defaultLocales } from './locales'
	import { type CaptchaProps, type CaptchaType, type StateType } from './types'
	import { useCaptchaValidation } from './useCaptchaValidation'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import { validationPropsDefaults } from '@/composables/unifyValidation/useValidation'

	const props = withDefaults(defineProps<CaptchaProps>(), {
		modelValue: undefined,
		type: 'image',
		helpDesk: '3648',
		tagTitle: 'h3',
		isClearable: false,
		locale: navigator.language,
		locales: () => defaultLocales,
		...validationPropsDefaults,
	})

	const emit = defineEmits<{
		(e: 'update:modelValue', modelValue: string | null): void
		(e: 'update:type', type: CaptchaType): void
		(e: 'imageError'): void
		(e: 'audioError'): void
		(e: 'creationError'): void
	}>()
	const text = ref<string | null>(props.modelValue ?? null)
	const type = ref<CaptchaType>(props.type)
	const id = ref<string | null>(null)
	const state = ref<StateType>('idle')

	watch(() => props.modelValue, (val) => {
		text.value = val ?? null
	})

	watch(() => props.type, (val) => {
		type.value = val
		clearValidation()
	})

	watch(text, (val) => {
		if (val !== props.modelValue) {
			emit('update:modelValue', val ?? '')
		}
	})

	let firstLoading = true
	function createCaptchaInit() {
		if (firstLoading) {
			return
		}
		text.value = null
	}

	function createCaptchaSuccess(captchaId: string | null) {
		id.value = captchaId
		if (firstLoading) {
			firstLoading = false
			return
		}
		clearValidation()
	}

	function emitChangeValueEvent(val: string) {
		text.value = val
	}

	function emitChangeTypeEvent() {
		clearValidation()
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

	const focused = ref(false)

	const { validate, clearValidation, errors, warnings, successes, hasError, hasWarning, hasSuccess } = useCaptchaValidation({
		modelValue: text,
		readonly: toRef(props, 'readonly'),
		disabled: toRef(props, 'disabled'),
		required: toRef(props, 'required'),
		isValidateOnBlur: toRef(props, 'isValidateOnBlur'),
		showSuccessMessages: toRef(props, 'showSuccessMessages'),
		disableErrorHandling: toRef(props, 'disableErrorHandling'),
		useVuetifyValidation: toRef(props, 'useVuetifyValidation'),
		label: computed(() => type.value === 'image' ? props.locales.image.textfieldLabel : props.locales.audio.textfieldLabel),
		rules: toRef(props, 'rules'),
		customRules: toRef(props, 'customRules'),
		customWarningRules: toRef(props, 'customWarningRules'),
		customSuccessRules: toRef(props, 'customSuccessRules'),
		errorMessages: toRef(props, 'errorMessages'),
		warningMessages: toRef(props, 'warningMessages'),
		successMessages: toRef(props, 'successMessages'),
		hasErrorProp: toRef(props, 'hasError'),
		hasWarningProp: toRef(props, 'hasWarning'),
		hasSuccessProp: toRef(props, 'hasSuccess'),
		maxErrors: toRef(props, 'maxErrors'),
		focused,
		locales: toRef(props, 'locales'),
	})

	function onFocus() {
		focused.value = true
	}

	function onBlur() {
		focused.value = false
	}

	function reset() {
		text.value = null
		state.value = 'idle'
		clearValidation()
	}

	defineExpose({
		validateOnSubmit: validate,
		clearValidation,
		reset,
		captchaId: id,
		errors: readonlyState(errors),
		warnings: readonlyState(warnings),
		successes: readonlyState(successes),
	})

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
					:loading="state === 'pending'"
					:error-messages="errors"
					:warning-messages="warnings"
					:success-messages="successes"
					:has-error="hasError"
					:has-warning="hasWarning"
					:has-success="hasSuccess"
					:show-success-messages="props.showSuccessMessages"
					:required="props.required"
					:max-errors="props.maxErrors"
					:is-clearable="props.isClearable"
					@update:model-value="emitChangeValueEvent"
					@focus="onFocus"
					@blur="onBlur"
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
						<SyIcon
							:icon="mdiPause"
							decorative
						/>
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
					:label="locales.image.textfieldLabel"
					:state="createCaptchaState"
					:loading="state === 'pending'"
					:error-messages="errors"
					:warning-messages="warnings"
					:success-messages="successes"
					:has-error="hasError"
					:has-warning="hasWarning"
					:has-success="hasSuccess"
					:show-success-messages="props.showSuccessMessages"
					:required="props.required"
					:max-errors="props.maxErrors"
					:is-clearable="props.isClearable"
					@update:model-value="emitChangeValueEvent"
					@focus="onFocus"
					@blur="onBlur"
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
					<CaptchaBtn @click="chooseAudio">
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
.label-options {
	font-size: 0.875rem;
	font-weight: 400;
}

.captcha-audio :deep(.v-btn__content) span {
	display: flex;
	align-items: center;
	gap: var(--v-gap-2);
	letter-spacing: 0%;
}
</style>
