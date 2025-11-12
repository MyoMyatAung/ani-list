import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Users, User } from '../../services/users';

@Component({
  selector: 'app-user-detail',
  imports: [CommonModule],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.css'
})
export class UserDetail implements OnInit {
  user = signal<User | null>(null);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private usersService = inject(Users);

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.loadUser(userId);
    } else {
      this.errorMessage.set('User ID is required');
    }
  }

  loadUser(id: string): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.usersService.getUserById(id).subscribe({
      next: (response) => {
        this.user.set(response.getUser);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.message || 'Failed to load user');
        this.isLoading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}
