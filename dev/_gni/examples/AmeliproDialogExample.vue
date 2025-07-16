<script setup lang="ts">

	/* eslint-disable no-console */
	import AmeliproBtn from '@/components/Amelipro/AmeliproBtn/AmeliproBtn.vue'
	import AmeliproDialog from '@/components/Amelipro/AmeliproDialog/AmeliproDialog.vue'
	import { ref } from 'vue'

	export interface IAmeliproDialogProps {
		attach?: boolean
		cancelBtnLabel?: string
		eager?: boolean
		fullscreen?: boolean
		hiddenCancelBtn?: boolean
		labelledby: string
		mainContentMaxHeight?: string
		mainContentMinHeight?: string
		modelValue?: boolean
		noClickOutside?: boolean
		noFooter?: boolean
		persistent?: boolean
		title?: string
		uniqueId: string
		validationBtnLabel?: string
		width?: string
	}

	const ameliproDialog = ref<typeof AmeliproDialog>()

	const isOpened = ref(false)
	const currentKey = ref('A')

	const valueA = (): IAmeliproDialogProps => ({
		labelledby: 'amelipro-dialog-modal-title-a',
		noFooter: true,
		uniqueId: 'amelipro-dialog-unique-id-a',
	})

	const valueB = (): IAmeliproDialogProps => ({
		labelledby: 'amelipro-dialog-modal-title-b',
		noFooter: false,
		persistent: true,
		uniqueId: 'amelipro-dialog-unique-id-b',
	})

	const valueC = (): IAmeliproDialogProps => ({
		labelledby: 'amelipro-dialog-modal-title-c',
		uniqueId: 'amelipro-dialog-unique-id-c',
	})

	const dataTest = ref<IAmeliproDialogProps>(valueA())
	const values: Record<string, () => IAmeliproDialogProps> = {
		A: valueA,
		B: valueB,
		C: valueC,
	}
	const selectData = (key: string): void => {
		currentKey.value = key
		dataTest.value = values[key]()
	}

	const modalData = () => ({
		btnLabel: `Ouvrir la modale ${currentKey.value}`,
		content: `Contenu de la modale ${currentKey.value}`,
		id: `amelipro-dialog-modal-title-${currentKey.value.toLowerCase()}`,
		title: `Titre de la modale ${currentKey.value}`,
	})

	const onChange = (event: any) => console.info('AmeliproDialog:onChange', event)

</script>

<template>
	<section>
		<h2>AmeliproDialog</h2>
		<p class="data-selector-wrapper">
			Set props data :
			<button @click="selectData('A')">
				Data set A (reset)
			</button> | <button @click="selectData('B')">
				Data set B
			</button> | <button @click="selectData('C')">
				Data set C
			</button>
		</p>
		<div class="component-wrapper">
			<AmeliproBtn
				rounded
				@click="isOpened = true"
			>
				{{ modalData().btnLabel }}
			</AmeliproBtn>

			<AmeliproDialog
				v-bind="dataTest"
				ref="ameliproDialog"
				v-model="isOpened"
				@change="onChange"
			>
				<template #header>
					<h2
						:id="modalData().id"
						class="ma-0 text-h4"
					>
						{{ modalData().title }}
					</h2>
				</template>

				<template #default>
					<div class="modal__content">
						{{ modalData().content }}
					</div>
				</template>

				<template
					v-if="!dataTest.noFooter"
					#footer
				>
					<div class="d-flex flex-column flex-sm-row justify-sm-space-between">
						<AmeliproBtn
							class="d-block d-sm-none"
							rounded
							@click="isOpened = false"
						>
							Valider
						</AmeliproBtn>

						<AmeliproBtn
							bordered
							class="mt-2 mt-sm-0"
							color="ap-white"
							hover-color="ap-blue lighten-3"
							rounded
							text-color="ap-blue darken-1"
							@click="isOpened = false"
						>
							Retour
						</AmeliproBtn>

						<AmeliproBtn
							class="d-none d-sm-block"
							rounded
							@click="isOpened = false"
						>
							Valider
						</AmeliproBtn>
					</div>
				</template>
			</AmeliproDialog>
		</div>
	</section>
</template>

<style scoped>

</style>

<style lang="scss" scoped>
.modal__content {
	padding: 30px 16px;
}
</style>
