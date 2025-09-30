import { TaskRepository } from "../infraestructure/task.repository";

export interface Task {
    id: string;
    title: string | null;
    description: string | null;
    projectId: string;
    columnId: string;
    inChargeUserId: string | null;
    status: 'pending' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'urgent' | null;
    dueDate: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export async function updateTask(task: Task) {
    const existingTask = await TaskRepository.getTaskById(task.id);

    if (!existingTask) {
        throw new Error('Task not found');
    }

    const updatedTask = await TaskRepository.updateTask(task);
    
    if (!updatedTask) {
        throw new Error('Failed to update task');
    }

    return updatedTask;
}