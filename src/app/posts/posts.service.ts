import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Post, PostResponse } from './post.model';
import { Observable, Subject, map, of } from 'rxjs';
import { Router } from '@angular/router';

const BACKEND_URL = 'http://localhost:3000/api/posts/';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsSubject = new Subject<{ posts: Post[]; postCount: number }>();
  posts$ = this.postsSubject.asObservable();

  constructor(private httpClient: HttpClient, private route: Router) {}

  getPosts(currentPage: number, postsPerPage: number) {
    let params = new HttpParams();
    params = params.append('page', currentPage);
    params = params.append('pagesize', postsPerPage);
    this.httpClient
      .get<{ message: string; posts: PostResponse[]; maxPosts: number }>(
        BACKEND_URL,
        { params }
      )
      .pipe(
        map(({ posts, maxPosts }) => ({
          maxPosts,
          posts: posts.map(({ _id, ...post }) => ({ id: _id, ...post })),
        }))
      )
      .subscribe(({ posts, maxPosts: postCount }) => {
        this.posts = posts;
        this.postsSubject.next({ posts: [...posts], postCount });
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
      .post<{ message: string; post: Post }>(BACKEND_URL, postData)
      .subscribe(({ post }) => {
        this.route.navigate(['/']);
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
        creator: updatedPost.creator,
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
        BACKEND_URL + updatedPost.id,
        postData
      )
      .subscribe(({ post }) => {
        this.route.navigate(['/']);
      });
  }

  getPost(postId: string): Observable<Post> {
    const post = this.posts.find((post) => post.id === postId);
    return post
      ? of({ ...post })
      : this.httpClient.get<{ post: PostResponse }>(BACKEND_URL + postId).pipe(
          map(({ post }) => {
            const { _id: id, ...props } = post;
            return { id, ...props };
          })
        );
  }

  deletePost(postId: string) {
    return this.httpClient.delete(BACKEND_URL + postId);
  }
}
