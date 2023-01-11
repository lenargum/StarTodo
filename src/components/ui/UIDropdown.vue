<template>
  <div
    v-if="modelValue"
    :id="computedId"
    ref="dropdown"
    class="dropdown"
    tabindex="-1"
    @focusout="handleFocusOut"
    @keydown.esc="hideDropdown"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: "UIDropdown",
  props: {
    modelValue: {
      // is opened
      type: Boolean,
      required: true
    },
    uid: {
      type: [String, Number],
      required: true
    }
  },
  emits: ['update:modelValue'],
  computed: {
    computedId () {
      return `dropdown${this.uid}`
    }
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.focusDropdown()
        }
      }
    }
  },
  methods: {
    focusDropdown() {
      this.$nextTick(() => {
        this.$nextTick(() => {
          this.$refs.dropdown.focus()
        })
      })
    },
    handleFocusOut (event) {
      if (!event.relatedTarget || !event.relatedTarget.closest(`#${this.computedId}`)) {
        this.hideDropdown()
      }
    },
    hideDropdown() {
      this.$emit('update:modelValue', false)
    }
  }
}
</script>

<style scoped lang="scss">
.dropdown {
  position: absolute;
  top: 0;
  right: 100%;

  &:nth-child(3) {
    right: 50%;
  }

  display: flex;
  flex-direction: column;
  gap: var(--ui-dropdown-gap, 2px);

  padding: 8px;

  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  background: #FFFFFF;

  z-index: 1;
}
</style>