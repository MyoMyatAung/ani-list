import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tag, TagsService } from '../../services/tags';
import { CreatePostInput } from '../../services/posts';

@Component({
  selector: 'app-post-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-form.html',
  styleUrl: './post-form.css',
})
export class PostForm implements OnInit {

  postSubmitted = output<CreatePostInput>();

  postForm: FormGroup;
  availableTags = signal<Tag[]>([]);
  selectedTags = signal<Set<string>>(new Set());

  isEdit = input.required<boolean>();
  isLoading = input.required<boolean>();
  errorMessage = input.required<string | null>();
  successMessage = input.required<string | null>();

  private fb = inject(FormBuilder);
  private tagsService = inject(TagsService);

  constructor() {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    this.loadTags();
  }

  toggleTag(tagId: string): void {
    const tags = new Set(this.selectedTags());
    if (tags.has(tagId)) {
      tags.delete(tagId);
    } else {
      tags.add(tagId);
    }
    this.selectedTags.set(tags);
  }

  isTagSelected(tagId: string): boolean {
    return this.selectedTags().has(tagId);
  }

  loadTags(): void {
    this.tagsService.getAllTags().subscribe({
      next: (tags) => {
        this.availableTags.set(tags);
      },
      error: (error) => {
        console.error('Error loading tags:', error);
      },
    });
  }

  onSubmit(): void {
    if (this.postForm.valid && this.selectedTags().size > 0) {
      this.postForm.reset();
      this.selectedTags.set(new Set());
      this.postSubmitted.emit({ title: this.postForm.value.title, content: this.postForm.value.content, tagIds: Array.from(this.selectedTags()) });
    }
  }
}
