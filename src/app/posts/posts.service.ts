import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post, PostResponse } from './post.model';
import { Observable, Subject, map, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsSubject = new Subject<Post[]>();
  posts$ = this.postsSubject.asObservable();
  private apiUrl = 'http://localhost:3000/api/posts/';

  constructor(private httpClient: HttpClient, private route: Router) {}

  getPosts() {
    this.httpClient
      .get<{ message: string; posts: PostResponse[] }>(this.apiUrl)
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
    let postData = new FormData();
    postData.set('title', post.title);
    postData.set('content', post.content);
    if (typeof post.image === 'object') {
      postData.set('image', post.image, post.title);
    }

    this.httpClient
      .post<{ message: string; post: Post }>(this.apiUrl, postData)
      .subscribe(({ post }) => {
        this.posts = [...this.posts, post];
        this.postsSubject.next([...this.posts]);
        this.route.navigate(['']);
      });
  }

  updatePost(updatedPost: Post) {
    let postData: FormData | Post;
    if (typeof updatedPost.image === 'string') {
      postData = {
        id: updatedPost.id,
        title: updatedPost.title,
        content: updatedPost.content,
        imagePath: updatedPost.image,
      };
    } else {
      postData = new FormData();
      postData.set('id', updatedPost.id);
      postData.set('title', updatedPost.title);
      postData.set('content', updatedPost.content);
      postData.set('image', updatedPost.image, updatedPost.title);
    }

    return this.httpClient
      .put<{ message: string; post: Post }>(
        this.apiUrl + updatedPost.id,
        postData
      )
      .subscribe(({ post }) => {
        const updatedPosts = [...this.posts];
        const index = this.posts.findIndex((p) => p.id === post.id);
        updatedPosts[index] = post;
        this.posts = updatedPosts;
        this.postsSubject.next([...this.posts]);
        this.route.navigate(['']);
      });
  }

  getPost(postId: string): Observable<Post> {
    const post = this.posts.find((post) => post.id === postId);
    return post
      ? of({ ...post })
      : this.httpClient.get<{ post: PostResponse }>(this.apiUrl + postId).pipe(
          map(({ post }) => {
            const { _id: id, ...props } = post;
            return { id, ...props };
          })
        );
  }

  deletePost(postId: string) {
    this.httpClient.delete(this.apiUrl + postId).subscribe(() => {
      const updatedPosts = this.posts.filter((post) => post.id !== postId);
      this.posts = updatedPosts;
      this.postsSubject.next(this.posts);
    });
  }
}
