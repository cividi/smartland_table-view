<template>
  <div class="">
    <v-card>
      <v-card-title>
                <v-container fluid>
                    <v-row>
    
                        <v-col cols="4">
                            <v-row class="pa-4">
                                <!-- Filter for dessert name-->
                                <span class="text-h4 font-weight-light" >{{ parcelcount }}</span>
                                <span class="text-h4 font-weight-light" > &nbsp; Parzellen</span>
                            </v-row>
                        </v-col>

                        <v-col cols="6">
                            <v-row class="pa-4">

                            </v-row>
 
                        </v-col>
    
                        <v-col cols="2">
                            <v-row class="pa-2 justify-end">
                               <v-btn elevation="2" @click="updateData()">Update Map</v-btn>
                            </v-row>
                        </v-col>
    
                    </v-row>
                </v-container>
      </v-card-title>
      <v-data-table
        @click:row="clickedRow"
        
        :page="page"
        :pageCount="numberOfPages"
        :headers="headers"
        :items="filteredParcels"
        :loading="loading"
        :search="search"
        show-group-by

        class="elevation-1"
      >


            
          <template v-slot:header.Flaeche="{ header }">
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
                  v-model="minFlaeche"
                  class="pa-4"
                  type="text"
                  label="Mindestflaeche"
                  :autofocus="true"
                ></v-text-field>
                <v-btn
                  @click="minFlaeche = 100000"
                  small
                  text
                  color="primary"
                  class="ml-2 mb-2"
                >Clean</v-btn>
              </div>
            </v-menu>
          </template>

          
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
                  label="Zone includes"
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

          <template v-slot:header.ptot_5="{ header }">
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
                  <span class="text-h2 font-weight-light" v-text="minTot_5"></span>
                  <v-slider
                 v-model="minTot_5"
                  step="500"
                  :max="20000"
                  :min="0"
                  dense
                  hint = "Personen im Einzugsgebiet von 5min per Auto"
                  persistent-hint
                ></v-slider>

              </div>
            </v-menu>
          </template>

          <template v-slot:item.verified="{ item }">
        <v-simple-checkbox
          v-model="item.verified"
        ></v-simple-checkbox>
      </template>

      <template v-slot:item.rating="{ item }">
        <v-rating
           v-model="item.rating"
          empty-icon="mdi-star-outline"
          full-icon="mdi-star"
          hover
          length="5"
          size="18"
          color="grey"
          background-color="grey"

          dense
        ></v-rating>
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
      minFlaeche: 0,     
      minTot_5: 0,     

      geoArray: [],
      search: '',
      page: 1,
      numberOfPages: 5,
      parcels: [],
      loading: true,
      options: {},
      AuthStr:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2dHp1Zml5dGN3eWh5amRjZWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTU4MjI5MzksImV4cCI6MTk3MTM5ODkzOX0.sYiIOCDj0cMSy_8WRQ9oCvPNUvc64IjsfbD3ow2Kd9A',
      headers: [
        { text: 'EGRIS_EGRI', value: 'EGRIS_EGRI' ,groupable: false,},
        { text: 'Flaeche', value: 'Flaeche', groupable: false, },
        { text: 'nutzungsplanung', value: 'nutzungspl' },
        { text: 'Einzugsgebiet 5min', value: 'ptot_5' ,groupable: false,},
        { text: 'Einzugsgebiet 10min', value: 'ptot_10', groupable: false, },
        { text: 'Einzugsgebiet 15min', value: 'ptot_15' ,groupable: false,},
        { text: 'Verified', value: 'verified' ,groupable: false,},
        { text: 'Rating', value: 'rating' ,groupable: false,},


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

      //this updates parcelount html variable
      parcelcount: function() {

          return Object.keys(this.filteredParcels).length

},

    filteredParcels() {
      
      let conditions = []
      
      if (this.minFlaeche) {
        conditions.push(this.filterFlaeche);
      }
      
      if (this.parcelZone) {
        conditions.push(this.filterParcelZone);
      }

      if (this.minTot_5) {
        conditions.push(this.filterTot_5);
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
          //console.log(this.parcel[0]._geojson)
          this.loading = false
        })
    },

    filterFlaeche(item) {
       return item.Flaeche > this.minFlaeche;
     },

    filterParcelZone(item) {
       return item.nutzungspl.toLowerCase().includes(this.parcelZone.toLowerCase());
     },

    filterTot_5(item) {
       return item.ptot_5 > this.minTot_5;
     },
    //this will update the prop for deck


    

    updateData() {

      this.geoArray = this.filteredParcels.map((obj) => obj._geojson)
      console.log(this.geoArray) //print
 

      let featuresString = this.geoArray.join(',') //joins array of features into feature string 
      let collectionString = '{ "type": "FeatureCollection","features": [' + featuresString + ']}' //combines features into a feature collection string
      let geojsonObj = JSON.parse(collectionString)

      this.$emit('updateData', geojsonObj)
    },


    clickedRow(e) {
      console.log(e) //output the clicked row
      const center = {latitude:46.92170893120651, longitude:7.37087148808481}
      this.$emit('rowSelect', center)

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
