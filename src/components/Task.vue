<template>
  <div class="task">
    <div class="task__wrapper">
      <div class="task__content">
        <input
          class="task__checkmark"
          type="checkbox"
          :checked="task.completed"
          @change="store.toggleTask(taskI)"
        >
        <div
          v-if="!editingName"
          class="task__data"
          @click="toggleAccordion"
        >
          <span class="task__data-title">{{ task.name }}</span>
          <span
            v-if="task.subtasks.length"
            class="task__data-subtitle"
          >{{ subtitle }}</span>
        </div>
        <input
          v-else
          ref="nameInput"
          class="task__data-title task__data-title-input"
          type="text"
          :value="task.name"
          @keydown.esc="cancelEditing"
          @blur="cancelEditing"
          @change="changeName"
        >
      </div>

      <div class="task__controls">
        <UIIconButton
          v-if="task.subtasks.length"
          @click="toggleAccordion"
        >
          <IconChevron
            :class="[
              'task__controls-subtasks',
              {'task__controls-subtasks_active': subtasksOpened}
            ]"
          />
        </UIIconButton>

        <UIIconButton @click="controlsOpened = !controlsOpened">
          <Icon3Dots />
        </UIIconButton>

        <UIDropdown
          v-model="controlsOpened"
          :uid="task.timestamp"
        >
          <UIDropdownItem @click="addSubtask">
            {{ 'Добавить подзадачу' }}
          </UIDropdownItem>
          <UIDropdownItem @click="startChangingName">
            {{ 'Переименовать' }}
          </UIDropdownItem>
          <UIDropdownItem @click="deleteTask">
            {{ 'Удалить' }}
          </UIDropdownItem>
        </UIDropdown>
      </div>
    </div>


    <div
      v-if="subtasksOpened"
      class="subtasks"
    >
      <TransitionGroup name="list">
        <Subtask
          v-for="(subtask, subtaskI) in task.subtasks"
          ref="subtasks"
          :key="subtask.timestamp"
          :subtask="subtask"
          :subtask-i="subtaskI"
          :task-i="taskI"
          :task="task"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script>
import {useTasksStore} from "@/stores/task";
import Subtask from "@/components/Subtask.vue";
import IconChevron from "@/assets/icons/IconChevron.vue";
import Icon3Dots from "@/assets/icons/Icon3Dots.vue";
import UIIconButton from "@/components/ui/UIIconButton.vue";
import UIDropdown from "@/components/ui/UIDropdown.vue";
import UIDropdownItem from "@/components/ui/UIDropdownItem.vue";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Task",
  components: {UIDropdownItem, UIDropdown, UIIconButton, Icon3Dots, IconChevron, Subtask},
  props: {
    task: {
      type: Object,
      required: true
    },
    taskI: {
      type: Number,
      required: true
    }
  },
  setup: () => ({store: useTasksStore()}),
  data: () => ({
    controlsOpened: false,
    subtasksOpened: false,
    editingName: false,
    confirmNeeded: true
  }),
  computed: {
    subtitle() {
      if (this.task.subtasks.length % 10 === 1) {
        return this.task.subtasks.length + ' подзадача'
      } else if (this.task.subtasks.length % 10 > 1 && this.task.subtasks.length < 5) {
        return this.task.subtasks.length + ' подзадачи'
      } else {
        return this.task.subtasks.length + ' подзадач'
      }
    }
  },
  watch: {
    'task.subtasks.length': {
      handler (newValue) {
        if (newValue === 0) {
          this.subtasksOpened = false
        }
      }
    }
  },
  methods: {
    addSubtask () {
      this.store.addSubtask(this.taskI, 'Новая подзадача')
      this.subtasksOpened = true
      this.controlsOpened = false
      this.$nextTick(() => {
        this.$nextTick(() => {
          if (this.$refs.subtasks.length) {
            this.$refs.subtasks[this.$refs.subtasks.length - 1].startChangingName(false)
          }
        })
      })
    },
    deleteTask () {
      if (window.confirm(`Удалить подзадачу "${this.task.name}" ?`)) {
        this.store.deleteTask(this.taskI)
      }
      this.controlsOpened = false
    },
    startChangingName (confirm = false) {
      this.controlsOpened = false
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
          this.$refs.nameInput.value === this.task.name ||
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
              newName !== this.task.name &&
              window.confirm(`Изменить название на "${newName}"?`)
          )
      ) {
        this.store.changeName(this.taskI, newName)
        this.confirmNeeded = true
      }
      this.editingName = false
    },
    toggleAccordion () {
      if (this.task.subtasks.length) {
        this.subtasksOpened = !this.subtasksOpened
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/css/transitions.scss";

.task {
  width: min(100%, 296px);

  @media (min-width: 420px) {
    width: 70vw;
  }

  @media (min-width: 1000px) {
    width: 40vw;
  }

  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 12px;

  background: #FFFFFF;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  border-radius: 8px;

  &__wrapper {
    display: flex;
    justify-content: space-between;
    max-width: 100%;
  }

  &__content {
    max-width: 80%;

    display: flex;
    flex-grow: 1;
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  &__checkmark {
    width: 20px;
    height: 20px;

    flex-shrink: 0;

    &:checked {
      background: #F9EA85;
    }
    cursor: pointer;
  }

  &__data {
    max-width: 80%;

    display: flex;
    flex-grow: 1;
    flex-direction: column;
    align-items: flex-start;
    padding: 0;
    gap: 2px;

    cursor: pointer;

    &-title {
      max-width: 100%;

      font-weight: 600;
      font-size: 16px;
      line-height: 16px;

      color: #363635;

      overflow: hidden;
      overflow-wrap: break-word;

      &-input {
        width: 100%;
        border: none;
        outline: none;
        padding: 0 4px 0 0;
      }
    }

    &-subtitle {
      font-weight: 400;
      font-size: 10px;
      line-height: 12px;

      color: #9A9A9A;
    }
  }

  &__controls {
    position: relative;

    justify-self: flex-end;

    display: flex;
    flex-direction: row;
    align-items: center;
    flex-shrink: 0;

    gap: 4px;

    & > .ui-icon-button {
      opacity: 0.4;
      user-select: none;

      &:hover {
        opacity: 0.6;
      }
    }

    &-subtasks {
      transition: transform 0.1s ease-in-out;
      &_active {
        transform: rotate(180deg);
      }
    }
  }

  .subtasks {
    position: relative;
  }
}




</style>