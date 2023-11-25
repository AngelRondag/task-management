import { DELETE_TASK, SET_POGRESS, SET_TASKS, REPEATED_TASK,SET_MESSAGE } from "./types";

export const setTasks = (payload, tasks) => {
    const repeatedTask = tasks.find(task => payload.title === task.title);

    if (!repeatedTask) {
        return {
            type: SET_TASKS,
            payload
        }
    } else {
        return {
            type: REPEATED_TASK,
        }
    }

}
export const setMessage = (payload) => ({
    type:SET_MESSAGE,
    payload
})

export const setPogress = (payload) => ({
    type: SET_POGRESS,
    payload
});

export const deleteTask = (payload) => ({
    type: DELETE_TASK,
    payload
})  