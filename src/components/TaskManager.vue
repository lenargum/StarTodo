<template>
  <header>
    <h1>{{ 'Todo-лист' }}</h1>
  </header>
  <button
    class="add-button"
    @click="addTask"
  >
    <h3>{{ 'Создать задачу' }}</h3>
  </button>
  <div class="tasks">
    <TransitionGroup name="list">
      <Task
        v-for="(task, taskI) in store.tasks"
        ref="task"
        :key="task.timestamp"
        :task="task"
        :task-i="taskI"
      />
    </TransitionGroup>
  </div>
</template>

<script>
import {useTasksStore} from "@/stores/task";
import Task from "@/components/Task.vue";

export default {
  name: "TaskManager",
  components: {Task},
  setup: () => ({store: useTasksStore()}),
  mounted() {
    this.store.loadTasks()
  },
  methods: {
    addTask() {
      this.store.addTask('Новая задача')
      this.$nextTick(() => {
        this.$nextTick(() => {
          if (this.$refs.task.length) {
            this.$refs.task[this.$refs.task.length - 1].startChangingName(false)
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/css/transitions.scss";

.tasks {
  position: relative;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.add-button {
  width: min(100%, 296px);

  @media (min-width: 420px) {
    width: 70vw;
  }

  @media (min-width: 1000px) {
    width: 40vw;
  }

  padding: 12px;

  background: #F9EA85;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  border: none;

  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 14px 4px rgba(0, 0, 0, 0.25);
  }
}
</style>