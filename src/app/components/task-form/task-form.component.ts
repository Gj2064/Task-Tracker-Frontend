import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2 class="text-xl font-semibold mb-4">Add New Task</h2>
      
      <form (ngSubmit)="onSubmit()" #taskForm="ngForm" class="space-y-4">
        <div>
          <label for="title" class="form-label">Title</label>
          <input 
            type="text" 
            id="title" 
            name="title"
            [(ngModel)]="newTask.title" 
            required
            class="form-input"
            placeholder="Enter task title">
        </div>
        
        <div>
          <label for="description" class="form-label">Description</label>
          <textarea 
            id="description" 
            name="description"
            [(ngModel)]="newTask.description" 
            class="form-input" 
            rows="3"
            placeholder="Enter task description"></textarea>
        </div>
        
        <div class="flex justify-end">
          <button 
            type="submit" 
            class="btn btn-primary"
            [disabled]="!taskForm.form.valid || submitting">
            <span *ngIf="submitting" class="inline-block mr-2">
              <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            Add Task
          </button>
        </div>
      </form>
    </div>
  `
})
export class TaskFormComponent {
  @Output() taskAdded = new EventEmitter<Task>();
  
  newTask: Task = {
    title: '',
    description: '',
    completed: false
  };
  
  submitting = false;
  
  constructor(private taskService: TaskService) {}
  
  onSubmit(): void {
    if (!this.newTask.title.trim()) return;
    
    this.submitting = true;
    this.taskService.createTask(this.newTask).subscribe({
      next: (task) => {
        this.taskAdded.emit(task);
        this.resetForm();
        this.submitting = false;
      },
      error: (error) => {
        console.error('Error creating task', error);
        this.submitting = false;
      }
    });
  }
  
  resetForm(): void {
    this.newTask = {
      title: '',
      description: '',
      completed: false
    };
  }
}