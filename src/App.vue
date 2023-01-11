<template>
  <div class="layout">
    <div class="bg">
      <div class="bg-circle bg-circle_top" />
      <div class="bg-circle bg-circle_bottom" />
    </div>

    <div class="layout-content">
      <TaskManager />
    </div>
  </div>
</template>

<script>

import {defineComponent} from "vue"
import TaskManager from "@/components/TaskManager.vue"

export default defineComponent({
  components: {TaskManager}
})
</script>

<style scoped lang="scss">

.layout {
  &-content {
    max-width: 1024px;
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 32px;
    margin: 0 auto;
    gap: 16px;
  }
}

.bg {
  position: absolute;
  z-index: -1;

  width: 100vw;
  height: 100vh;
  overflow: hidden;

  &-circle {
    position: absolute;
    border-radius: 50%;

    filter: blur(2px);
    animation: pulse 20s infinite;
    opacity: 0.3;

    &_top {
      top: min(-20vw, -150px);
      right: min(-20vw, -150px);

      width: max(40vw, 300px);
      height: max(40vw, 300px);

      background: #F9EA85;
    }

    &_bottom {
      bottom: min(-12vw, -100px);
      left: min(-12vw, -100px);

      width: max(30vw, 250px);
      height: max(30vw, 250px);

      background: #0075FF;
      animation-duration: 15s;
    }

    @keyframes pulse {
      0% {
        transform: scale(1);
      }

      50% {
        transform: scale(1.1);
      }

      100% {
        transform: scale(1);
      }
    }
  }
}

</style>
