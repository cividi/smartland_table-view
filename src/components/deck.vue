<template>
  <VueDeckgl :layers="layers" :viewState="viewState" @click="handleClick" @view-state-change="handleViewStateChange">
  </VueDeckgl>
</template>
<script>
import VueDeckgl from 'vue-deck.gl'
//import { ScatterplotLayer } from '@deck.gl/layers'
import { PathLayer } from '@deck.gl/layers'

export default {
  name: 'VueDeck',
  components: {
    VueDeckgl,
  },
  data() {
    return {
      viewState: {
        latitude: 12.976387,
        longitude: 77.571529,
        zoom: 4,
        bearing: 0,
        pitch: 0,
      },
    }
  },
  methods: {
    handleClick({ event, info }) {
      // handle clicks on the deck instance
    },
    handleViewStateChange(updatedViewState) {
      // update the state object
      this.viewState = {
        ...updatedViewState,
      }
    },
  },
  computed: {
    layers() {
      const paths = new PathLayer({
        id: 'path-layer',
        data: this.pathData,
        widthScale: 20,
        widthMinPixels: 2,
        getPath: (d) => d.path,
        getColor: (d) => [255, (1 - d.data.distance / 100) * 255, 0],
        getWidth: (d) => 2,
      })
      return [paths]
    },
  },
}
</script>
