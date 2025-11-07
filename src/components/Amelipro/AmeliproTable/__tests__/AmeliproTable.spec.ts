import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproTable from '../AmeliproTable.vue'

describe('AmeliproTable', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproTable, {
			props: {
				headers: [
					{
						align: 'left',
						maxWidth: '25%',
						minWidth: '20%',
						name: 'name',
						title: 'Nom',
						width: '25%',
						sort: {
							ascendant: {
								label: 'tri asc',
								disabled: false,
							},
							descendant: {
								label: 'tri desc',
								disabled: true,
							},
						},
					},
					{
						align: 'left',
						maxWidth: '25%',
						minWidth: '20%',
						name: 'firstname',
						title: 'Prénom',
						width: '25%',
					},
					{
						align: 'left',
						maxWidth: '25%',
						minWidth: '20%',
						name: 'email',
						title: 'E-mail',
						width: '25%',
					},
				],
				dataList: [
					{
						email: 'jean.bernard@gmail.com',
						firstname: 'Jean',
						id: 0,
						name: 'Bernard',
					},
					{
						email: 'simon.pierre@gmail.com',
						firstname: 'Simon',
						id: 1,
						name: 'Pierre',
					},
					{
						email: 'michel.souris@gmail.com',
						firstname: 'Michel',
						id: 2,
						name: 'Souris',
					},
					{
						email: 'amandine.jabot@gmail.com',
						firstname: 'Amandine',
						id: 3,
						name: 'Jabot',
					},
				],
				title: 'Titre du tableau',
				uniqueId: 'amelipro-table-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
