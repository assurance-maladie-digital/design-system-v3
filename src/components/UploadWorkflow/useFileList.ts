import { computed, ref, type DeepReadonly, type Ref } from 'vue'
import type { FileState, Item as FileListItem } from '../FileList/FileList.vue'
import type { FileItem, SelectedFile, UploadItem } from './types'

export default function useFileList(
	selectedFiles: Ref<SelectedFile[]>,
	uploadList: DeepReadonly<Ref<UploadItem[]>>,
) {
	const errorSelectedFiles = ref<string[]>([])

	function removeFromErrorList(fileId: string) {
		const errorIndex = errorSelectedFiles.value.findIndex(item => item === fileId)
		if (errorIndex !== -1) {
			errorSelectedFiles.value.splice(errorIndex, 1)
		}
	}

	function findSelectedFile(fileId: string) {
		return selectedFiles.value.find(item => item.id === fileId)
	}

	function resetFile(fileItem: FileListItem | SelectedFile) {
		const itemIndex = selectedFiles.value.findIndex(item => item.id === fileItem.id)
		selectedFiles.value.splice(itemIndex, 1)
	}

	function replaceFile(file: File, item: SelectedFile, state: FileState = 'success') {
		item.file = file
		item.fileName = file.name
		item.state = state
	}

	function addOrReplaceFile(file: File, fileId: string, state: FileState = 'success') {
		const selectedFile = findSelectedFile(fileId)

		if (selectedFile) {
			replaceFile(file, selectedFile, state)
		}
		else {
			const uploadItemIndex = uploadList.value.findIndex(item => item.id === fileId)

			selectedFiles.value.push({
				id: uploadList.value[uploadItemIndex].id,
				title: uploadList.value[uploadItemIndex].title,
				state: state,
				optional: !!uploadList.value[uploadItemIndex].optional,
				showPreviewBtn: !!uploadList.value[uploadItemIndex].showPreviewBtn,
				fileName: file.name,
				file,
			})
			removeFromErrorList(fileId)
		}
	}

	function setItemOnError(fileId: string) {
		const selectedFile = findSelectedFile(fileId)
		if (selectedFile) {
			resetFile(selectedFile)
		}
		errorSelectedFiles.value.push(fileId)
	}

	const filledUploadList = computed<FileItem[]>(() => {
		return uploadList.value.map((uploadItem) => {
			const matchingUploadedItem = findSelectedFile(uploadItem.id)
			const error = errorSelectedFiles.value.includes(uploadItem.id)
			const state = uploadItem.state ?? (error ? 'error' : 'initial')

			return ({
				...uploadItem,
				state,
				...matchingUploadedItem,
			})
		})
	})

	return {
		addOrReplaceFile,
		replaceFile,
		resetFile,
		setItemOnError,
		filledUploadList,
	}
}
