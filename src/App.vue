<template>
  <v-app id="app">
    <v-container>
      <DatatableComponent />
    </v-container>
  </v-app>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import DatatableComponent from './components/DatatableComponent.vue'

export default defineComponent({
  name: 'App',
  components: {
    DatatableComponent,
  },
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
