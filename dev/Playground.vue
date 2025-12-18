  <script lang="ts" setup>
  import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue';
  import { isNotBeforeTodayFn, isHolidayDayFn, isNotAfterDateFn  } from '@/utils/rules/'
  import { ref } from 'vue'
const date = ref();
const isNotBeforeToday = [
  {
    type: 'custom',
    options: {
      validate: isNotBeforeTodayFn(),
    }
  }
 ]

 const isHolidayDay = [
  {
    type: 'custom',
    options: {
      validate: isHolidayDayFn(),
    }
  }
 ]

  const isNotAfterDate = [
  {
    type: 'custom',
    options: {
      validate: isNotAfterDateFn(),
    }
  }
 ]
</script>
<template>
    <DatePicker
            v-model="date"
            :custom-rules="isNotBeforeToday"
            label="Date"
            :show-success-messages="false"
          />
              <DatePicker
            v-model="date"
            :custom-rules="isHolidayDay"
            label="Date"
            :show-success-messages="false"
          />
            <DatePicker
            v-model="date"
            :custom-rules="isNotAfterDate"
            label="Date"
            :show-success-messages="false"
          />
</template>
