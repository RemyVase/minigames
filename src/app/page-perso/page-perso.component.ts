import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-perso',
  templateUrl: './page-perso.component.html',
  styleUrls: ['./page-perso.component.scss']
})
export class PagePersoComponent implements OnInit {

  passwordError: boolean = true;
  changePasswordForm: FormGroup;
  pseudo: String;
  email: String;

  formHidden: boolean = true;
  constructor(public authService: AuthService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.pseudo = localStorage.getItem('pseudoUser');
    this.email = localStorage.getItem('emailUser');
    this.authService.isHiddenErrorChange = true;
    this.initForm();
  }

  initForm() {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
      newPassword: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
      newPasswordConfirm: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    });
  }

  onSubmit() {
    const pseudo = this.pseudo;
    const newPassword = this.changePasswordForm.get('newPassword').value;
    const newPasswordConfirm = this.changePasswordForm.get('newPasswordConfirm').value;
    const oldPassword = this.changePasswordForm.get('oldPassword').value;

    if(newPassword === newPasswordConfirm){
      this.passwordError = true;
      this.authService.changePassword(pseudo, oldPassword, newPassword);
    } else {
      this.passwordError = false;
    }
  }

  pressFormView(){
    if(this.formHidden === true){
      this.formHidden = false;
    }else{
      this.formHidden = true;
    }
  }

}
