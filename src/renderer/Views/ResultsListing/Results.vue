<template>
  <div class="results-table">
    <table v-if="fields.length > 0" class="table-striped">
      <thead>
        <tr>
          <th v-for="field in prepared_fields" :key="field">{{ field }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in results" :key="index + row[prepared_fields[0]]">
          <td v-for="(field, index) in prepared_fields" :key="index + field">
            {{ row[field] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'Results',

  props: {
    fields: Array,
    results: Array
  },

  computed: {
    prepared_fields () {
      return this.fields.map(field => field.name)
    }
  }
}
</script>

<style>
.results-table {
  overflow: auto;
  max-height: calc(100vh - 150px);
  border-bottom: 1px solid #ddd;
}
</style>

