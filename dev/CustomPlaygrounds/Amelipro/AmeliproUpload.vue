<script setup lang="ts">
/* eslint-disable vuejs-accessibility/label-has-for, no-console, @typescript-eslint/no-explicit-any */
	import type { ErrorMessages, ValidationRule } from '@/utils/rules/types'
	import AmeliproUpload from '@/components/Amelipro/AmeliproUpload/AmeliproUpload.vue'
	import { ref } from 'vue'

	interface IAmeliproUploadProps {
		ariaRequired?: boolean
		disabled?: boolean
		errorMessages?: ErrorMessages
		fileTypeAccepted: string[]
		inputLabel?: string
		maxFileNumber?: number
		modelValue?: File[]
		rules?: ValidationRule[]
		uniqueId: string
	}

	const ameliproUpload = ref<typeof AmeliproUpload>()

	const errorMessages: ErrorMessages = {
		default: 'Message d\'erreur personnalisé par défaut',
		duplicated: 'Message d\'erreur personnalisé en cas d\'import multiple d\'un même fichier',
		oversize: 'Message d\'erreur personnalisé pour le maximum de pièces jointes autorisées',
		type: 'Message d\'erreur personnalisé en cas de type de fichier refusé',
	}

	const files = ref<File[]>([])

	const dataSetA = (): IAmeliproUploadProps => ({
		fileTypeAccepted: ['application/pdf'],
		uniqueId: 'amelipro-unique-id-a',
	})

	const dataSetB = (): IAmeliproUploadProps => ({
		fileTypeAccepted: ['application/pdf', 'image/jpeg'],
		maxFileNumber: 3,
		uniqueId: 'amelipro-unique-id-b',
	})

	const dataSetC = (): IAmeliproUploadProps => ({
		ariaRequired: true,
		errorMessages,
		fileTypeAccepted: ['application/pdf', 'image/jpeg'],
		maxFileNumber: 5,
		uniqueId: 'amelipro-unique-id-c',
	})

	const dataTest = ref<IAmeliproUploadProps>(dataSetA())
	const dataSets: Record<string, () => IAmeliproUploadProps> = {
		A: dataSetA,
		B: dataSetB,
		C: dataSetC,
	}
	const selectData = (key: string): void => {
		dataTest.value = dataSets[key]()
	}

	const onChange = (event: any) => console.info('AmeliproUpload:onChange', event)
</script>

<template>
	<section>
		<h1>AmeliproUpload</h1>
		<p class="data-selector-wrapper">
			Set props data :
			<button @click="selectData('A')">
				Data set A (reset)
			</button> | <button @click="selectData('B')">
				Data set B
			</button> | <button @click="selectData('C')">
				Data set C
			</button>
			-
			<label><input
				v-model="dataTest.ariaRequired"
				type="checkbox"
			> ariaRequired</label>
		</p>
		<div class="component-wrapper">
			<AmeliproUpload
				v-bind="dataTest"
				ref="ameliproUpload"
				v-model="files"
				@change="onChange"
			/>
		</div>
		<div class="data-infos mt-4">
			<h2>Informations de test</h2>
			<p>Nombre de fichiers autorisés : {{ dataTest.maxFileNumber }}</p>
			<p>Extensions acceptées :</p>
			<ul>
				<li
					v-for="extension in dataTest.fileTypeAccepted"
					:key="extension"
				>
					{{ extension }}
				</li>
			</ul>
			<p>Files selected (v-model):</p>
			<ul>
				<li
					v-for="(file, index) in files"
					:key="index"
				>
					{{ file.name }} ({{ file.size }} bytes)
				</li>
			</ul>
		</div>
	</section>
</template>

<style scoped>
html,
body {
	background-color: #17181a !important;
}

.data-selector-wrapper {
	margin-bottom: 1rem;
	color: #636266;
}

.component-wrapper {
	padding: 1rem;
	background: repeating-linear-gradient(135deg,
			#fafafa,
			#fafafa 10px,
			#f5f5f5 10px,
			#f5f5f5 20px);
	overflow: hidden;
	max-width: 100%;
}

.data-infos {
	color: #636266;

	ul,
	p {
		margin-bottom: 1rem;
	}

	ul {
		list-style-type: disc;
		padding-left: 1rem;
	}

	li {
		margin-left: 1.5rem;
	}
}
</style>
