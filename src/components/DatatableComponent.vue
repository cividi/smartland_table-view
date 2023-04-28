<template>
  <div>
    <v-card>
      <v-container fluid>
        <v-row dense align="center">
          <v-col cols="2">
            <v-row class="pa-2">
              <span class="text-h5 font-weight-light">{{ parcelcount }}</span>
              <span class="text-h5 font-weight-light"> &nbsp; Parzellen</span>
            </v-row>
          </v-col>

          <v-col cols="8"> </v-col>

          <v-col cols="1">
            <v-row class="pa-2 justify-end">
              <v-btn small elevation="2" @click="readDataFromAPI()">Refresh Data</v-btn>
            </v-row>
          </v-col>

          <v-col cols="1">
            <v-row class="pa-2 justify-end">
              <v-btn small elevation="2" @click="updateData()">Update Map</v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
      <v-data-table
        height="33vh"
        @click:row="clickedRow"
        :page="page"
        :pageCount="numberOfPages"
        :headers="headers"
        :items="filteredParcels"
        :loading="loading"
        :search="search"
        show-group-by
        class="elevation-1"
        fixed-header
        single-select
        item-key="index"
        dense
      >

        <template v-slot:item.OREB="{ item }"
          ><a
            :href=""
            target="_blank"
            style="text-decoration: none"
            ><v-icon small> mdi-file </v-icon></a
          >
        </template>

        


        <template v-slot:header.height_95%="{ header }">
          <thead>
            <th>
              {{ header.text }}
            </th>
            <th>
              <v-menu offset-y :close-on-content-click="false">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon small> mdi-filter </v-icon>
                  </v-btn>
                </template>
                <div style="background-color: white; width: 280px">
                  <span class="text-h2 font-weight-light" v-text="minHeight"></span>
                  <v-slider
                    v-model="minHeight"
                    step="1"
                    :max="30"
                    :min="0"
                    dense
                    hint="Personen im Einzugsgebiet von 5min per Auto gem. BFS StatPop"
                    persistent-hint
                  ></v-slider>
                </div>
              </v-menu>
            </th>
          </thead>
        </template>


        <template v-slot:header.passed_footprint_criteria="{ header }">
          <thead>
            <th>
              {{ header.text }}
            </th>
            <th>
              <v-menu offset-y :close-on-content-click="false">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon small> mdi-filter </v-icon>
                  </v-btn>
                </template>
                <div style="background-color: white; width: 280px">
                  <v-switch v-model="filter_footprint" label="nur direkt an Hauptverkehrsachse" dense></v-switch>
                </div>
              </v-menu>
            </th>
          </thead>
        </template>





        <template v-slot:header.checked="{ header }">
          <thead>
            <th>
              {{ header.text }}
            </th>
            <th>
              <v-menu offset-y :close-on-content-click="false">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon small> mdi-filter </v-icon>
                  </v-btn>
                </template>
                <div style="background-color: white; width: 140px">
                  <v-switch v-model="checkedOnly" label="nur geprüfte Parzellen"></v-switch>
                </div>
              </v-menu>
            </th>
          </thead>
        </template>

        <template v-slot:item.checked="{ item }">
          <v-simple-checkbox :ripple="false" v-model="item.checked" @click="checkItem(item)"></v-simple-checkbox>
        </template>

        <template v-slot:header.invalid="{ header }">
          <thead>
            <th>
              {{ header.text }}
            </th>
            <th>
              <v-menu offset-y :close-on-content-click="false">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon small> mdi-filter </v-icon>
                  </v-btn>
                </template>
                <div style="background-color: white; width: 140px">
                  <v-switch v-model="validOnly" label="nur valide Parzellen"></v-switch>
                </div>
              </v-menu>
            </th>
          </thead>
        </template>

        <template v-slot:item.invalid="{ item }">
          <v-simple-checkbox :ripple="false" v-model="item.invalid" @click="validateItem(item)"></v-simple-checkbox>
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
            v-on:input="rateItem(item)"
          ></v-rating>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import supabase from '../utils/supabase'
import {
  VContainer,
  VCol,
  VRow,
  VCard,
  VCardTitle,
  VCardText,
  VBtn,
  VDataTable,
  VRating,
  VSimpleCheckbox,
  VSlider,
  VMenu,
  VIcon,
  VTextField,
  VSwitch,
} from 'vuetify/lib/components'

export default {
  name: 'DatatableComponent',
  components: {
    VContainer,
    VCol,
    VRow,
    VCard,
    VCardTitle,
    VCardText,
    VBtn,
    VDataTable,
    VTextField,
    VRating,
    VSimpleCheckbox,
    VSlider,
    VMenu,
    VIcon,
    VSwitch,
  },
  data() {
    return {
      selectedRow: -1,

      egris: '',
      Gemeinde: '',
      parcelZone: '',


      minHeight: 0,

      filter_footprint: false,

      validOnly: false,
      checkedOnly: false,

      geoArray: [],
      search: '',
      page: 1,
      numberOfPages: 5,
      parcels: [],
      loading: true,
      options: {},
      supabaseDB: import.meta.env.VITE_SUPABASE_DB || '',
      headers: [
        { text: 'OREB', value: 'oereb_extract_url', groupable: false, width: '1%' },
        { text: 'EGRIS_EGRI', value: 'EGRIS_EGRI', groupable: false },
        { text: 'Flaeche', value: 'land_area', groupable: false },
        { text: 'Zone Kant.', value: 'typ_kant_1', groupable: false },
        { text: 'Zone Kommunal', value: 'typ_komm_1', groupable: false  },
        { text: 'Erwartete Max. Höhe', value: 'height_95', groupable: false },
        { text: '25x45m Footprint', value: 'passed_footprint_criteria', groupable: false },
        { text: 'OV Klasse', value: 'OeV_Gueteklassen_KLASSE', groupable: false },
        { text: 'Geprüft', value: 'checked', groupable: false },
        { text: 'Invalid', value: 'invalid', groupable: false },
        { text: 'Rating', value: 'rating', groupable: false },
      ],
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
    parcelcount: function () {
      return Object.keys(this.filteredParcels).length
    },

    filteredParcels: {
      get() {
        let conditions = []
        var filtered = this.parcels

        if (this.egris) {
          conditions.push(this.filterEgris)
        }
  

        if (this.minHeight) {
          conditions.push(this.filterHeight)
        }

        if (this.filter_footprint) {
          conditions.push(this.filterFootprint)
        }

        if (this.checkedOnly) {
          conditions.push(this.filterChecked)
        }

        if (this.validOnly) {
          conditions.push(this.filterValid)
        }

        if (this.minAvgBusTakt) {
          conditions.push(this.filterBusTakt)
        }

        if (conditions.length > 0) {
          filtered = this.parcels.filter((parcel) => {
            return conditions.every((condition) => {
              return condition(parcel)
            })
          })
          console.log(filtered)
        }

        return filtered.map((parcel, index) => ({
          ...parcel,
          index: index + 1,
        }))
      },
      set(newValue) {
        console.log('filtered parcels:' + newValue)
      },
    },
  },

  methods: {
    //Reading data from API method.
    async readDataFromAPI() {
      this.loading = true
      //const { data } = await supabase.from(this.supabaseDB).select('*') ///limit increased on supabase settings

      const { data } = await supabase.from(this.supabaseDB).select('*') ///limit increased on supabase settings

      this.parcels = data
      //console.log(data)
      this.loading = false
      this.updateData()
    },

    filterEgris(item) {
      return item.EGRIS_EGRI.toLowerCase().includes(this.egris.toLowerCase())
    },




    filterHeight(item) {
      return height_95 > this.minHeight
    },


    filterFootprint(item) {
      return item.passed_footprint_criteria == this.filter_footprint
    },



    filterChecked(item) {
      return item.checked == true //this.checkedOnly
    },

    filterValid(item) {
      return item.invalid == false
    },
    //this will update the prop for deck

    updateData() {
      //this.geoArray = this.filteredParcels.map((obj) => JSON.stringify(obj._geojson)) //stringify added as db now stores geometry as a json field

      this.geoArray = this.filteredParcels.map((obj) => obj._geojson.slice(1,-1)) //this is a workaround as json is stored as text with "" around
      console.log(this.geoArray) //print

      let featuresString = this.geoArray.join(',') //joins array of features into feature string
      let collectionString = '{ "type": "FeatureCollection","features": [' + featuresString + ']}' //combines features into a feature collection string
      let geojsonObj = JSON.parse(collectionString)

      this.$emit('updateData', geojsonObj)
    },

    async checkItem(e) {
      console.log(`${e.EGRIS_EGRI} checked is set to ${e.checked}`)
      const { data, error } = await supabase
        .from(this.supabaseDB)
        .update({ checked: e.checked })
        .match({ EGRIS_EGRI: e.EGRIS_EGRI })
      console.log(data, error)

      //below updates the local parcels array-  would also work with map but more efficient with the for loop as it breaks once done
      for (const obj of this.parcels) {
        if (obj.EGRIS_EGRI === e.EGRIS_EGRI) {
          obj.checked = e.checked
          break
        }
      }

      this.updateData()
    },

    async validateItem(e) {
      console.log(`${e.EGRIS_EGRI} invalid is set to ${e.invalid}`)
      const { data, error } = await supabase
        .from(this.supabaseDB)
        .update({ invalid: e.invalid })
        .match({ EGRIS_EGRI: e.EGRIS_EGRI })
      console.log(data, error)

      //below updates the local parcels array-  would also work with map but more efficient with the for loop as it breaks once done
      for (const obj of this.parcels) {
        if (obj.EGRIS_EGRI === e.EGRIS_EGRI) {
          obj.invalid = e.invalid
          break
        }
      }

      // alternative: this.readDataFromAPI() //test -> achtung: race condition?
      this.updateData()
    },

    async rateItem(e) {
      if (e.rating) {
        console.log(`${e.EGRIS_EGRI} is now rated at ${e.rating}`)
        const { data, error } = await supabase
          .from(this.supabaseDB)
          .update({ rating: e.rating })
          .match({ EGRIS_EGRI: e.EGRIS_EGRI })
        console.log(data, error)
      }

      //below updates the local parcels array-  would also work with map but more efficient with the for loop as it breaks once done
      for (const obj of this.parcels) {
        if (obj.EGRIS_EGRI === e.EGRIS_EGRI) {
          obj.rating = e.rating
          break
        }
      }

      this.updateData()
    },

    clickedRow(e, row) {
      this.updateData()
      //console.log(e._geojson.geometry)

      let featuregeo = JSON.parse(e._geojson.slice(1,-1)).geometry
      //let featuregeo = e._geojson.geometry

      let longitude = featuregeo.coordinates[0][0][0]
      let latitude = featuregeo.coordinates[0][0][1]

      this.selectedRow = e.index

      const feature = { latitude: latitude, longitude: longitude, index: this.selectedRow }
      this.$emit('rowSelect', feature)

      row.select(true)

      //console.log(feature)

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
