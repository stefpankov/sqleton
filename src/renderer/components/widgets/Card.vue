<template>
  <div class="card">
    <header class="toolbar toolbar-header">
      <h1 class="title">
        <slot name="title"></slot>
      </h1>
    </header>
    <div class="card-body">
      <slot name="body"></slot>
    </div>
    <footer class="toolbar toolbar-footer">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<style>
.card {
  background: white;
  border-radius: 3px;
  border: 1px solid #cecece;
  width: 200px;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-right: 10px;
}
</style>

