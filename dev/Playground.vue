 <template>
<FilterInline
    v-model="filters"
>
    <template #profession="{ props }">
        <SearchListField
            v-bind="props"
            :items="professionList"
			label="Profession"
            color="primary"
        />
    </template>

</FilterInline>
	<p>{{ filters }}</p>
</template>

<script lang='ts' setup>
import { ref } from 'vue'
import FilterInline from '@/components/FilterInline/FilterInline.vue'
import SearchListField from '@/components/SearchListField/SearchListField.vue'

const filters = ref([
    {
        name: 'profession',
        title: 'Profession',
    },
])

const professionList = [
    {
        label: 'Chirurgien-dentiste',
        value: 'chirurgien-dentiste',
    },
    {
        label: 'Infirmier',
        value: 'infirmier',
    },
    {
        label: 'Orthophoniste',
        value: 'orthophoniste',
    },
    {
        label: 'Orthoptiste',
        value: 'orthoptiste',
    },
    {
        label: 'Pédicure-podologue',
        value: 'pedicure-podologue',
    },
    {
        label: 'Pharmacien',
        value: 'pharmacien',
    },
]
    </script>