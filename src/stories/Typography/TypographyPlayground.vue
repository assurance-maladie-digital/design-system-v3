<template>
  <div>
    <h2 class="mb-4">Typography Playground</h2>

    <v-tabs v-model="activeTab">
      <v-tab value="cnam">CNAM Theme</v-tab>
      <v-tab value="pa">PA Theme</v-tab>
    </v-tabs>

    <v-window v-model="activeTab" class="mt-4">
      <v-window-item value="cnam">
        <v-theme-provider theme="cnam">
          <v-sheet class="pa-4">
            <h3 class="mb-4">CNAM Typography</h3>
            
            <!-- Headings -->
            <div class="typography-section mb-6">
              <h4 class="mb-2">Headings</h4>
              <div class="d-flex flex-column">
                <div class="text-h1 mb-2">Heading 1 (text-h1)</div>
                <div class="text-h2 mb-2">Heading 2 (text-h2)</div>
                <div class="text-h3 mb-2">Heading 3 (text-h3)</div>
                <div class="text-h4 mb-2">Heading 4 (text-h4)</div>
                <div class="text-h5 mb-2">Heading 5 (text-h5)</div>
                <div class="text-h6 mb-2">Heading 6 (text-h6)</div>
              </div>
            </div>
            
            <!-- Display Text -->
            <div class="typography-section mb-6">
              <h4 class="mb-2">Display Text</h4>
              <div class="d-flex flex-column">
                <div class="text-d-1 mb-2">Display 1 (text-d-1)</div>
                <div class="text-d-2 mb-2">Display 2 (text-d-2)</div>
                <div class="text-d-3 mb-2">Display 3 (text-d-3)</div>
                <div class="text-d-4 mb-2">Display 4 (text-d-4)</div>
              </div>
            </div>
            
            <!-- Body Text -->
            <div class="typography-section mb-6">
              <h4 class="mb-2">Body Text</h4>
              <div class="d-flex flex-column">
                <div class="text-body-1 mb-2">Body 1 (text-body-1): Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam.</div>
                <div class="text-body-2 mb-2">Body 2 (text-body-2): Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam.</div>
              </div>
            </div>
            
            <!-- Subtitle Text -->
            <div class="typography-section mb-6">
              <h4 class="mb-2">Subtitle Text</h4>
              <div class="d-flex flex-column">
                <div class="text-subtitle-1 mb-2">Subtitle 1 (text-subtitle-1)</div>
                <div class="text-subtitle-2 mb-2">Subtitle 2 (text-subtitle-2)</div>
              </div>
            </div>
            
            <!-- Other Typography -->
            <div class="typography-section mb-6">
              <h4 class="mb-2">Other Typography</h4>
              <div class="d-flex flex-column">
                <div class="text-caption mb-2">Caption Text (text-caption)</div>
                <div class="text-overline mb-2">Overline Text (text-overline)</div>
                <div class="text-button mb-2">Button Text (text-button)</div>
              </div>
            </div>
            
            <!-- Native HTML Elements -->
            <div class="typography-section mb-6">
              <h4 class="mb-2">Native HTML Elements</h4>
              <div class="d-flex flex-column">
                <h1>H1 Element</h1>
                <h2>H2 Element</h2>
                <h3>H3 Element</h3>
                <h4>H4 Element</h4>
                <h5>H5 Element</h5>
                <h6>H6 Element</h6>
                <p>Paragraph Element: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam.</p>
              </div>
            </div>
          </v-sheet>
        </v-theme-provider>
      </v-window-item>
      
      <v-window-item value="pa">
        <v-theme-provider theme="pa">
          <v-sheet class="pa-4">
            <h3 class="mb-4">PA Typography</h3>
            
            <!-- Headings -->
            <div class="typography-section mb-6">
              <h4 class="mb-2">Headings</h4>
              <div class="d-flex flex-column">
                <div class="text-h1 mb-2">Heading 1 (text-h1)</div>
                <div class="text-h2 mb-2">Heading 2 (text-h2)</div>
                <div class="text-h3 mb-2">Heading 3 (text-h3)</div>
                <div class="text-h4 mb-2">Heading 4 (text-h4)</div>
                <div class="text-h5 mb-2">Heading 5 (text-h5)</div>
                <div class="text-h6 mb-2">Heading 6 (text-h6)</div>
              </div>
            </div>
            
            <!-- Display Text -->
            <div class="typography-section mb-6">
              <h4 class="mb-2">Display Text</h4>
              <div class="d-flex flex-column">
                <div class="text-d-1 mb-2">Display 1 (text-d-1)</div>
                <div class="text-d-2 mb-2">Display 2 (text-d-2)</div>
                <div class="text-d-3 mb-2">Display 3 (text-d-3)</div>
                <div class="text-d-4 mb-2">Display 4 (text-d-4)</div>
              </div>
            </div>
            
            <!-- Body Text -->
            <div class="typography-section mb-6">
              <h4 class="mb-2">Body Text</h4>
              <div class="d-flex flex-column">
                <div class="text-body-1 mb-2">Body 1 (text-body-1): Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam.</div>
                <div class="text-body-2 mb-2">Body 2 (text-body-2): Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam.</div>
              </div>
            </div>
            
            <!-- Subtitle Text -->
            <div class="typography-section mb-6">
              <h4 class="mb-2">Subtitle Text</h4>
              <div class="d-flex flex-column">
                <div class="text-subtitle-1 mb-2">Subtitle 1 (text-subtitle-1)</div>
                <div class="text-subtitle-2 mb-2">Subtitle 2 (text-subtitle-2)</div>
              </div>
            </div>
            
            <!-- Other Typography -->
            <div class="typography-section mb-6">
              <h4 class="mb-2">Other Typography</h4>
              <div class="d-flex flex-column">
                <div class="text-caption mb-2">Caption Text (text-caption)</div>
                <div class="text-overline mb-2">Overline Text (text-overline)</div>
                <div class="text-button mb-2">Button Text (text-button)</div>
              </div>
            </div>
            
            <!-- Native HTML Elements -->
            <div class="typography-section mb-6">
              <h4 class="mb-2">Native HTML Elements</h4>
              <div class="d-flex flex-column">
                <h1>H1 Element</h1>
                <h2>H2 Element</h2>
                <h3>H3 Element</h3>
                <h4>H4 Element</h4>
                <h5>H5 Element</h5>
                <h6>H6 Element</h6>
                <p>Paragraph Element: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam.</p>
              </div>
            </div>
          </v-sheet>
        </v-theme-provider>
      </v-window-item>
    </v-window>
  </div>
</template>

<script>
export default {
  name: 'TypographyPlayground',
  data() {
    return {
      activeTab: 'cnam',
    }
  },
}
</script>

<style scoped>
.typography-section {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 1rem;
}
</style>
