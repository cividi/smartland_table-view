<template>
  <div class="deck-container" ref="deckContainerRef">
    {{ mapData }}

    <VueDeckgl :layers="layers" :viewState="viewState" @click="handleClick" @view-state-change="updateViewState">
      <template>
        <div id="map" ref="map"></div>
      </template>
    </VueDeckgl>
  </div>
</template>
<script>
import VueDeckgl from 'vue-deck.gl'
import { GeoJsonLayer, SolidPolygonLayer } from '@deck.gl/layers'
import mapboxgl from 'mapbox-gl'

export default {
  name: 'VueDeck',
  props: {
    mapData: Array,
  },
  components: {
    VueDeckgl,
  },
  data() {
    return {
      accessToken: 'pk.eyJ1IjoiZ2VtZWluZGVzY2FuIiwiYSI6ImNrNXdqejRtMjAzaWwzbXBkbzQwejFsdDAifQ.-uuEzwv7CsbdJgDKLT6i9g',
      mapStyle: 'mapbox://styles/gemeindescan/cl379xy8d001614m7qrl9furx',
      viewState: {
        latitude: 46.92271073977435,
        longitude: 7.373082645279086,
        zoom: 10,
        bearing: 0,
        pitch: 0,
      },

      pathData: [
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
                [7.37087148808481, 46.92170893120651],
                [7.371999287420623, 46.922139196536556],
                [7.372574000539433, 46.921432267371635],
                [7.371456621720615, 46.92110618750734],
                [7.37087148808481, 46.92170893120651],
              ],
            ],
          },
          properties: {},
        },
      ],

      polygonData: {},
    }
  },

  computed: {
    layers() {
      const paths = new GeoJsonLayer({
        id: 'geojson-layer',
        //data: this.pathData,
        data: this.mapData,
        pickable: true,
        stroked: false,
        filled: true,
        extruded: false,
        pointType: 'circle',
        lineWidthScale: 20,
        lineWidthMinPixels: 5,
        getFillColor: [255, 0, 0],
        getLineColor: (d) => colorToRGBArray(d.properties.color),
        getPointRadius: 100,
        getLineWidth: 1,
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
