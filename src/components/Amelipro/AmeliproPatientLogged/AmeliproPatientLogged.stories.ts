import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproPatientLogged from './AmeliproPatientLogged.vue'
import { ref, watch } from 'vue'

const meta = {
    title: 'Composants/Amelipro/IDPA/AmeliproPatientLogged',
    component: AmeliproPatientLogged,
    parameters: {
        controls: {
            exclude: [
                'click:info',
                'click:copy',
                'click:postal-address',
                'click:prevention',
                'click:fund-dialog',
                'click:doctor-dialog',
                'click:beneficiary-change',
                'click:patient-change',
                'click:pdf',
            ],
        },
    },
    argTypes: {
        btnPostalAddress: {description: 'Affiche le bouton adresse postale'},
        btnPrevention: {description: 'Affiche le bouton prévention'},
        isRestrictedData: {description: 'Affiche la liste des bénéficiaires sans sélection possible'},

        /* EVENTS — masqués */
        'click:info': {action: false, table: {disable: true}},
        'click:copy': {action: false, table: {disable: true}},
        'click:postal-address': {action: false, table: {disable: true}},
        'click:prevention': {action: false, table: {disable: true}},
        'click:fund-dialog': {action: false, table: {disable: true}},
        'click:doctor-dialog': {action: false, table: {disable: true}},
        'click:beneficiary-change': {action: false, table: {disable: true}},
        'click:patient-change': {action: false, table: {disable: true}},
        'click:pdf': {action: false, table: {disable: true}},

        /* SLOTS */
        default: {description: 'Espace libre avant le bouton informations'},
        doctor: {description: 'Slot ligne médecin traitant'},
        doctorDialog: {description: 'Slot modale médecin traitant'},
        doctorDialogFooter: {description: 'Slot footer modale médecin traitant'},
        fundDialog: {description: 'Slot modale caisse'},

        /* PROPS */
        uniqueId: {description: 'Identifiant unique du composant'},
        modelValue: {description: 'Valeur du select bénéficiaire'},
        noPdfBtn: {description: 'Masque le bouton PDF'},
    },
} as Meta<typeof AmeliproPatientLogged>

export default meta

type Story = StoryObj<typeof AmeliproPatientLogged>

export const Default: Story = {
    args: {
        btnPostalAddress: true,
        btnPrevention: true,
        doctorTooltipRed: true,
        isRestrictedData: false,
        patientInfos: {
            ame: 'oui',
            birthdate: '09/11/1992 (32 ans)',
            c2s: 'non',
            c2sTooltip: 'c2s tooltip',
            doctor: 'Voir détail MT',
            doctorTooltip: 'doctor tooltip',
            exemption: 'ALD hors liste',
            firstName: 'prénom',
            fund: 'CPAM du Puy de Dome',
            fundTooltip: 'fund tooltip',
            mtm: 'Allocation de solidarité aux personnes âgées',
            name: 'nom',
            nir: '123456789012345',
            plan: 'Régime Général',
            rank: '1',
            rights: 'oui',
            selectItems: [
                {title: 'Patient 1', value: 1},
                {title: 'Patient 2', value: 2},
                {title: 'Patient 3', value: 3},
            ],
        },
        uniqueId: 'test-id',
    },
    render: (args) => ({
        components: {AmeliproPatientLogged},
        setup() {
            const model = ref(args.modelValue)

            watch(
                () => args.modelValue,
                (val) => {
                    model.value = val
                },
            )

            return {args, model}
        },
        template: `
          <div style="display:flex;justify-content:center">
            <AmeliproPatientLogged
                v-bind="args"
                v-model="model"
                @click:info="() => {}"
                @click:copy="() => {}"
                @click:postal-address="() => {}"
                @click:prevention="() => {}"
                @click:fund-dialog="() => {}"
                @click:doctor-dialog="() => {}"
                @click:beneficiary-change="() => {}"
                @click:patient-change="() => {}"
                @click:pdf="() => {}"
                style="width:350px !important"
            >
              <template #doctorDialog>
                <p>Contenu du slot "doctorDialog"</p>
              </template>

              <template #doctorDialogFooter>
                <p>Contenu du slot "doctorDialogFooter"</p>
              </template>

              <template #fundDialog>
                <p>Contenu du slot "fundDialog"</p>
              </template>
            </AmeliproPatientLogged>
          </div>
        `,
    }),
}
