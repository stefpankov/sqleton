<template>
  <header class="toolbar toolbar-header">
    <div class="toolbar-actions">
      <div class="btn-group">
        <button class="btn btn-default" title="Back to connections"
          @click="$emit('back')"
        >
          <span class="icon icon-left"></span>
        </button>
        <button class="btn btn-default" title="Refresh table data"
          @click="$emit('refresh')"
        >
          <span class="icon icon-cw"></span>
        </button>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Toolbar'
}
</script>

