<template>
  <div id="info_board" class="pa-2">
    <h4 class="font-weight-light">
      <strong>Angewendete Grundfilter:</strong>
    </h4>
    <p class="text-caption font-weight-light">
      <strong>Zone:</strong> nur Bauzone, ohne Landwirtschaft, ohne Zone für öffentliche Bauten
    </p>
    <p class="text-caption font-weight-light"><strong>Fläche:</strong> grösser 1500qm, kleiner 100000qm</p>
    <p class="text-caption font-weight-light">
      <strong>Einzugsgebiet:</strong> Mind. 10000 Personen innerhalb 15min Auto
    </p>
    <p class="text-caption font-weight-light">
      <strong>OV:</strong> Mind. 1 Haltestelle mit min.60min Taktung innerhalb 300m
    </p>
    <p class="text-caption font-weight-light"><strong>Hauptstrasse: </strong>Direkt oder innerhalb 100m Offset</p>
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
