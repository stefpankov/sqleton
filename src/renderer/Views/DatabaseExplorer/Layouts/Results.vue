<template>
  <div class="pane">
    <table v-if="fields.length > 0" class="table-striped">
      <thead>
        <tr>
          <th v-for="field in prepared_fields" :key="field">{{ field }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in results" :key="row[prepared_fields[0]]">
          <td v-for="field in prepared_fields" :key="field">
            {{ row[field] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
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

