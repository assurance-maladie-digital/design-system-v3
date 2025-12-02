<script setup lang="ts">
	import AmeliproAccordion from '../AmeliproAccordion/AmeliproAccordion.vue'
	import AmeliproCard from '../AmeliproCard/AmeliproCard.vue'
	import AmeliproIcon from '../AmeliproIcon/AmeliproIcon.vue'
	import { computed } from 'vue'
	import { useDisplay } from 'vuetify'

	const props = defineProps({
		cardTitle: {
			type: String,
			required: true,
		},
		downloadBtnText: {
			type: String,
			default: 'Télécharger',
		},
		fileName: {
			type: String,
			required: true,
		},
		fileSrc: {
			type: String,
			required: true,
		},
		foldable: {
			type: Boolean,
			default: false,
		},
		pdfDisplayTitle: {
			type: String,
			default: 'Aperçu du fichier PDF',
		},
		isOpen: {
			type: Boolean,
			default: false,
		},
		linkTitle: {
			type: String,
			default: 'Télécharger le fichier au Format PDF',
		},
		previewHeight: {
			type: Number,
			default: 550,
		},
		uniqueId: {
			type: String,
			required: true,
		},
	})

	const { mdAndUp } = useDisplay()

	const currentProps = computed<object>(() =>
		props.foldable
			? {
				accordionTitle: props.cardTitle,
				isOpen: props.isOpen,
				uniqueId: props.uniqueId,
			}
			: {
				cardTitle: props.cardTitle,
				id: props.uniqueId,
			})
</script>

<template>
	<div :id="`${uniqueId}-container`">
		<component
			:is="foldable ? AmeliproAccordion : AmeliproCard"
			v-bind="currentProps"
			:card-title="foldable ? undefined : cardTitle"
			classes="amelipro-file-preview"
		>
			<template #headerRight>
				<div
					v-if="mdAndUp"
					:id="`${uniqueId}-header-right`"
					class="d-flex justify-end amelipro-file-preview__header-right"
				>
					<a
						:id="`${uniqueId}-download-link`"
						class="d-flex align-center text-h6 font-weight-semibold amelipro-file-preview__header__link"
						:download="fileName"
						:href="fileSrc"
						:title="linkTitle"
					>
						{{ downloadBtnText }}

						<AmeliproIcon
							bordered
							class="ml-2"
							icon="pdf"
							icon-bg-color="ap-red"
							icon-color="ap-white"
							large
							:unique-id="`${uniqueId}-icon-desktop`"
						/>
					</a>
				</div>
			</template>

			<template #default>
				<object
					v-if="mdAndUp"
					:id="`${uniqueId}-pdf-display`"
					:aria-label="pdfDisplayTitle"
					:height="previewHeight"
					:data="fileSrc"
					type="application/pdf"
					width="100%"
				/>

				<a
					v-else
					:id="`${uniqueId}-link-mobile`"
					class="d-block download-file-link"
					:download="fileName"
					:href="fileSrc"
					:title="linkTitle"
				>
					<span class="pa-4 bg-ap-white d-flex flex-column align-center">
						<!-- TODO: Quick fix pour les TU. Trouver une meilleure solution -->
						<AmeliproIcon
							icon="pdf"
							icon-bg-color="ap-red"
							icon-color="ap-white"
							size="64px"
							:unique-id="`${uniqueId}-icon-mobile`"
						/>

						<span class="download-file-link-text mt-3">
							{{ downloadBtnText }}
						</span>
					</span>
				</a>
			</template>
		</component>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.download-file-link {
	&:hover {
		text-decoration: none;
	}
}

.download-file-link-text {
	color: apTokens.$ap-blue-darken1;
	font-size: apTokens.$font-size-sm;
	font-weight: apTokens.$ap-font-weight-bold;

	a:hover & {
		color: apTokens.$ap-blue-darken2;
		text-decoration: underline;
	}
}
</style>
