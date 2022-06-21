<template>
  <div class="">
    <h1 style="text-align: center">Datatable with 3rd Party API</h1>
    <v-data-table
      dense
      :page="page"
      :pageCount="numberOfPages"
      :headers="headers"
      :items="passengers"
      :loading="loading"
      class="elevation-1"
    >
    </v-data-table>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'DatatableComponent',
  data() {
    return {
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
        { text: 'nutzungsplanung', value: 'nutzungsplanung' },
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
        .get('https://dvtzufiytcwyhyjdcefr.supabase.co/rest/v1/parcel_test?apikey=' + this.AuthStr)
        //https://api.unfolded.ai/v1/datasets/841da8d1-d830-4303-b79c-cc08c2e442af
        //.get('https://api.instantwebtools.net/v1/passenger?size=' + itemsPerPage + '&page=' + pageNumber)

        .then((response) => {
          //Then injecting the result to datatable parameters.
          //console.log(response.data)
          this.passengers = response.data
          console.log(this.passengers)
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
