import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskItemComponent, TaskFormComponent],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Task Tracker</h1>
        <div class="flex space-x-2">
          <button 
            (click)="setFilter('all')" 
            class="btn" 
            [ngClass]="{'btn-primary': currentFilter === 'all', 'btn-secondary': currentFilter !== 'all'}">
            All
          </button>
          <button 
            (click)="setFilter('pending')" 
            class="btn" 
            [ngClass]="{'btn-primary': currentFilter === 'pending', 'btn-secondary': currentFilter !== 'pending'}">
            Pending
          </button>
          <button 
            (click)="setFilter('completed')" 
            class="btn" 
            [ngClass]="{'btn-primary': currentFilter === 'completed', 'btn-secondary': currentFilter !== 'completed'}">
            Completed
          </button>
          <button 
            (click)="setFilter('recent')" 
            class="btn" 
            [ngClass]="{'btn-primary': currentFilter === 'recent', 'btn-secondary': currentFilter !== 'recent'}">
            Recent
          </button>
        </div>
      </div>

      <div class="mb-8">
        <app-task-form (taskAdded)="onTaskAdded($event)"></app-task-form>
      </div>

      <div *ngIf="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>

      <div *ngIf="!loading && tasks.length === 0" class="text-center py-8">
        <p class="text-gray-500 text-lg">No tasks found. Create a new task to get started!</p>
      </div>

      <div *ngIf="!loading && tasks.length > 0" class="space-y-4">
        <app-task-item 
          *ngFor="let task of tasks" 
          [task]="task"
          (taskDeleted)="onTaskDeleted($event)"
          (taskUpdated)="onTaskUpdated($event)"
          (taskStarted)="onTaskStarted($event)"
          (taskEnded)="onTaskEnded($event)">
        </app-task-item>
      </div>
    </div>
  `
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  loading = true;
  currentFilter = 'all';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    
    let observable;
    
    switch (this.currentFilter) {
      case 'completed':
        observable = this.taskService.getCompletedTasks();
        break;
      case 'pending':
        observable = this.taskService.getPendingTasks();
        break;
      case 'recent':
        observable = this.taskService.getRecentTasks();
        break;
      default:
        observable = this.taskService.getAllTasks();
    }
    
    observable.subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tasks', error);
        this.loading = false;
      }
    });
  }

  setFilter(filter: string): void {
    this.currentFilter = filter;
    this.loadTasks();
  }

  onTaskAdded(task: Task): void {
    this.loadTasks();
  }

  onTaskDeleted(id: string): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task.id !== id);
      },
      error: (error) => console.error('Error deleting task', error)
    });
  }

  onTaskUpdated(updatedTask: Task): void {
    this.loadTasks();
  }

  onTaskStarted(id: string): void {
    this.taskService.startTask(id).subscribe({
      next: (updatedTask) => {
        this.tasks = this.tasks.map(task => 
          task.id === id ? updatedTask : task
        );
      },
      error: (error) => console.error('Error starting task', error)
    });
  }

  onTaskEnded(id: string): void {
    this.taskService.endTask(id).subscribe({
      next: (updatedTask) => {
        this.tasks = this.tasks.map(task => 
          task.id === id ? updatedTask : task
        );
      },
      error: (error) => console.error('Error ending task', error)
    });
  }
}