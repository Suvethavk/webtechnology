import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes'; // Make sure this path is correct

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
});
