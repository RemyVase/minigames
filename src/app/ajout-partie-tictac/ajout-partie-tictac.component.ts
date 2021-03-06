import { Component, OnInit, NgModule, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TicTacService } from '../service/tictac.service';

@Component({
  selector: 'app-ajout-partie-tictac',
  templateUrl: './ajout-partie-tictac.component.html',
  styleUrls: ['./ajout-partie-tictac.component.scss']
})

export class AjoutPartieTictacComponent implements OnInit {

  addTicTacForm: FormGroup;
  selectHidden: boolean = true;
  count: number = 0;

  constructor(private formBuilder: FormBuilder, private router: Router, public tictacService: TicTacService) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(){
    console.log('ON DESTROY DE AJOUT PARTIE TICTAC');
  }

  initForm() {
    this.addTicTacForm = this.formBuilder.group({
      nom: ['', Validators.required],
      passwordAsk: ['0',Validators.required],
      password: ['']
    });
  }

  onSubmit() {
    const nom = this.addTicTacForm.get('nom').value;
    const passwordAsk = this.addTicTacForm.get('passwordAsk').value;
    const password = this.addTicTacForm.get('password').value;
    this.tictacService.addTicTac(nom, password, passwordAsk);

  }

  checkSelect(value){
    //console.log(value);
    if(value == 0){
      this.selectHidden = true;
    } else if(value == 1){
      this.selectHidden = false;
    }
    console.log(this.selectHidden);
  }
}