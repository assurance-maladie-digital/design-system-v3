<script lang='ts' setup>
import NirField from '@/components/NirField/NirField.vue';
import SyForm from '@/components/Customs/SyForm/SyForm.vue';
import { ref } from 'vue'

  const testReset = () => {
  	console.log('test reset')
  }
  const testNir = ref()
</script>
<template>
      <SyForm validate-on-submit @reset="testReset">
		<NirField v-model="testNir" />
		<v-btn type="reset">Reset</v-btn>
	</SyForm>
</template>