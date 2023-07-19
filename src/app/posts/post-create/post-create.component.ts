import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  post$: Observable<Post>;
  private postId: string;
  private mode = 'create';

  constructor(
    public postsService: PostsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        const postId = paramMap.get('postId');
        this.postId = postId;
        this.post$ = this.postsService.getPost(postId);
      } else {
        this.mode = 'create';
        this.postId = null;
        this.post$ = of({ id: null, title: '', content: '' });
      }
    });
  }

  onSave(form: NgForm) {
    const post: Post = {
      title: form.value.title,
      content: form.value.content,
    };
    if (this.mode === 'create') {
      this.postsService.addPost(post);
    } else {
      this.postsService.updatePost({ id: this.postId, ...post });
    }
    form.resetForm();
  }
}
