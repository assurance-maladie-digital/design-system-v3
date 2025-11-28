<script setup lang="ts">
	/* eslint-disable vuejs-accessibility/media-has-caption */
	import { type PropType, computed, onMounted, ref } from 'vue'
	import AmeliproBtn from '../AmeliproBtn/AmeliproBtn.vue'
	import AmeliproCard from '../AmeliproCard/AmeliproCard.vue'
	import AmeliproTextField from '../AmeliproTextField/AmeliproTextField.vue'
	import type { ICaptcha } from './types'
	import type { IndexedObject } from '../types'

	const props = defineProps({
		captchaInputLabelAudio: {
			type: String,
			default: 'Code entendu :',
		},
		captchaInputLabelImg: {
			type: String,
			default: 'Caractères de l’image :',
		},
		captchaTitle: {
			type: String,
			default: 'Code de sécurité',
		},
		defaultAudio: {
			type: Boolean,
			default: false,
		},
		imgAlt: {
			type: String,
			default: 'liste de caractères',
		},
		imgMaxWidth: {
			type: String,
			default: '100%',
		},
		imgWidth: {
			type: String,
			default: '320px',
		},
		modelValue: {
			type: Object as PropType<ICaptcha>,
			required: true,
		},
		switchCaptchaTypeLabelAudio: {
			type: String,
			default: 'Utiliser un captcha image',
		},
		switchCaptchaTypeLabelImg: {
			type: String,
			default: 'Utiliser un captcha audio',
		},
		uniqueId: {
			type: String,
			required: true,
		},
		updateCaptchaLabelAudio: {
			type: String,
			default: 'Changer d’audio',
		},
		updateCaptchaLabelImg: {
			type: String,
			default: 'Changer d’image',
		},
	})

	const emit = defineEmits(['click-play', 'click-update', 'click-switch', 'update:model-value'])

	const modelValue = computed({
		get: () => props.modelValue,
		set: (value: ICaptcha) => {
			emit('update:model-value', value)
		},
	})

	const player = ref()
	const audio = ref(props.defaultAudio)
	const readBtnDisabled = ref(false)
	const reading = ref(false)

	const computedImgWidth = computed<IndexedObject>(() => ({
		width: props.imgWidth,
		maxWidth: props.imgMaxWidth,
	}))

	const read = () => {
		if (player.value && player.value !== null) {
			readBtnDisabled.value = true
			player.value.currentTime = 0
			player.value.play()
			reading.value = true
		}
		emit('click-play')
	}

	const resetAudio = () => {
		player.value.pause()
		player.value.currentTime = 0
		readBtnDisabled.value = false
		reading.value = false
	}

	const switchType = () => {
		if (player.value && player.value !== null) {
			resetAudio()
		}
		audio.value = !audio.value
		emit('click-switch', audio.value)
	}

	const updateCaptcha = () => {
		if (player.value && player.value !== null) {
			resetAudio()
		}
		emit('click-update')
	}

	onMounted(() => {
		player.value = document.getElementById(`${props.uniqueId}-player`)
	})
</script>

<template>
	<AmeliproCard
		card-color="ap-grey-lighten-5"
		no-card-header
		:unique-id="uniqueId"
	>
		<p
			:id="`${uniqueId}-title`"
			class="mb-4 font-weight-bold text-h4 amelipro-captcha__title"
		>
			{{ captchaTitle }}
		</p>

		<div
			:id="`${uniqueId}-captcha`"
			class="captcha__wrapper"
		>
			<div v-show="audio">
				<AmeliproBtn
					class="small-spacer btn btn-primary captcha-audio-btn"
					:disabled="readBtnDisabled"
					type="button"
					:unique-id="`${uniqueId}-launch-btn`"
					@click="read"
				>
					Lecture
				</AmeliproBtn>

				<audio
					:id="`${uniqueId}-player`"
					:src="modelValue.audioSrc"
					@ended="resetAudio"
				/>
			</div>

			<img
				v-show="!audio"
				:id="`${uniqueId}-captcha-img`"
				:alt="imgAlt"
				class="captcha-img"
				:src="modelValue.imgSrc"
				:style="computedImgWidth"
			>

			<AmeliproTextField
				v-model="modelValue.inputValue"
				required
				classes="mt-4"
				input-max-width="320px"
				:label="audio ? captchaInputLabelAudio : captchaInputLabelImg"
				:unique-id="`${uniqueId}-input`"
			/>

			<p
				:id="`${uniqueId}-captcha-text`"
				class="captcha-text"
			>
				<span v-if="audio">
					Vous n'arrivez pas à entendre ?
				</span>

				<span v-else>
					Vous n'arrivez pas à lire ?
				</span>

				<br>

				<AmeliproBtn
					class="text-none captcha-update-btn"
					text
					type="button"
					underline
					:unique-id="`${uniqueId}-update-btn`"
					@click="updateCaptcha"
				>
					<span v-if="audio">
						{{ updateCaptchaLabelAudio }}
					</span>

					<span v-else>
						{{ updateCaptchaLabelImg }}
					</span>
				</AmeliproBtn>

				ou

				<AmeliproBtn
					class="text-none captcha-switch-btn"
					text
					type="button"
					underline
					:unique-id="`${uniqueId}-switch-type-btn`"
					@click="switchType"
				>
					<span v-if="audio">
						{{ switchCaptchaTypeLabelAudio }}
					</span>

					<span v-else>
						{{ switchCaptchaTypeLabelImg }}
					</span>
				</AmeliproBtn>
			</p>
		</div>
	</AmeliproCard>
</template>

<style lang="scss" scoped>
	.captcha-audio-btn {
		width: 320px;
		max-width: 100%;
	}
</style>
