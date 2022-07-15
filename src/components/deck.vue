<template>
  <div class="deck-container" ref="deckContainerRef">
    <VueDeckgl
      :layers="layers"
      :viewState="viewState"
      :controller="true"
      @click="handleClick"
      @view-state-change="updateViewState"
    >
      <template>
        <div id="map" ref="map"></div>
      </template>
    </VueDeckgl>
  </div>
</template>
<script>
import VueDeckgl from 'vue-deck.gl'
import { GeoJsonLayer, SolidPolygonLayer } from '@deck.gl/layers'
import { FlyToInterpolator } from '@deck.gl/core'
import mapboxgl from 'mapbox-gl'

export default {
  name: 'VueDeck',
  props: {
    mapData: Object,
    SelFeature: Object,
  },
  components: {
    VueDeckgl,
  },
  data() {
    return {
      accessToken: import.meta.env.VITE_MAPBOX_TOKEN || '',
      mapStyle: import.meta.env.VITE_MAPBOX_STYLE || '',
      viewState: {
        latitude: 46.92271073977435,
        longitude: 7.373082645279086,
        zoom: 10,
        bearing: 0,
        pitch: 0,
      },

      featureIndex: 0,

      polygonData: {},
    }
  },

  computed: {
    layers() {
      const paths = new GeoJsonLayer({
        id: 'geojson-layer',
        data: this.mapData,
        pickable: true,
        stroked: true,
        filled: false,
        extruded: false,
        //lineWidthScale: 20,
        lineWidthMinPixels: 1,
        getFillColor: [255, 0, 0],
        getPointRadius: 100,
        getLineWidth: 5,
        autoHighlight: false,
        highlightedObjectIndex: this.featureIndex,
        highlightColor: [255, 255, 0],
        getLineColor: [255, 0, 0, 255],
      })
      return [paths]
    },
  },
  created() {
    // We need to set mapbox-gl library here in order to use it in template
    this.map = null
  },

  watch: {
    SelFeature: function (newVal, oldVal) {
      // watch it
      console.log('Feature changed: ', newVal, ' | was: ', oldVal)
      //console.log(Object.getOwnPropertyNames(this.viewState))

      //  const { latitude, longitude, pitch, bearing, zoom } = this.viewState
      this.viewState = {
        latitude: newVal.latitude,
        longitude: newVal.longitude,
        zoom: 15,
        bearing: 0,
        pitch: 0,
        transitionDuration: 500,
      }

      this.featureIndex = newVal.index - 1 //check counter, 0 or 1

      //this.$set(this.viewState, 'latitude', newVal.latitude) // tried with set rather dan diretly overwritng variable, no difference
      //his.$set(this.viewState, 'transitionDuration', 3000) //as soon as transition is added assertion fails
    },
  },

  methods: {
    //passing a "viewstate" to the function updates mapbox
    updateViewState(viewState) {
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
      style: this.mapStyle || 'mapbox://styles/gemeindescan/ckupq2yhy0pqe17oi2khezf9a', //mapbox://styles/haxzie/ck7h838qb0bik1iofe0k2i3f2
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
        zoom: 15,
        transitionDuration: 3000,
      }
    }, 2000)
  },
}
</script>

<style lang="scss">
#map {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #e5e9ec;
  overflow: hidden;
}
</style>
