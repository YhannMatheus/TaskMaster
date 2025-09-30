import { TaskRepository } from "../infraestructure/task.repository";

export async function getTask(taskId: string | null, taskTitle: string | null) {
    
    let task;
    
    if (!taskId && !taskTitle) {
        throw new Error("You must provide either a task ID or a task title.");
    }    

    if( taskId && taskTitle ) {
        throw new Error("You must provide only one of the two parameters: task ID or task title.");
    }

    if (taskId && taskTitle === null) {
        task = await TaskRepository.getTaskById(taskId);
    }

    if (taskTitle && taskId === null) {
        task = await TaskRepository.getTaskByTitle(taskTitle);
    }

    if (!task) {
        throw new Error("Task not found.");
    }

    return task;
}