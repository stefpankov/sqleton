<template>
  <div class="pagination">
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
    totalPages: Number
  },

  computed: {
    page_numbers () {
      return Array.from({ length: this.totalPages }, (v, k) => k+1)
    }
  }
}
</script>
