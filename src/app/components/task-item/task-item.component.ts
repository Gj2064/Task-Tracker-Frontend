import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card hover:shadow-lg transition-shadow duration-300" [ngClass]="{'border-l-4 border-green-500': task.completed}">
      <div *ngIf="!editing">
        <div class="flex justify-between items-start">
          <div class="flex items-start space-x-3">
            <input
                type="checkbox"
                [checked]="task.completed"
                (change)="toggleComplete()"
                class="mt-1 h-5 w-5 text-primary-600 rounded focus:ring-primary-500">
            <div>
              <h3 class="text-lg font-semibold" [ngClass]="{'line-through text-gray-500': task.completed}">
                {{ task.title }}
              </h3>
              <p class="text-gray-600 mt-1">{{ task.description }}</p>

              <div class="mt-2 text-sm text-gray-500 space-y-1" *ngIf="task.startedAt || task.endedAt">
                <p *ngIf="task.startedAt">Started: {{ formatDate(task.startedAt) }}</p>
                <p *ngIf="task.endedAt">Ended: {{ formatDate(task.endedAt) }}</p>
              </div>
            </div>
          </div>

          <div class="flex space-x-2">
            <button
                *ngIf="!task.startedAt && !task.completed"
                (click)="startTask()"
                class="btn btn-secondary text-sm">
              Start
            </button>
            <button
                *ngIf="task.startedAt && !task.endedAt && !task.completed"
                (click)="endTask()"
                class="btn btn-success text-sm">
              End
            </button>
            <button
                (click)="editing = true"
                class="btn btn-secondary text-sm">
              Edit
            </button>
            <button
                (click)="deleteTask()"
                class="btn btn-danger text-sm">
              Delete
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="editing" class="space-y-4">
        <div>
          <label for="title" class="form-label">Title</label>
          <input
              type="text"
              id="title"
              [(ngModel)]="editedTask.title"
              class="form-input">
        </div>

        <div>
          <label for="description" class="form-label">Description</label>
          <textarea
              id="description"
              [(ngModel)]="editedTask.description"
              class="form-input"
              rows="3"></textarea>
        </div>

        <div class="flex justify-end space-x-2">
          <button
              (click)="cancelEdit()"
              class="btn btn-secondary">
            Cancel
          </button>
          <button
              (click)="saveTask()"
              class="btn btn-primary">
            Save
          </button>
        </div>
      </div>
    </div>
  `
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() taskDeleted = new EventEmitter<string>();
  @Output() taskUpdated = new EventEmitter<Task>();
  @Output() taskStarted = new EventEmitter<string>();
  @Output() taskEnded = new EventEmitter<string>();

  editing = false;
  editedTask: Task = {
    title: '',
    description: '',
    completed: false
  };

  constructor(private taskService: TaskService) {}

  ngOnChanges(): void {
    this.editedTask = { ...this.task };
  }

  toggleComplete(): void {
    if (!this.task.id) return;

    this.taskService.markcompletedTask(this.task.id).subscribe({
      next: (updatedTask) => {
        this.taskUpdated.emit(updatedTask);
      },
      error: (error) => {
        console.error('Error marking task as completed', error);
      }
    });
  }

  deleteTask(): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskDeleted.emit(this.task.id);
    }
  }

  saveTask(): void {
    this.taskUpdated.emit(this.editedTask);
    this.editing = false;
  }

  cancelEdit(): void {
    this.editing = false;
    this.editedTask = { ...this.task };
  }

  startTask(): void {
    this.taskStarted.emit(this.task.id);
  }

  endTask(): void {
    this.taskEnded.emit(this.task.id);
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  }
}