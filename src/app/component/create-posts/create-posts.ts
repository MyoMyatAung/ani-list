import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Posts as PostsService, CreatePostInput, Post } from '../../services/posts';
import { PostForm } from "../post-form/post-form";

@Component({
  selector: 'app-create-posts',
  imports: [CommonModule, PostForm],
  templateUrl: './create-posts.html',
  styleUrl: './create-posts.css',
})
export class CreatePosts {

  postCreated = output<Post>();
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  private postsService = inject(PostsService);

  onPostSubmitted(createPostInput: CreatePostInput) {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);
    console.log('Create Post Input:', createPostInput);
    this.postsService.createPost(createPostInput).subscribe({
      next: (post) => {
        this.isLoading.set(false);
        this.successMessage.set('Post created successfully!');
        this.postCreated.emit(post);
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage.set(null);
        }, 3000);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'Failed to create post. Please try again.');
      }
    });
  }
}
