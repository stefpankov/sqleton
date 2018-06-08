<template>
  <div class="pagination">
    <div class="pagination-info">
      Showing {{ first_result }} to {{ last_result }} of {{ totalItems }}
    </div>
    <div class="btn-group">
      <button class="btn btn-default" @click="$emit('previous')">
        <span class="icon icon-left"></span>
      </button>

      <button v-for="number in page_numbers"
        :key="number"
        class="btn btn-default"
        :class="{ active: number === currentPage }"
        @click="$emit('go-to-page', number)"
      >
        {{ number }}
      </button>

      <button class="btn btn-default" @click="$emit('next')">
        <span class="icon icon-right"></span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pagination',

  props: {
    currentPage: Number,
    itemsPerPage: Number,
    totalItems: Number,
    totalPages: Number
  },

  computed: {
    page_numbers () {
      return Array.from({ length: this.totalPages }, (v, k) => k+1)
    },

    first_result () {
      return (this.currentPage - 1) * this.itemsPerPage + 1
    },

    last_result () {
      const number = this.currentPage * this.itemsPerPage
      return number > this.totalItems ? this.totalItems : number
    }
  }
}
</script>

<style>
.pagination {
  display: flex;
  justify-content: space-between;
  margin: 10px 10px 0;
}
</style>

