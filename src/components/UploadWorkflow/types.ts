import type { FileState } from '@/components/FileList/FileList.vue'
export type { Item as FileItem } from '@/components/FileList/FileList.vue'

export type UploadItem = {
	id: string
	title: string
	state?: FileState | string
	optional?: boolean
	showPreviewBtn?: boolean
}

export type SelectedFile = {
	id: string
	title: string
	state?: FileState
	progress?: number
	optional?: boolean
	showPreviewBtn?: boolean
	fileName: string
	file: File
}
