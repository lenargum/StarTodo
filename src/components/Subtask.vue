<template>
  <div class="subtask">
    <div class="subtask__data">
      <input
        :id="`subtask${taskI}_${subtaskI}`"
        type="checkbox"
        class="subtask__data-checkmark"
        :checked="subtask.completed"
        @change="store.toggleSubtask(taskI, subtaskI)"
      >
      <label
        v-if="!editingName"
        :for="`subtask${taskI}_${subtaskI}`"
      >
        {{ subtask.name }}
      </label>
      <input
        v-else
        ref="nameInput"
        class="subtask__data-input"
        :value="subtask.name"
        type="text"
        @keydown.esc="cancelEditing"
        @blur="cancelEditing"
        @change="changeName"
      >
    </div>

    <div class="subtask__controls">
      <UIIconButton @click="startChangingName">
        <IconPen />
      </UIIconButton>
      <UIIconButton @click="deleteSubtask">
        <IconTrash />
      </UIIconButton>
    </div>
  </div>
</template>

<script>
import {useTasksStore} from "@/stores/task";
import IconTrash from "@/assets/icons/IconTrash.vue";
import IconPen from "@/assets/icons/IconPen.vue";
import UIIconButton from "@/components/ui/UIIconButton.vue";

export default {
  name: "Subtask",
  components: {UIIconButton, IconPen, IconTrash},
  props: {
    task: {
      type: Object,
      required: true
    },
    taskI: {
      type: Number,
      required: true
    },
    subtask: {
      type: Object,
      required: true
    },
    subtaskI: {
      type: Number,
      required: true
    }
  },
  setup: () => ({store: useTasksStore()}),
  data: () => ({
    editingName: false,
    confirmNeeded: true
  }),
  methods: {
    startChangingName(confirm = false) {
      this.editingName = true
      this.$nextTick(() => {
        this.$nextTick(() => {
          this.$refs.nameInput.focus()
        })
      })
      if (!confirm) {
        this.confirmNeeded = false
      }
    },
    cancelEditing() {
      if (!this.$refs.nameInput) return
      if (
          this.$refs.nameInput.value === this.subtask.name ||
          window.confirm('Отменить изменения?')
      ) {
        this.editingName = false
      }
    },
    changeName(event) {
      if (!this.editingName) return

      const newName = event.target.value
      if (
          !this.confirmNeeded ||
          (
              newName !== '' &&
              newName !== this.subtask.name &&
              window.confirm(`Изменить название на "${newName}"?`)
          )
      ) {
        this.store.changeSubtaskName(this.taskI, this.subtaskI, newName)
        this.confirmNeeded = true
      }
      this.editingName = false
    },
    deleteSubtask() {
      if (window.confirm(`Удалить подзадачу "${this.subtask.name}" ?`)) {
        this.store.deleteSubtask(this.taskI, this.subtaskI)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.subtask {
  display: flex;
  justify-content: space-between;
  gap: 8px;

  &__data {
    width: 80%;
    display: flex;
    gap: 8px;
    overflow: hidden;

    & label {
      overflow: hidden;
      overflow-wrap: break-word;
      cursor: pointer;
    }

    &-checkmark {
      width: 16px;
      height: 16px;

      flex-shrink: 0;
      cursor: pointer;
    }

    &-input {
      width: 100%;
      border: none;
      outline: none;
      padding: 0;
    }
  }

  &:hover &__controls,
  &:focus-within &__controls {
    display: flex;
  }

  &__controls {
    display: none;
    gap: 8px;

    & > * {
      opacity: 0.2;

      user-select: none;
      cursor: pointer;

      &:hover {
        opacity: 0.4;
      }
    }
  }
}
</style>