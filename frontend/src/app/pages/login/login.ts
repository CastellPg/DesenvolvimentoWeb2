import { Component, WritableSignal, Signal, signal } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  hidePassword: WritableSignal<boolean> = signal(true);

  togglePassword() {
    this.hidePassword.update(value => !value);
  }
}
