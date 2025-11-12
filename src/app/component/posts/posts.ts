import { Component, inject, OnInit, signal } from '@angular/core';
import { Post, Posts as PostsService } from '../../services/posts';
import { CreatePosts } from "../create-posts/create-posts";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-posts',
  imports: [CreatePosts, RouterLink],
  templateUrl: './posts.html',
  styleUrl: './posts.css',
})
export class Posts implements OnInit {
  private postService = inject(PostsService);
  errorMessage = signal<string | null>(null);
  posts = signal<Post[]>([]);
  isLoading = signal(false);
  
  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.isLoading.set(true);
    this.postService.getAllPosts().subscribe({
      next: (posts) => {
        this.posts.set(posts);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.message);
        this.isLoading.set(false);
      }
    });
  }

  onPostCreated(newPost: Post): void {
    // Add the new post to the beginning of the posts array
    this.posts.update(posts => [newPost, ...posts]);
  }
}
