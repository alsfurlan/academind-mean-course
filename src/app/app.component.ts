import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  posts = [];

  onPostCreated(post) {
    this.posts = [...this.posts, post];
  }
}
