<template>
  <v-app id="app">
    <v-container id="deck1" fluid>
      <v-row>
        <v-col>
          <VueDeck :mapData="tempMapData" :SelFeature="tempSelFeature" />
        </v-col>
      </v-row>
    </v-container>
    <v-container id="table_container" class="ma-1 pa-1" justify-center fluid>
      <v-row>
        <v-col>
          <DatatableComponent @updateData="tempMapData = $event" @rowSelect="tempSelFeature = $event" />
        </v-col>
      </v-row>
    </v-container>

    <v-container id="information" class="ma-2 pa-2" justify-center fluid>
      <InformationComponent />
    </v-container>
  </v-app>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import DatatableComponent from './components/DatatableComponent.vue'
import InformationComponent from './components/InformationComponent.vue'
import VueDeck from './components/deck.vue'
import { VApp, VContainer, VCol, VRow, VCard } from 'vuetify/lib/components'

export default defineComponent({
  name: 'App',
  components: {
    DatatableComponent,
    InformationComponent,
    VueDeck,
    VApp,
    VRow,
    VCol,
    VContainer,
    VCard,
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
  z-index: 1;
}

#table_container {
  position: absolute;
  bottom: 0;
  z-index: 3;
  height: 45vh;
  width: 100%;

  overflow: hidden;
}

#information {
  position: absolute;
  top: 0;
  z-index: 9;
  height: 50vh;
  width: 40vh;
  overflow: auto;
  background: white;
  border-radius: 2%;
}

#app {
  display: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
