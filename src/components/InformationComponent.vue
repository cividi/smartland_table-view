<template>
  <div id="info_board" class="pa-2">
    <h4 class="font-weight-light">
      <strong>Standortsuche Haefeliareal</strong>
    </h4>
    <p class="text-caption font-weight-light">
      <strong>Lage:</strong> Innerhalb 9KM vom heutigen Standort
    </p>
    <p class="text-caption font-weight-light">
      <strong>Zone:</strong> Arbeitzone (Industrie/Gewerbe)
    </p>
    <p class="text-caption font-weight-light"><strong>Fläche:</strong> mind. 5000qm Footprint (Setback 5m)</p>
    <p class="text-caption font-weight-light">
      <strong>Gebäude:</strong> Unbebaut oder mehrheitlich* vor 1990 erbaut (*gewichtet nach Baumasse)
    </p>
    <p class="text-caption font-weight-light">
      <strong>ÖV Güteklasse:</strong> A,B,C
    </p>
    <p class="text-caption font-weight-light"><strong>Geometrie: </strong>Gebäude 25x45m</p>
    <p class="text-caption font-weight-light"><strong>Gebäudehöhe: </strong>25m (indikativ, basierend auf der max Höhe des 95% Percentils aller Gebäude in der gleichen Bauzone)</p>
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
p {
    line-height: 1.0;
    margin-top: 1px;
    margin-bottom: 1px;
  }
a {
  color: #42b983;
}
#info_board {
  height: 100%;
  width: 100%;
}
</style>
