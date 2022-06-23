<template>
  <v-app id="app">
    <v-container id="deck1" fluid>
      <v-row>
        <v-col><VueDeck /></v-col>
      </v-row>
    </v-container>
    <v-container id="table_container" fluid>
      <v-row>
        <v-col><DatatableComponent /></v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import DatatableComponent from './components/DatatableComponent.vue'
import VueDeck from './components/deck.vue'

export default defineComponent({
  name: 'App',
  components: {
    DatatableComponent,
    VueDeck,
  },
})
</script>

<style>
#deck1 {
  position: relative;
  width: 100%;
  margin: 0 auto;
  height: 60vh;
}

#table_container {
  display: relative;
  bottom: 0;
  z-index: 3;
}
</style>
