<template>
  <v-app id="app">
    <v-container id="deck1" fluid>
      <v-row>
        <v-col><VueDeck :mapData="tempMapData" :SelFeature="tempSelFeature" /></v-col>
      </v-row>
    </v-container>
    <v-container id="table_container" fluid>
      <v-row>
        <v-col><DatatableComponent @updateData="tempMapData = $event" @rowSelect="tempSelFeature = $event" /></v-col>
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
    VApp, VRow, VCol, VContainer
  },
  data() {
    return {
      tempMapData: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [7.373082645279086, 46.92271073977435],
                  [7.373904713225365, 46.92308897771411],
                  [7.37483054879466, 46.922567674750034],
                  [7.374306792418967, 46.922228743183894],
                  [7.373929660979968, 46.92203451855106],
                  [7.373840373534961, 46.922021316279185],
                  [7.373753152777899, 46.92205728299517],
                  [7.373732933003192, 46.922047448582205],
                  [7.373082645279086, 46.92271073977435],
                ],
              ],
            },
            properties: {},
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [7.50432518393944, 46.984466587515236],
                  [7.505396227647753, 46.98457932478502],
                  [7.505805566577375, 46.98465251608187],
                  [7.505888425211487, 46.98463920035581],
                  [7.505898376369397, 46.98460801750864],
                  [7.505727058388661, 46.98408982666899],
                  [7.505585737397647, 46.983453197462346],
                  [7.505599664893464, 46.98342760730947],
                  [7.504364451832481, 46.98403598686721],
                  [7.50432518393944, 46.984466587515236],
                ],
              ],
            },
            properties: {},
          },
        ],
      },
      tempSelFeature: {},
    }
  },
})
</script>

<style>
#deck1 {
  position: relative;
  width: 100%;
  margin: 0 auto;
  height: 60vh;
}

#table_container {
  display: relative;
  bottom: 0;
  z-index: 3;
  height: 40vh;
}
</style>
