import { Component, inject, OnInit, signal } from '@angular/core';
import { UserList, Users as UsersService } from '../../services/users';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-users',
  imports: [RouterLink],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  private usersService = inject(UsersService);
  users = signal<UserList[]>([]);
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.usersService.getAllUsers().subscribe({
      next: (data) => {
        this.users.set(data.users);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.message || 'Failed to load users. Please try again.');
        this.isLoading.set(false);
      }
    });
  }
}
