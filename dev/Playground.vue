<script lang='ts' setup>
	import { ref } from 'vue'
	import FileUpload from '@/components/FileUpload/FileUpload.vue'

	const uploadedFiles = ref<File[]>([])
	const errors = ref<string[]>([])

	const allowedExtensions = ['png', 'jpg', 'pdf']

	const customLocales = {
		fileUploadTitle: 'Téléverser un fichier',
		or: 'Ou',
		chooseFile: (multiple: boolean) => multiple ? 'Choisir des fichiers' : 'Choisir un fichier',
		infoText: (max: string, ext: string[]): string =>
			`Taille max. : ${max}. ${ext.length === 1 ? 'Format accepté' : 'Formats acceptés'} : ${ext.join(', ')}`,
		fileSizeUnits: ['o', 'Ko', 'Mo', 'Go', 'To'],
		dropFilesHere: (multiple: boolean): string => (!multiple ? 'Déposer votre fichier ici' : 'Déposer vos fichiers ici'),
		errorSize: (fileName: string, max: string): string => `Le fichier ${fileName} est trop volumineux. Taille max. : ${max}`,
		errorExtension: (fileName: string): string => `Message erreur custom pour ${fileName} !`,
	}

	function onError(errs: string[]) {
		errors.value = errs
	}
</script>

<template>
	<div
		style="padding: 24px; display: flex; flex-direction: column; gap: 24px; max-width: 600px;"
	>
		<h2>Test FileUpload — locales custom + extensions insensibles à la casse</h2>

		<p>
			Extensions autorisées : <code>{{ allowedExtensions.join(', ') }}</code><br>
			Essayez de déposer un fichier <code>.PNG</code> (majuscules) → doit être accepté.<br>
			Essayez un fichier <code>.gif</code> → doit afficher le message custom.
		</p>

		<FileUpload
			v-model="uploadedFiles"
			:allowed-extensions="allowedExtensions"
			:locales="customLocales"
			@error="onError"
		/>

		<div v-if="errors.length">
			<strong>Erreurs :</strong>
			<ul>
				<li
					v-for="(err, i) in errors"
					:key="i"
				>
					{{ err }}
				</li>
			</ul>
		</div>

		<div v-if="uploadedFiles.length">
			<strong>Fichiers acceptés :</strong>
			<ul>
				<li
					v-for="(file, i) in uploadedFiles"
					:key="i"
				>
					{{ file.name }}
				</li>
			</ul>
		</div>
	</div>
</template>
