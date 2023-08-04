import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Observable } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit {
  posts$: Observable<Post[]> = this.postsService.posts$;
  isLoading = true;
  totalPosts = 10;
  pageSize = 2;
  pageSizeOptions = [2, 5, 10, 25, 50];

  constructor(public postsService: PostsService) {}

  ngOnInit(): void {
    this.postsService.getPosts();
    this.isLoading = false;
    this.postsService.posts$.subscribe(() => {
      this.isLoading = false;
    })
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  onChangePage(pageData: PageEvent) {
    console.log(pageData);
  }
}
