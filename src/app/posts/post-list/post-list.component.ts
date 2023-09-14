import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Observable, Subscription, map } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  totalPosts = 0;
  posts: Post[] = [];
  isLoading = true;
  currentPage = 0;
  postPerPage = 2;
  pageSizeOptions = [2, 5, 10, 25, 50];
  subscriptions = new Subscription();
  isAuthenticated: boolean;
  userId: string;

  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadPosts();
    this.isLoading = false;
    this.subscriptions.add(
      this.postsService.posts$.subscribe(({ posts, postCount }) => {
        this.posts = posts;
        this.totalPosts = postCount;
        this.isLoading = false;
      })
    );
    this.subscriptions.add(
      this.authService.getAuthStateListener().subscribe((isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      })
    );
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.loadPosts();
    }, () => {
      this.isLoading = false;
    });
  }

  onChangePage(pageData: PageEvent) {
    console.log(pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex;
    this.postPerPage = pageData.pageSize;
    this.loadPosts();
  }

  private loadPosts() {
    this.postsService.getPosts(this.currentPage, this.postPerPage);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
