<script lang="ts" setup>
	import { ref } from 'vue'
	import { SyForm, SyTextArea } from '@/components'

	const text = ref('')
	const valid = ref(false)
</script>
<template>
	{{ valid }}
	<SyForm
		ref="formSecondParent"
		v-model="valid"
		clearble
		@submit="(event) => { console.log('submit form', event); }"
	>
		<div class="pa-8">
			<SyTextArea
				v-model="text"
				label="label"
				required
				clearable
			/>

			<button type="submit">
				Valider
			</button>
		</div>
	</SyForm>
</template>
