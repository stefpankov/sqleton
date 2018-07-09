<template>
  <form @submit.prevent="$emit('submit', new_record)">
    <table class="table-striped" style="margin-bottom: 10px;">
      <thead>
        <tr>
          <th>Field</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="column in columns" :key="column.name">
          <td>{{ column.name }}</td>
          <td>
            <input type="text" v-model="new_record[column.name]">
          </td>
        </tr>
      </tbody>
    </table>

    <div class="form-group">
      <button type="button" class="btn btn-large btn-negative"
        @click="$emit('cancel')"
      >
        Cancel
      </button>

      <input type="submit" class="btn btn-large btn-positive pull-right" value="Save"
        :disabled="disable"
      >
    </div>
  </form>
</template>

<script>
export default {
  name: 'NewRecordForm',

  props: {
    columns: Array,
    disable: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      new_record: {}
    }
  },

  created () {
    this.columns.forEach(column => {
        this.new_record[column.name] = ''
      })
  }
}
</script>

<style scoped>
  .form-group {
    padding: 0 20px;
  }
</style>
