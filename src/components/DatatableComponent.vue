<template>
  <div class="">
    <v-card>
      <v-card-title>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
      </v-card-title>
      <v-data-table
        dense
        :page="page"
        :pageCount="numberOfPages"
        :headers="headers"
        :items="passengers"
        :loading="loading"
        :search="search"
        class="elevation-1"
      >
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
      search: '',
      page: 1,
      totalPassengers: 0,
      numberOfPages: 5,
      passengers: [],
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
  methods: {
    //Reading data from API method.
    readDataFromAPI() {
      this.loading = true
      //const { page, itemsPerPage } = this.options
      // let pageNumber = page - 1
      axios
        .get('https://dvtzufiytcwyhyjdcefr.supabase.co/rest/v1/parcel_alba?apikey=' + this.AuthStr)
        //https://api.unfolded.ai/v1/datasets/841da8d1-d830-4303-b79c-cc08c2e442af
        //.get('https://api.instantwebtools.net/v1/passenger?size=' + itemsPerPage + '&page=' + pageNumber)

        .then((response) => {
          //Then injecting the result to datatable parameters.
          //console.log(response.data)
          this.passengers = response.data
          console.log(this.passengers[0]._geojson)
          // this.totalPassengers = response.data.totalPassengers
          //  this.numberOfPages = response.data.totalPages
          this.loading = false
        })
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
