import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { Subject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsSubject = new Subject<Post[]>();
  posts$ = this.postsSubject.asObservable();
  private apiUrl = 'http://localhost:3000/api/posts/';

  constructor(private httpClient: HttpClient) {}

  getPosts() {
    this.httpClient
      .get<{ message: string; posts: any }>(this.apiUrl)
      .pipe(
        map(({ posts }) =>
          posts.map(({ _id, ...post }) => ({ id: _id, ...post }))
        )
      )
      .subscribe((posts) => {
        this.posts = posts;
        this.postsSubject.next([...posts]);
      });
  }

  addPost(post: Post) {
    this.httpClient
      .post<{ message: string; postId: string }>(this.apiUrl, post)
      .subscribe(({ postId }) => {
        post.id = postId;
        this.posts = [...this.posts, post];
        this.postsSubject.next(this.posts);
      });
  }

  deletePost(postId: string) {
    this.httpClient.delete(this.apiUrl + postId).subscribe(() => {
      const updatedPosts = this.posts.filter((post) => post.id !== postId);
      this.posts = updatedPosts;
      this.postsSubject.next(this.posts);
    });
  }
}
