<template>
  <button class="ui-icon-button">
    <slot />
  </button>
</template>

<style scoped lang="scss">
.ui-icon-button {
  position: relative;
  
  padding: 0;

  background: transparent;
  border: none;
  color: white;

  line-height: 0;

  cursor: pointer;

  &:hover {
    background: transparent;
  }
}
</style>