import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsSubject = new Subject<Post[]>();
  posts$ = this.postsSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  getPosts() {
    this.httpClient.get<{ message: string; posts: Post[] }>(
      'http://localhost:3000/api/posts'
    ).subscribe(({posts}) => {
      this.posts = posts;
      this.postsSubject.next([...posts]);
    });
  }

  addPost(post: Post) {
    this.posts = [...this.posts, post];
    this.postsSubject.next(this.posts);
  }
}
