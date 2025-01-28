<script lang="ts" setup>
	import PasswordField from '@/components/PasswordField/PasswordField.vue'
	const customRules = []

</script>

<template>
	<PasswordField
		:custom-rules="customRules"
		is-validate-on-blur
		outlined
		:required="false"
	/>
</template>
