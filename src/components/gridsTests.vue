<script setup lang="ts">
	import { reactive, ref, onMounted } from 'vue'
	const state = reactive({
		screenWidth: 0,
		gridColumns: 1,
	})
	const calculateColumns = (width: number) => {
		state.screenWidth = width
		if (width >= 1200) {
			state.gridColumns = 12
		}
		else if (width >= 900) {
			state.gridColumns = 3
		}
		else if (width >= 600) {
			state.gridColumns = 2
		}
		else {
			state.gridColumns = 1
		}
	}
	const targetElement = ref<HTMLElement | null>(null)

	onMounted(() => {
		targetElement.value = document.body
		calculateColumns(targetElement.value.clientWidth)
	})
</script>

<template>
	<v-container>
		<v-col>
			<div class="bg-blue-accent-4 top-0 text-center">
				Menu
			</div>
			<div class="page-container">
				<v-col
					v-for="n in 12"
					:key="n"
					class="bg-amber-darken-4"
				>
					{{ n }}
				</v-col>
			</div>
			<div class="bg-blue-accent-4 top-0 text-center">
				Footer
			</div>
		</v-col>
	</v-container>
</template>

<style lang="scss" scoped>
@import '@/assets/tokens.scss';
</style>
