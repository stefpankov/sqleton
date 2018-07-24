<template>
  <div class="results-wrapper">
    <div class="results-table">
      <table v-if="fields.length > 0" class="table-striped">
        <thead>
          <tr>
            <th></th>
            <th v-for="field in prepared_fields" :key="field">{{ field }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in results" :key="`${index}${row[prepared_fields[0]]}`">
            <td>
              <input type="checkbox" :id="index" :value="index" v-model="selected_rows">
            </td>
            <td v-for="(field, index) in prepared_fields" :key="`${index}${field}`">
              {{ row[field] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table-actions">
      <span class="select-count">{{ selected_rows.length }} selected</span>

      <div class="btn-group" v-show="selected_rows.length > 0">
        <button class="btn btn-negative" title="Delete selected"
          @click="deleteSelected"
        >
          Delete
        </button>
      </div>

      <div style="clear:both"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Results',

  props: {
    fields: Array,
    results: Array
  },

  data () {
    return {
      selected_rows: []
    }
  },

  computed: {
    prepared_fields () {
      return this.fields.map(field => field.name)
    }
  },

  methods: {
    deleteSelected () {
      this.$emit('delete', this.selected_rows)
    }
  }
}
</script>

<style>
.results-table {
  overflow: auto;
  max-height: calc(100vh - 150px);
}

.select-count {
  float: left;
  margin: 3px 10px 0 0;
}

.table-actions {
  padding: 10px 10px 0;
}
</style>

