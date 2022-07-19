<template>
  <div>
    <v-card>
      <v-container fluid>
        <v-row dense align="center">
          <v-col cols="4">
            <v-row class="pa-2">
              <span class="text-h5 font-weight-light">{{ parcelcount }}</span>
              <span class="text-h5 font-weight-light"> &nbsp; Parzellen</span>
            </v-row>
          </v-col>

          <v-col cols="6">
            <v-row class="pa-2"> </v-row>
          </v-col>
          <v-col cols="2">
            <v-row class="pa-2 justify-end">
              <v-btn elevation="2" @click="updateData()">Update Map</v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
      <v-data-table
        height="30vh"
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
        <template v-slot:header.EGRIS_EGRI="{ header }">
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
                  <v-text-field v-model="egris" class="pa-2" type="text" label="EGRIS" :autofocus="true">
                  </v-text-field>
                  <v-btn @click="egris = ''" small text color="primary" class="ml-2 mb-2">Clear</v-btn>
                </div>
              </v-menu>
            </th>
          </thead>
        </template>

        <template v-slot:item.OREB="{ item }"
          ><a
            :href="'https://www.oereb2.apps.be.ch/extract/pdf?lang=de&egrid=' + item.EGRIS_EGRI"
            target="_blank"
            style="text-decoration: none"
            ><v-icon small> mdi-file </v-icon></a
          >
        </template>

        <template v-slot:header.Flaeche="{ header }">
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
                  <v-text-field v-model="minFlaeche" class="pa-4" type="text" label="Mindestflaeche" :autofocus="true">
                  </v-text-field>
                  <v-text-field v-model="maxFlaeche" class="pa-4" type="text" label="Maximalflaeche" :autofocus="true">
                  </v-text-field>
                  <v-btn
                    @click=";(minFlaeche = 1500), (maxFlaeche = 30000)"
                    small
                    text
                    color="primary"
                    class="ml-2 mb-2"
                    >Clear</v-btn
                  >
                </div>
              </v-menu>
            </th>
          </thead>
        </template>

        <template v-slot:header.BFSNr="{ header }">
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
                  <v-text-field v-model="GemeindeNr" class="pa-4" type="text" label="Gemeindenummer" :autofocus="true">
                  </v-text-field>
                  <v-btn @click="GemeindeNr = ''" small text color="primary" class="ml-2 mb-2">Clear</v-btn>
                </div>
              </v-menu>
            </th>
          </thead>
        </template>

        <template v-slot:header.nutzungspl="{ header }">
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
                  <v-text-field v-model="parcelZone" class="pa-4" type="text" label="Zone enhält.." :autofocus="true">
                  </v-text-field>
                  <v-switch v-model="filter_RPG" label="ohne Art.18 Abs.1 RPG" dense></v-switch>

                  <v-btn @click="parcelZone = ''" small text color="primary" class="ml-2 mb-2">Clear</v-btn>
                </div>
              </v-menu>
            </th>
          </thead>
        </template>

        <template v-slot:header.ptot_5="{ header }">
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
            </th>
          </thead>
        </template>

        <template v-slot:header.ptot_10="{ header }">
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
            </th>
          </thead>
        </template>

        <template v-slot:header.ptot_15="{ header }">
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
            </th>
          </thead>
        </template>

        <template v-slot:header.Hauptverkehrsachse_direkt="{ header }">
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
                  <v-switch v-model="filter_hauptv_direkt" label="nur direkt an Hauptverkehrsachse" dense></v-switch>
                </div>
              </v-menu>
            </th>
          </thead>
        </template>

        <template v-slot:header.geofit="{ header }">
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
                  <span>(AND logik. alle ausschalten um Filter zu deaktivieren)</span>
                  <v-switch v-model="shapefit_70_28" label="70 x 28m" dense></v-switch>
                  <v-switch v-model="shapefit_50_22" label="50 x 22m" dense></v-switch>
                  <v-switch v-model="shapefit_40_27" label="40 x 27m" dense></v-switch>
                  <v-switch v-model="shapefit_40_22" label="40 x 22m" dense></v-switch>
                  <v-switch v-model="shapefit_33_33" label="33 x 33m" dense></v-switch>
                </div>
              </v-menu>
            </th>
          </thead>
        </template>

        <template v-slot:item.geofit="{ item }"> 70x28: {{ item.shape_check_70_28 }} </template>

        <template v-slot:header.Bus_Takt_Durchschnitt="{ header }">
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
                  <span class="text-h2 font-weight-light" v-text="minAvgBusTakt"></span>
                  <v-slider
                    v-model="minAvgBusTakt"
                    step="5"
                    :max="120"
                    :min="5"
                    dense
                    hint="Minimaler ø OV Takt in Minuten"
                    persistent-hint
                  ></v-slider>
                </div>
              </v-menu>
            </th>
          </thead>
        </template>

        <template v-slot:item.Bus_Takt_Durchschnitt="{ item }">
          ø: {{ item.Bus_Takt_Durchschnitt }}m Max:{{ item.Bus_Takt_Maximal }}m
        </template>

        <template v-slot:header.valid="{ header }">
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
                  <v-switch v-model="validOnly" label="only valid"></v-switch>
                </div>
              </v-menu>
            </th>
          </thead>
        </template>

        <template v-slot:item.valid="{ item }">
          <v-simple-checkbox :ripple="false" v-model="item.valid" @click="validateItem(item)"></v-simple-checkbox>
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
      GemeindeNr: '',
      parcelZone: '',
      filter_RPG: true,

      minFlaeche: 1500,
      maxFlaeche: 30000,

      minTot_5: 0,
      minTot_10: 0,
      minTot_15: 0,

      filter_hauptv_direkt: true,
      filter_hauptv_100m: false,

      shapefit_70_28: true,
      shapefit_50_22: true,
      shapefit_40_27: true,
      shapefit_40_22: true,
      shapefit_33_33: true,

      minAvgBusTakt: 30,

      validOnly: false,
      geoArray: [],
      search: '',
      page: 1,
      numberOfPages: 5,
      parcels: [],
      loading: true,
      options: {},
      supabaseDB: import.meta.env.VITE_SUPABASE_DB || '',
      headers: [
        { text: 'OREB', value: 'OREB', groupable: false, width: '1%' },
        { text: 'EGRIS_EGRI', value: 'EGRIS_EGRI', groupable: false },
        { text: 'Gemeinde', value: 'BFSNr', groupable: false },
        { text: 'Flaeche', value: 'Flaeche', groupable: false },
        { text: 'nutzungsplanung', value: 'nutzungspl' },
        { text: 'Einz.geb.5m', value: 'ptot_5', groupable: false },
        { text: 'Einz.geb.10m', value: 'ptot_10', groupable: false },
        { text: 'Einz.geb.15m', value: 'ptot_15', groupable: false },
        { text: 'Hauptverk.', value: 'Hauptverkehrsachse_direkt', groupable: false },
        { text: 'Geometrie', value: 'geofit', groupable: false },
        { text: 'øOVTakt', value: 'Bus_Takt_Durchschnitt', groupable: false },
        { text: 'Valid', value: 'valid', groupable: false },
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

    filteredParcels() {
      let conditions = []
      let filtered = this.parcels

      if (this.egris) {
        conditions.push(this.filterEgris)
      }

      if (this.GemeindeNr) {
        conditions.push(this.filterGemeinde)
      }

      if (this.minFlaeche) {
        conditions.push(this.filterminFlaeche)
      }

      if (this.maxFlaeche) {
        conditions.push(this.filtermaxFlaeche)
      }

      if (this.parcelZone) {
        conditions.push(this.filterParcelZone)
      }

      if (this.filter_RPG) {
        conditions.push(this.filterRPG)
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

      if (this.filter_hauptv_direkt) {
        conditions.push(this.filterHauptverkehr)
      }

      if (
        this.shapefit_70_28 ||
        this.shapefit_50_22 ||
        this.shapefit_40_27 ||
        this.shapefit_40_22 ||
        this.shapefit_33_33
      ) {
        conditions.push(this.filterShape)
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

    filterEgris(item) {
      return item.EGRIS_EGRI.toLowerCase().includes(this.egris.toLowerCase())
    },

    filterGemeinde(item) {
      return item.BFSNr == this.GemeindeNr
    },

    filterminFlaeche(item) {
      return item.Flaeche > this.minFlaeche
    },

    filtermaxFlaeche(item) {
      return item.Flaeche < this.maxFlaeche
    },

    filterParcelZone(item) {
      return item.nutzungspl.toLowerCase().includes(this.parcelZone.toLowerCase())
    },

    filterRPG(item) {
      return !item.Art18_ausserhalb_Bauzone == this.filter_RPG
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

    filterHauptverkehr(item) {
      return item.Hauptverkehrsachse_direkt == this.filter_hauptv_direkt
    },

    filterShape(item) {
      return (
        item.shape_check_70_28 == this.shapefit_70_28 &&
        item.shape_check_50_22 == this.shapefit_50_22 &&
        item.shape_check_40_27 == this.shapefit_40_27 &&
        item.shape_check_40_22 == this.shapefit_40_22 &&
        item.shape_check_33_33 == this.shapefit_33_33
      )
    },

    filterBusTakt(item) {
      return item.Bus_Takt_Durchschnitt < this.minAvgBusTakt
    },

    filterValid(item) {
      return item.valid == this.validOnly
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
      console.log(`${e.EGRIS_EGRI} is set to ${e.valid}`)
      const { data, error } = await supabase
        .from(this.supabaseDB)
        .update({ valid: e.valid })
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

    clickedRow(e, row) {
      this.updateData()
      //console.log(e._geojson.geometry)

      //let featuregeo = JSON.parse(e._geojson).geometry
      let featuregeo = e._geojson.geometry

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
