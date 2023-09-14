import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Post } from '../post.model';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PostValidators } from './mime-type.validator';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit,OnDestroy {
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview = null;
  private postId: string;
  private mode = 'create';
  subscription: Subscription;

  constructor(
    public postsService: PostsService,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.subscription = this.authService.getAuthStateListener().subscribe(() => {
      this.isLoading = false;
    })
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, {
        validators: [Validators.required],
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [PostValidators.mimeType],
      }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        const postId = paramMap.get('postId');
        this.postId = postId;
        this.isLoading = true;
        this.postsService.getPost(postId).subscribe((post) => {
          this.post = post;
          this.isLoading = false;
          this.form.setValue({
            title: post.title,
            content: post.content,
            image: post.imagePath,
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
        this.post = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSave() {
    const { title, content, image } = this.form.value;
    const post: Post = { title, content, image };

    this.isLoading = true;

    if (this.mode === 'create') {
      this.postsService.addPost(post);
    } else {
      this.postsService.updatePost({ id: this.postId, image, ...post });
    }
    this.form.reset();
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
}
