import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen bg-gray-50">
      <header class="bg-primary-700 text-white shadow-md">
        <div class="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 class="text-xl font-bold">Task Tracker</h1>
        </div>
      </header>
      
      <main>
        <router-outlet></router-outlet>
      </main>
      
      <footer class="bg-gray-100 border-t border-gray-200 mt-12">
        <div class="container mx-auto px-4 py-4 text-center text-gray-600 text-sm">
          &copy; 2025 Task Tracker App
        </div>
      </footer>
    </div>
  `
})
export class AppComponent {
  title = 'Task Tracker';
}