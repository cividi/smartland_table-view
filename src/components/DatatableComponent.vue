<template>
  <div class="">
    <v-card>
      <v-card-title>
        <v-container fluid>
          <v-row>
            <v-col cols="4">
              <v-row class="pa-4">
                <!-- Filter for dessert name-->
                <span class="text-h4 font-weight-light">{{ parcelcount }}</span>
                <span class="text-h4 font-weight-light"> &nbsp; Parzellen</span>
              </v-row>
            </v-col>

            <v-col cols="6">
              <v-row class="pa-4"> </v-row>
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
                <v-icon small> mdi-filter </v-icon>
              </v-btn>
            </template>
            <div style="background-color: white; width: 280px">
              <v-text-field v-model="minFlaeche" class="pa-4" type="text" label="Mindestflaeche" :autofocus="true">
              </v-text-field>
              <v-btn @click="minFlaeche = 0" small text color="primary" class="ml-2 mb-2">Clear</v-btn>
            </div>
          </v-menu>
        </template>

        <template v-slot:header.nutzungspl="{ header }">
          {{ header.text }}
          <v-menu offset-y :close-on-content-click="false">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon small> mdi-filter </v-icon>
              </v-btn>
            </template>
            <div style="background-color: white; width: 280px">
              <v-text-field v-model="parcelZone" class="pa-4" type="text" label="Zone includes" :autofocus="true">
              </v-text-field>
              <v-btn @click="parcelZone = ''" small text color="primary" class="ml-2 mb-2">Clear</v-btn>
            </div>
          </v-menu>
        </template>

        <template v-slot:header.ptot_5="{ header }">
          {{ header.text }}
          <v-menu offset-y :close-on-content-click="false">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon small> mdi-filter </v-icon>
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
                hint="Personen im Einzugsgebiet von 5min per Auto"
                persistent-hint
              ></v-slider>
            </div>
          </v-menu>
        </template>

        <template v-slot:header.ptot_10="{ header }">
          {{ header.text }}
          <v-menu offset-y :close-on-content-click="false">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon small> mdi-filter </v-icon>
              </v-btn>
            </template>
            <div style="background-color: white; width: 280px">
              <span class="text-h2 font-weight-light" v-text="minTot_10"></span>
              <v-slider
                v-model="minTot_10"
                step="500"
                :max="50000"
                :min="0"
                dense
                hint="Personen im Einzugsgebiet von 10min per Auto"
                persistent-hint
              ></v-slider>
            </div>
          </v-menu>
        </template>

        <template v-slot:header.ptot_15="{ header }">
          {{ header.text }}
          <v-menu offset-y :close-on-content-click="false">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon small> mdi-filter </v-icon>
              </v-btn>
            </template>
            <div style="background-color: white; width: 280px">
              <span class="text-h2 font-weight-light" v-text="minTot_15"></span>
              <v-slider
                v-model="minTot_15"
                step="500"
                :max="50000"
                :min="0"
                dense
                hint="Personen im Einzugsgebiet von 15min per Auto"
                persistent-hint
              ></v-slider>
            </div>
          </v-menu>
        </template>

        <template v-slot:header.validated="{ header }">
          {{ header.text }}

          <v-menu offset-y :close-on-content-click="false">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon small> mdi-filter </v-icon>
              </v-btn>
            </template>
            <div style="background-color: white; width: 140px">
              <v-switch v-model="validatedOnly" label="only validated"></v-switch>
            </div>
          </v-menu>
        </template>

        <template v-slot:item.validated="{ item }">
          <v-simple-checkbox :ripple="false" v-model="item.validated" @click="validateItem(item)"></v-simple-checkbox>
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

        <template v-slot:item.id="{ index }">
          {{ index + 1 }}
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
      parcelZone: '',
      minFlaeche: 0,
      minTot_5: 0,
      minTot_10: 0,
      minTot_15: 0,
      validatedOnly: false,
      geoArray: [],
      search: '',
      page: 1,
      numberOfPages: 5,
      parcels: [],
      loading: true,
      options: {},
      supabaseDB: import.meta.env.VITE_SUPABASE_DB || '',
      headers: [
        { text: 'EGRIS_EGRI', value: 'EGRIS_EGRI', groupable: false },
        { text: 'Flaeche', value: 'Flaeche', groupable: false },
        { text: 'nutzungsplanung', value: 'nutzungspl' },
        { text: 'Einzugsgebiet 5min', value: 'ptot_5', groupable: false },
        { text: 'Einzugsgebiet 10min', value: 'ptot_10', groupable: false },
        { text: 'Einzugsgebiet 15min', value: 'ptot_15', groupable: false },
        { text: 'Validated', value: 'validated', groupable: false },
        { text: 'Rating', value: 'rating', groupable: false },
        { text: 'id', value: 'id', groupable: false }, //not in the model, only for visual purpose, see html part
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

    filteredParcels() {
      let conditions = []
      let filtered = this.parcels

      if (this.minFlaeche) {
        conditions.push(this.filterFlaeche)
      }

      if (this.parcelZone) {
        conditions.push(this.filterParcelZone)
      }

      if (this.minTot_5) {
        conditions.push(this.filterTot_5)
      }

      if (this.minTot_10) {
        conditions.push(this.filterTot_10)
      }

      if (this.minTot_15) {
        conditions.push(this.filterTot_15)
      }

      if (this.validatedOnly) {
        conditions.push(this.filterValidated)
      }

      if (conditions.length > 0) {
        filtered = this.parcels.filter((parcel) => {
          return conditions.every((condition) => {
            return condition(parcel)
          })
        })
      }

      return filtered.map((parcel, index) => ({
        ...parcel,
        index: index + 1,
      }))
    },
  },

  methods: {
    //Reading data from API method.
    async readDataFromAPI() {
      this.loading = true
      const { data } = await supabase.from(this.supabaseDB).select('*') ///limit increased on supabase settings

      this.parcels = data
      console.log(data)
      this.loading = false
      this.updateData()
    },

    filterFlaeche(item) {
      return item.Flaeche > this.minFlaeche
    },

    filterParcelZone(item) {
      return item.nutzungspl.toLowerCase().includes(this.parcelZone.toLowerCase())
    },

    filterTot_5(item) {
      return item.ptot_5 > this.minTot_5
    },

    filterTot_10(item) {
      return item.ptot_10 > this.minTot_10
    },

    filterTot_15(item) {
      return item.ptot_15 > this.minTot_15
    },

    filterValidated(item) {
      return item.validated == this.validatedOnly
    },
    //this will update the prop for deck

    updateData() {
      this.geoArray = this.filteredParcels.map((obj) => JSON.stringify(obj._geojson)) //stringify added as db now stores geometry as a json field
      console.log(this.geoArray) //print

      let featuresString = this.geoArray.join(',') //joins array of features into feature string
      let collectionString = '{ "type": "FeatureCollection","features": [' + featuresString + ']}' //combines features into a feature collection string
      let geojsonObj = JSON.parse(collectionString)

      this.$emit('updateData', geojsonObj)
    },

    async validateItem(e) {
      console.log(`${e.EGRIS_EGRI} is set to ${e.validated}`)
      const { data, error } = await supabase
        .from(this.supabaseDB)
        .update({ validated: e.validated })
        .match({ EGRIS_EGRI: e.EGRIS_EGRI })
      console.log(data, error)
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
    },

    clickedRow(e) {
      this.updateData()
      //console.log(e._geojson.geometry)

      //let featuregeo = JSON.parse(e._geojson).geometry
      let featuregeo = e._geojson.geometry

      let longitude = featuregeo.coordinates[0][0][0]
      let latitude = featuregeo.coordinates[0][0][1]

      let id = e.index

      const feature = { latitude: latitude, longitude: longitude, index: id }
      this.$emit('rowSelect', feature)

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
