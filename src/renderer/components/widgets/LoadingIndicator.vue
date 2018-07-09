<template functional>
  <div class="loader-wrapper">
    <div class="loader"></div>
  </div>
</template>

<style>
.loader-wrapper {
  position: fixed;
  width: 100%;
  height: 5px;
  z-index: 3;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.loader {
  width: 100%;
  height: 100%;
  background: linear-gradient(to left, #d92ace, #21c9ae);
  background-size: 600% 600%;

  animation: loading 4s ease infinite;
}

@keyframes loading {
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
}
</style>

