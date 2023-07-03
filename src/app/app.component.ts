import { Component } from '@angular/core';
import { Post } from './posts/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  posts: Post[] = [];

  onPostCreated(post: Post) {
    this.posts = [...this.posts, post];
  }
}
