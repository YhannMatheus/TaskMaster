import { TaskRepository } from './../infraestructure/task.repository';

export async function deleteTask(taskId: string): Promise<boolean> {
    await TaskRepository.deleteTask(taskId);

    if (await TaskRepository.getTaskById(taskId)) {
        throw new Error("Task could not be deleted");
    }

    return true;
}