import { UserNotFoundError } from "@/core/errors/user-not-found-error";
import { TaskRepository, Task } from "../infraestructure/task.repository";
import { UserRepository } from "@/users/infrastructure/user.repositori";
import { InvalidTaskDataError } from "@/core/errors/invalid-tasks-data-error";

export async function createTask(taskData: Task): Promise<Task> {
    if (!taskData.title || !taskData.projectId || !taskData.columnId) {
        throw new InvalidTaskDataError()
    }

    if (taskData.inChargeUserId) {
        const user = await UserRepository.findByid(taskData.inChargeUserId);
        
        if (!user) {
            throw new UserNotFoundError();
        }
    }

    const newTask = await TaskRepository.createTask(taskData);
    return newTask;
}