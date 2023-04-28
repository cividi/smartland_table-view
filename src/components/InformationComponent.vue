<template>
  <div id="info_board" class="pa-2">
    <h4 class="font-weight-light">
      <strong>Grundfilter:</strong>
    </h4>
    <p class="text-caption font-weight-light">
      <strong>Zone:</strong> Arbeitzone (harmonisiert)
    </p>
    <p class="text-caption font-weight-light"><strong>Fläche:</strong> grösser 5000qm, kleiner 30'0000qm</p>
    <p class="text-caption font-weight-light">
      <strong>Einzugsgebiet:</strong> Mind. 10000 Personen innerhalb 15min Auto
    </p>
    <p class="text-caption font-weight-light">
      <strong>OV:</strong> Klasse A,B,C
    </p>
    <p class="text-caption font-weight-light"><strong>: </strong>Direkt oder innerhalb 100m Offset</p>
  </div>
</template>

<script>
export default {
  name: 'information-component',
  props: {},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
#info_board {
  height: 100%;
  width: 100%;
}
</style>
