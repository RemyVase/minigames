import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  signinForm: FormGroup;
  validationFormulaire: boolean;
  isHidden: boolean = true;

  constructor(private formBuilder: FormBuilder, private router: Router, public authService: AuthService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.signinForm = this.formBuilder.group({
      pseudo: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    const pseudo = this.signinForm.get('pseudo').value;
    const password = this.signinForm.get('password').value;

    this.authService.connectUser(pseudo, password);
    
    /*
    if (this.authService.isAuth === true) {
      this.router.navigate(['mainmenu']);
      this.validationFormulaire = true;
      this.isHidden = false;
    } else {
      this.validationFormulaire = false;
      this.isHidden = false;
    }
*/
  }
}
