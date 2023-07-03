import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsService {

  private posts: Post[] = [];
  private postsSubject = new Subject<Post[]>();
  posts$ = this.postsSubject.asObservable();

  getPosts(): Post[] {
    return [...this.posts]
  }

  addPost(post: Post) {
    this.posts = [...this.posts, post];
    this.postsSubject.next(this.posts);
  }


}
