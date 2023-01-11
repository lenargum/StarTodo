<template>
  <button class="ui-dropdown-item">
    <slot />
  </button>
</template>

<style scoped lang="scss">
.ui-dropdown-item {
  padding: 8px;

  background: transparent;
  border: none;

  text-align: start;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background: #f2f2f2;
  }
}
</style>