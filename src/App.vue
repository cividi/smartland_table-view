<template>
  <v-app id="app">
    <v-container id="deck1" fluid>
      <v-row>
        <v-col>
          <VueDeck :mapData="tempMapData" :SelFeature="tempSelFeature" />
        </v-col>
      </v-row>
    </v-container>
    <v-container id="table_container" class="ma-1 pa-1" fluid>
      <v-row>
        <v-col>
          <DatatableComponent @updateData="tempMapData = $event" @rowSelect="tempSelFeature = $event" />
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import DatatableComponent from './components/DatatableComponent.vue'
import VueDeck from './components/deck.vue'
import { VApp, VContainer, VCol, VRow } from 'vuetify/lib/components'

export default defineComponent({
  name: 'App',
  components: {
    DatatableComponent,
    VueDeck,
    VApp,
    VRow,
    VCol,
    VContainer,
  },
  data() {
    return {
      tempMapData: {},
      tempSelFeature: {},
    }
  },
})
</script>

<style>
#deck1 {
  position: absolute;
  width: 100%;
  margin: 0 auto;
  height: 100vh;
  z-index: 3;
}

#table_container {
  position: absolute;
  bottom: 0;
  z-index: 999;
  height: 45vh;
  overflow: hidden;
}

#app {
  display: relative;
  height: 100%;
  overflow: hidden;
}
</style>
