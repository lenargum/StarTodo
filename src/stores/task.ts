import {defineStore, acceptHMRUpdate} from 'pinia'
import initTasks from '../assets/initTasks'

const LS_KEY = 'starTodo'

export const useTasksStore = defineStore({
    id: 'tasks',
    state: () => ({
        tasks: [],
    }),
    actions: {
        saveTasks() {
            localStorage.setItem(LS_KEY, JSON.stringify(this.tasks))
        },
        loadTasks() {
            const save = JSON.parse(localStorage.getItem(LS_KEY))
            if (save) {
                this.tasks = save
            } else {
                this.tasks = [...initTasks]
                this.saveTasks()
            }
        },
        

        addTask(name) {
            this.tasks.unshift({
                name,
                completed: false,
                subtasks: [],
                timestamp: Date.now()
            })
            this.saveTasks()
        },
        toggleTask(taskI) {
            this.tasks[taskI].completed = !this.tasks[taskI].completed
            this.saveTasks()
        },
        changeName(taskI, name) {
            this.tasks[taskI].name = name
            this.saveTasks()
        },
        deleteTask(taskI) {
            this.tasks.splice(taskI, 1)
            this.saveTasks()
        },


        addSubtask(taskI, name) {
            this.tasks[taskI].subtasks.push({
                name,
                completed: false,
                timestamp: Date.now()
            })
            this.saveTasks()
        },
        toggleSubtask(taskI, subtaskI) {
            this.tasks[taskI].subtasks[subtaskI].completed = !this.tasks[taskI].subtasks[subtaskI].completed

            this.saveTasks()
        },
        changeSubtaskName(taskI, subtaskI, name) {
            this.tasks[taskI].subtasks[subtaskI].name = name
            this.saveTasks()
        },
        deleteSubtask(taskI, subtaskI) {
            this.tasks[taskI].subtasks.splice(subtaskI, 1)
            this.saveTasks()
        }
    },
})

// @ts-ignore
if (import.meta.hot) {
    // @ts-ignore
    import.meta.hot.accept(acceptHMRUpdate(useTasksStore, import.meta.hot))
}
