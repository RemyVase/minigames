import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  validationCompte: boolean;
  isHidden: boolean = true;
  passwordError: boolean = true;

  constructor(public authService: AuthService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.signupForm = this.formBuilder.group({
      pseudo: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
      passwordConfirm: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    });
  }

  onSubmit() {
    //this.isHidden = false;
    const pseudo = this.signupForm.get('pseudo').value;
    const email = this.signupForm.get('email').value;
    const password = this.signupForm.get('password').value;
    const passwordConfirm = this.signupForm.get('passwordConfirm').value;

    if(password === passwordConfirm){
      this.passwordError = true;
      this.authService.addUser(pseudo, email, password);
    } else {
      this.passwordError = false;
    }
    

  }

}
