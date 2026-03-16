import { Component, WritableSignal, Signal, signal, inject } from '@angular/core';
import { RouterLink} from "@angular/router";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class LoginComponent {
  hidePassword: WritableSignal<boolean> = signal(true);

  togglePassword() {
    this.hidePassword.update(value => !value);
  }

//teste usando ngModele
  loginUsuario = {
    email: '',
    senha: ''
  };

  private http = inject(HttpClient);

  fazerLogin() {
    console.log('Pegando os dados do form', this.loginUsuario);

    this.http.post('http://localhost/backend/src/java/', this.loginUsuario)
  }


}
