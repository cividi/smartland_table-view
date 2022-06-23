<template>
  <VueDeckgl :layers="layers" :viewState="viewState" @click="handleClick" @view-state-change="updateViewState">
    <div id="map" ref="map"></div>
  </VueDeckgl>
</template>
<script>
import VueDeckgl from 'vue-deck.gl'
import { PathLayer } from '@deck.gl/layers'
import mapboxgl from 'mapbox-gl'

export default {
  name: 'VueDeck',
  components: {
    VueDeckgl,
  },
  data() {
    return {
      accessToken: 'pk.eyJ1IjoiZ2VtZWluZGVzY2FuIiwiYSI6ImNrNXdqejRtMjAzaWwzbXBkbzQwejFsdDAifQ.-uuEzwv7CsbdJgDKLT6i9g',
      mapStyle: 'mapbox://styles/gemeindescan/cl379xy8d001614m7qrl9furx',
      viewState: {
        latitude: 46.976387,
        longitude: 8.571529,
        zoom: 6,
        bearing: 0,
        pitch: 0,
      },

      pathData: [
        {
          path: [
            [-122.4, 37.7],
            [-122.5, 37.8],
            [-122.6, 37.85],
          ],
          name: 'Richmond - Millbrae',
          color: [255, 0, 0],
        },
      ],
    }
  },

  computed: {
    layers() {
      const paths = new PathLayer({
        id: 'path-layer',
        data: this.pathData,
        widthScale: 20,
        widthMinPixels: 2,
        getPath: (d) => d.path,
        getColor: (d) => [255, 255, 0],
        getWidth: (d) => 2,
      })
      return [paths]
    },
  },
  created() {
    // We need to set mapbox-gl library here in order to use it in template
    this.map = null
  },
  methods: {
    updateViewState(viewState) {
      console.log('updating view state...')
      this.viewState = {
        ...viewState,
      }
      this.map.jumpTo({
        center: [viewState.longitude, viewState.latitude],
        zoom: viewState.zoom,
        bearing: viewState.bearing,
        pitch: viewState.pitch,
      })
    },
    handleClick({ event, info }) {},
  },
  mounted() {
    // creating the map
    this.map = new mapboxgl.Map({
      accessToken: this.accessToken,
      container: this.$refs.map,
      interactive: false,
      style: this.mapStyle || 'mapbox://styles/haxzie/ck7h838qb0bik1iofe0k2i3f2',
      center: [this.viewState.longitude, this.viewState.latitude],
      zoom: this.viewState.zoom,
      pitch: this.viewState.pitch,
      bearing: this.viewState.bearing,
    })

    setTimeout(() => {
      const { latitude, longitude, pitch, bearing, zoom } = this.viewState
      this.viewState = {
        latitude,
        longitude,
        pitch,
        bearing,
        zoom: 10,
        transitionDuration: 3000,
      }
    }, 5000)
  },
}
</script>

<style lang="scss">
#map {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #e5e9ec;
  overflow: hidden;
}
</style>
