import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter([
      { 
        path: '', 
        loadComponent: () => import('./app/components/task-list/task-list.component').then(m => m.TaskListComponent) 
      }
    ])
  ]
}).catch(err => console.error(err));