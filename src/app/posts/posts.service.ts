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
  private apiUrl = 'http://localhost:3000/api/posts';

  constructor(private httpClient: HttpClient) {}

  getPosts() {
    this.httpClient
      .get<{ message: string; posts: Post[] }>(this.apiUrl)
      .subscribe(({ posts }) => {
        this.posts = posts;
        this.postsSubject.next([...posts]);
      });
  }

  addPost(post: Post) {
    this.httpClient.post<{ message: string }>(this.apiUrl, post).subscribe((response) => {
      console.log(response);
      this.posts = [...this.posts, post];
      this.postsSubject.next(this.posts);
    })

  }
}
