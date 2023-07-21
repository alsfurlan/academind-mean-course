import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit {
  posts$: Observable<Post[]> = this.postsService.posts$;
  isLoading = true;

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
}
