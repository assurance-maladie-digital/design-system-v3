<script setup lang="ts">
	import CustomTextField from '@/components/Customs/CustomTextField/CustomTextField.vue'
	import { ref } from 'vue'
	const model = ref('')
	const model2 = ref('')
</script>

<template>
	<main class="py-4">
		<div>
			<h3> Without Slot</h3>
			<h5 class="mx-10">
				Text saisie:	{{ model }}
			</h5>
			<CustomTextField
				v-model="model"
				prepend-icon="success"
				append-icon="close"
				preprend-inner-icon="info"
				show-divider
				append-inner-icon="success"
				variant-style="outlined"
				color="warning"
				is-clearable
				:error-message="'This is an error message'"
			/>
		</div>
		<div>
			<h3> With Slot</h3>
			<h5 class="mx-10">
				Text saisie:	{{ model2 }}
			</h5>
			<CustomTextField
				v-model="model2"
				variant-style="outlined"
				is-clearable
				show-divider
			>
				<template #prepend-inner>
					☀️
				</template>
			</CustomTextField>
		</div>
		<div>
			<h3> Without Required</h3>
			<h5 class="mx-10">
				Text saisie:	{{ model }}
			</h5>
			<CustomTextField
				v-model="model"
				prepend-icon="success"
				append-icon="close"
				preprend-inner-icon="info"
				show-divider
				append-inner-icon="success"
				variant-style="outlined"
				color="warning"
				is-clearable
			/>
		</div>
	</main>
</template>
