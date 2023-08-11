import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Observable, map } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit {
  totalPosts = 0;
  posts: Post[] = [];
  isLoading = true;
  currentPage = 0;
  postPerPage = 2;
  pageSizeOptions = [2, 5, 10, 25, 50];

  constructor(public postsService: PostsService) {}

  ngOnInit(): void {
    this.loadPosts();
    this.isLoading = false;
    this.postsService.posts$.subscribe(({ posts, postCount }) => {
      this.posts = posts;
      this.totalPosts = postCount;
      this.isLoading = false;
    });
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.loadPosts();
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
}
