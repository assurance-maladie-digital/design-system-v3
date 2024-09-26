import type { Meta, StoryObj } from '@storybook/vue3'
import CopyBtn from './CopyBtn.vue'

const meta = {
    title: 'Components/CopyBtn',
    component: CopyBtn,
    parameters: {
        layout: 'fullscreen',
        controls: { exclude: ['prependIcon', 'dismissAlert'] },
    },
    argTypes: {
        label: {
            control: { type: 'text' },
            default: 'Label',
        },
        textToCopy: {
            control: {type: 'text'},
            default: 'test',
        },
        hideTooltip: {
            control: {type: 'boolean'},
            default: false,
        },
        tooltipDuration: {
            control: {type: 'number'},
            default: 2000,
        }
    },
} as Meta<typeof CopyBtn>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        label: 'label',
        textToCopy: 'test',
    },
    render: (args) => {
        return {
            components: { CopyBtn },
            setup() {
                return { args }
            },
            template: `
              <div class="d-flex align-center">
                <p class="mb-0 mr-1">
                  Patient n°<b>1970756541</b>
                </p>

                <CopyBtn
                    label="Copier le numéro de patient"
                    text-to-copy="1970756541"
                />
              </div>
			`,
        }
    },
}
