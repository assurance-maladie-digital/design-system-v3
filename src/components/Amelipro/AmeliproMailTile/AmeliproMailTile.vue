<script setup lang="ts">
	import { type PropType, computed, ref } from 'vue'
	import AmeliproIcon from '../AmeliproIcon/AmeliproIcon.vue'
	import type { AmeliproMailTileType } from './types'
	import type { IndexedObject } from '../types'
	import { convertToHex } from '@/utils/functions/convertToHex'
	import { useDisplay } from 'vuetify'

	const props = defineProps({
		editable: {
			type: Boolean,
			default: false,
		},
		mailInfo: {
			type: Object as PropType<AmeliproMailTileType>,
			required: true,
		},
		uniqueId: {
			type: String,
			required: true,
		},
	})

	const { smAndUp } = useDisplay()
	const currentReadValue = ref(props.mailInfo.readValue)
	const hover = ref(false)
	const focus = ref(false)

	const backgroundStyle = computed<IndexedObject>(() => {
		const styles = { backgroundColor: convertToHex('ap-white') }

		if (!currentReadValue.value) {
			styles.backgroundColor = convertToHex('ap-blue-lighten-3')
		}
		return styles
	})

	const emit = defineEmits(['status-change', 'click'])

	const emitStatusChangeEvent = (): void => {
		currentReadValue.value = !currentReadValue.value
		emit('status-change', props.uniqueId)
	}

	const emitClickEvent = (): void => {
		emit('click', props.uniqueId)
	}
</script>

<template>
	<div
		:id="`${uniqueId}-container`"
		class="w-100 amelipro-mail-tile"
	>
		<div
			v-if="editable"
			class="d-flex w-100 amelipro-mail-tile__editable"
		>
			<button
				:id="`${uniqueId}-read-btn`"
				aria-label="Message lu"
				:aria-pressed="currentReadValue ? true : false"
				class="mail-status-btn"
				:class="currentReadValue ? undefined : 'mail-status-btn--not-read'"
				:style="backgroundStyle"
				:title="currentReadValue ? 'Message lu' : 'Message non lu'"
				@click="emitStatusChangeEvent"
			/>

			<VBtn
				:id="`${uniqueId}-mail-btn`"
				class="d-block text-none mail-btn--editable"
				:color="currentReadValue ? 'ap-white' : 'ap-blue-lighten-3'"
				:elevation="0"
				flat
				:href="mailInfo.href"
				:ripple="false"
				:to="mailInfo.to"
				variant="flat"
				@click="emitClickEvent()"
				@focus="focus = true"
				@blur="focus = false"
				@mouseenter="hover = true"
				@mouseleave="hover = false"
			>
				<span class="w-100 mail-btn__content d-flex">
					<span class="w-100 d-flex flex-column flex-sm-row">
						<span class="d-block text-left mail-info__text">
							<span
								:id="`${uniqueId}-mail-object`"
								class="d-block text-h5"
							>
								{{ mailInfo.mailObject }}

								<span
									v-if="mailInfo.commentValue"
									class="d-sr-only"
								>
									&nbsp;[Commentaires disponibles]
								</span>
							</span>

							<span
								:id="`${uniqueId}-message-first-line`"
								class="d-block mt-2"
							>
								{{ mailInfo.messageInfoFirstLine }}
							</span>

							<span
								:id="`${uniqueId}-message-second-line`"
								class="d-block mt-2"
							>
								{{ mailInfo.messageInfoSecondLine }}
							</span>

							<span
								v-if="mailInfo.messageInfoThirdLine"
								:id="`${uniqueId}-message-third-line`"
								class="d-block mt-2"
							>
								{{ mailInfo.messageInfoThirdLine }}
							</span>
						</span>

						<span class="d-block align-self-sm-center mail-info__date">
							<span
								v-if="smAndUp"
								:id="`${uniqueId}-message-date`"
								class="d-block"
							>
								{{ mailInfo.date }}
								<br>
								<span
									:id="`${uniqueId}-message-hour`"
									class="d-block mt-2"
								>
									{{ mailInfo.hour }}
								</span>
							</span>

							<span
								v-else
								:id="`${uniqueId}-message-date-hour`"
								class="d-block mt-2 text-left"
							>
								{{ mailInfo.date }} - {{ mailInfo.hour }}
							</span>
						</span>
					</span>
				</span>

				<AmeliproIcon
					v-if="mailInfo.commentValue"
					class="mail-info__comment-icon"
					icon="triangleUp"
					icon-bg-color="transparent"
					icon-color="ap-pink"
					size="1rem"
					:unique-id="`${uniqueId}-icon`"
				/>
			</VBtn>
		</div>

		<VBtn
			v-else
			:id="`${uniqueId}-mail-btn`"
			class="w-100 text-none mail-btn amelipro-mail-tile__not-editable"
			:class="currentReadValue ? undefined : 'mail-btn--not-read'"
			:color="currentReadValue ? 'ap-white' : 'ap-blue-lighten-3'"
			:elevation="0"
			flat
			:href="mailInfo.href"
			:ripple="false"
			:title="currentReadValue ? 'Message lu' : 'Message non lu'"
			:to="mailInfo.to"
			variant="flat"
			@click="emitClickEvent"
			@focus="focus = true"
			@blur="focus = false"
			@mouseenter="hover = true"
			@mouseleave="hover = false"
		>
			<span class="w-100 mail-btn__content d-flex">
				<span
					class="w-100 d-flex flex-column flex-sm-row"
				>
					<span class="d-block text-left mail-info__text">
						<span
							:id="`${uniqueId}-mail-object`"
							class="d-block text-h5"
						>
							{{ mailInfo.mailObject }}

							<span
								v-if="mailInfo.commentValue"
								class="d-sr-only"
							>
								&nbsp;[Commentaires disponibles]
							</span>
						</span>

						<span
							:id="`${uniqueId}-message-first-line`"
							class="d-block mt-2"
						>
							{{ mailInfo.messageInfoFirstLine }}
						</span>

						<span
							:id="`${uniqueId}-message-second-line`"
							class="d-block mt-2"
						>
							{{ mailInfo.messageInfoSecondLine }}
						</span>

						<span
							v-if="mailInfo.messageInfoThirdLine"
							:id="`${uniqueId}-message-third-line`"
							class="d-block mt-2"
						>
							{{ mailInfo.messageInfoThirdLine }}
						</span>
					</span>

					<span class="d-block align-self-sm-center mail-info__date">
						<span
							v-if="smAndUp"
							:id="`${uniqueId}-message-date`"
							class="d-block"
						>
							{{ mailInfo.date }}
							<br>
							<span
								:id="`${uniqueId}-message-hour`"
								class="d-block mt-2"
							>
								{{ mailInfo.hour }}
							</span>
						</span>

						<span
							v-else
							:id="`${uniqueId}-message-date-hour`"
							class="d-block mt-2 text-left"
						>
							{{ mailInfo.date }} - {{ mailInfo.hour }}
						</span>
					</span>
				</span>
			</span>

			<AmeliproIcon
				v-if="mailInfo.commentValue"
				class="mail-info__comment-icon"
				icon="triangleUp"
				icon-bg-color="transparent"
				icon-color="ap-pink"
				size="1rem"
				:unique-id="`${uniqueId}-icon-comment`"
			/>
		</VBtn>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.mail-status-btn {
	position: relative;
	min-width: 3rem;
	white-space: normal;
	border: 1px solid apTokens.$ap-grey-lighten2;
	border-top-left-radius: 0.5rem;
	border-bottom-left-radius: 0.5rem;

	&::before {
		position: absolute;
		width: 1rem;
		height: 1rem;
		top: calc(50% - 5px);
		left: calc(50% - 5px);
		border-radius: 50%;
		border: 1px solid apTokens.$ap-grey;
		background-color: transparent;
		z-index: 2;
		content: '';
	}

	&.mail-status-btn--not-read,
	&:hover {
		&::before {
			border: 1px solid apTokens.$ap-blue-darken1;
			background-color: apTokens.$ap-blue-darken1;
		}
	}
}

.v-btn {
	padding: 0 !important;
	height: unset !important;
	letter-spacing: unset;
	text-indent: unset;
	white-space: normal;

	&.v-btn--active::before,
	&:focus::before,
	&:hover::before {
		content: unset !important;
		opacity: 0 !important;
	}

	&:hover {
		color: apTokens.$ap-grey-darken1;
		text-decoration: none;
	}

	&:focus {
		outline: 1px dotted apTokens.$ap-grey-darken1;
	}

	& :deep(.v-btn__content) {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		max-width: 100%;
	}

	// eslint-disable-next-line no-trailing-spaces
	& :deep(.v-btn__overlay),
	& :deep(.v-btn__underlay) {
		display: none !important;
	}
}

.mail-btn--editable {
	position: relative;
	display: block;
	border-top-left-radius: 0 !important;
	border-bottom-left-radius: 0 !important;
	border-left: 0;
	width: calc(100% - 3rem);
}

.amelipro-mail-tile__not-editable {
	position: relative;
	display: block;
}

.mail-btn__content {
	position: relative;
	padding: 1rem 3rem 1rem 1rem;
	border: 1px solid apTokens.$ap-grey-lighten2;
	border-radius: 0.5rem;

	.mail-btn--editable & {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		border-left: 0;

		&::before {
			content: unset;
		}
	}

	.mail-btn & {
		padding-left: 4rem;
	}

	.mail-btn--not-read & {
		&::before {
			position: absolute;
			width: 1rem;
			height: 1rem;
			top: calc(50% - 5px);
			left: 1rem;
			border-radius: 50%;
			border: 1px solid apTokens.$ap-blue-darken1;
			background-color: apTokens.$ap-blue-darken1;
			z-index: 2;
			content: '';
		}
	}
}

.mail-info__text {
	@media #{apTokens.$media-up-sm} {
		width: 100%;
	}
}

.mail-info__date {
	@media #{apTokens.$media-up-sm} {
		padding: 0 1.25rem;
	}

	@media #{apTokens.$media-up-lg} {
		padding: 0 3rem 0 1.25rem;
	}
}

.mail-info__comment-icon {
	position: absolute;
	top: 16px;
	right: 20px;
}
</style>
