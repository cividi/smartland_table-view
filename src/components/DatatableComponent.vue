<template>
  <div class="">
    <v-card>
      <v-card-title>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
        <button @click="updateData()">Update</button>
      </v-card-title>
      <v-data-table
        @current-items="getFiltered"
        @click:row="clickedRow"
        
        :page="page"
        :pageCount="numberOfPages"
        :headers="headers"
        :items="filteredParcels"
        :loading="loading"
        :search="search"
        class="elevation-1"
      >
          <template v-slot:header.nutzungspl="{ header }">
            {{ header.text }}
            <v-menu offset-y :close-on-content-click="false">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon small>
                    mdi-filter
                  </v-icon>
                </v-btn>
              </template>
              <div style="background-color: white; width: 280px">
                <v-text-field
                  v-model="parcelZone"
                  class="pa-4"
                  type="text"
                  label="Enter the search term"
                  :autofocus="true"
                ></v-text-field>
                <v-btn
                  @click="parcelZone = ''"
                  small
                  text
                  color="primary"
                  class="ml-2 mb-2"
                >Clean</v-btn>
              </div>
            </v-menu>
          </template>
    </v-data-table>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'DatatableComponent',
  data() {
    return {
      parcelZone: '',      
      geoArray: [],
      search: '',
      page: 1,
      totalParcels: 0,
      numberOfPages: 5,
      parcels: [],
      loading: true,
      options: {},
      AuthStr:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2dHp1Zml5dGN3eWh5amRjZWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTU4MjI5MzksImV4cCI6MTk3MTM5ODkzOX0.sYiIOCDj0cMSy_8WRQ9oCvPNUvc64IjsfbD3ow2Kd9A',
      headers: [
        { text: 'EGRIS_EGRI', value: 'EGRIS_EGRI' },
        { text: 'Flaeche', value: 'Flaeche', filterable: true },
        { text: 'nutzungsplanung', value: 'nutzungspl' },
        { text: 'Einzugsgebiet 5min', value: 'ptot_5' },
        { text: 'Einzugsgebiet 10min', value: 'ptot_10' },
        { text: 'Einzugsgebiet 15min', value: 'ptot_15' },
      ],
      filters: {
        Flaeche: ['ddd'],
        ptot_5: [],
        ptot_10: [],
      },
      testdata: {
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
    }
  },
  //this one will populate new data set when user changes current page.
  watch: {
    options: {
      handler() {
        this.readDataFromAPI()
      },
    },
    deep: true,
  },

  computed: {

    filteredParcels() {
      
      let conditions = []
      
      if (this.parcelZone) {
        conditions.push(this.filterParcelZone);
      }
      
      
      if (conditions.length > 0) {
        return this.parcels.filter((parcel) => {
          return conditions.every((condition) => {
            return condition(parcel);
          })
        })
      }
      
      return this.parcels;
    }
  },


  methods: {
    //Reading data from API method.
    readDataFromAPI() {
      this.loading = true
      //const { page, itemsPerPage } = this.options
      // let pageNumber = page - 1
      axios
        .get('https://dvtzufiytcwyhyjdcefr.supabase.co/rest/v1/parcel_alba?apikey=' + this.AuthStr)
        //https://api.unfolded.ai/v1/datasets/841da8d1-d830-4303-b79c-cc08c2e442af
        //.get('https://api.instantwebtools.net/v1/oarcel?size=' + itemsPerPage + '&page=' + pageNumber)

        .then((response) => {
          //Then injecting the result to datatable parameters.
          //console.log(response.data)
          this.parcels = response.data
          console.log(this.parcel[0]._geojson)
          this.loading = false
        })
    },

    filterParcelZone(item) {
       return item.nutzungspl.toLowerCase().includes(this.parcelZone.toLowerCase());
     },
    //this will update the prop for deck


    

    updateData() {
      let featuresString = this.geoArray.join(',')
      let collectionString = '{ "type": "FeatureCollection","features": [' + featuresString + ']}'
      let geojsonObj = JSON.parse(collectionString)

      this.$emit('updateData', geojsonObj)
    },

    getFiltered(e) {
      this.geoArray = e.map((obj) => obj._geojson)
      console.log(this.geoArray) //output the filtered items
    },

    clickedRow(e) {
      console.log(e) //output the filtered items
      this.$emit('rowSelect', '')

      // Json.parse('"{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[7.292724985126278,47.10542403346226],[7.293457995648748,47.105667138601575],[7.294181119718246,47.10482842651928],[7.294103949015508,47.10478412777309],[7.293627810481179,47.10437188033611],[7.292724985126278,47.10542403346226]]]},"properties":{}}"'

      // check why row select returns nasty strings
    },
  },
  //this will trigger in the onReady State
  mounted() {
    this.readDataFromAPI()
  },
}
</script>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
