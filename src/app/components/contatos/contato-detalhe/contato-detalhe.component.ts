import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

import { ContatoService } from '@app/services/contato.service';
import { Contato } from '@app/models/Contato';
import { DatePipe } from '@angular/common';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-contato-detalhe',
  templateUrl: './contato-detalhe.component.html',
  styleUrls: ['./contato-detalhe.component.scss'],
  providers: [DatePipe],
})
export class ContatoDetalheComponent implements OnInit {
  modalRef: BsModalRef;
  contatoId: number;
  contato = {} as Contato;
  form: FormGroup;
  estadoSalvar = 'post';
  imagemURL = 'assets/img/contacts-icon.png';
  file: File;
  public larguraImagem = 170;
  public margemImagem = 10;

  get modoEditar(): boolean {
    return this.estadoSalvar === 'put';
  }

  get f(): any {
    return this.form.controls;
  }

  get bsConfig(): any {
    return {
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm a',
      containerClass: 'theme-default',
      showWeekNumbers: false,
    };
  }

  constructor(
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private activatedRouter: ActivatedRoute,
    private contatoService: ContatoService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.localeService.use('pt-br');
  }

  public carregarContato(): void {
    this.contatoId = +this.activatedRouter.snapshot.paramMap.get('id');

    if (this.contatoId !== null && this.contatoId !== 0) {
      this.spinner.show();

      this.estadoSalvar = 'put';

      this.contatoService
        .getContatoById(this.contatoId)
        .subscribe(
          (contato: Contato) => {
            this.contato = { ...contato };
            this.form.patchValue(this.contato);
            if (this.contato.imagemURL !== '') {
              this.imagemURL =
                environment.apiURL +
                'resources/images/' +
                this.contato.imagemURL;
            }
          },
          (error: any) => {
            this.toastr.error('Erro ao tentar carregar Contato.', 'Erro!');
            console.error(error);
          }
        )
        .add(() => this.spinner.hide());
    }
  }

  ngOnInit(): void {
    this.carregarContato();
    this.validation();
  }

  public validation(): void {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(4)]],
      sobrenome: [''],
      empresa: [''],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imagemURL: [''],
    });
  }
  public resetForm(): void {
    this.form.reset();
    this.router.navigate([`contatos/lista`]);
  }

  public cssValidator(campoForm: FormControl | AbstractControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }

  public salvarContato(): void {
    this.spinner.show();
    if (this.form.valid) {
      this.contato =
        this.estadoSalvar === 'post'
          ? { ...this.form.value }
          : { id: this.contato.id, ...this.form.value };

      this.contatoService[this.estadoSalvar](this.contato).subscribe(
        (contatoRetorno: Contato) => {
          this.toastr.success('Contato salvo com Sucesso!', 'Sucesso');
          this.router.navigate([`contatos/detalhe/${contatoRetorno.id}`]);
        },
        (error: any) => {
          console.error(error);
          this.spinner.hide();
          this.toastr.error('Error ao salvar contato', 'Erro');
        },
        () => this.spinner.hide()
      );
    }
  }

  onFileChange(ev: any): void {
    const reader = new FileReader();

    reader.onload = (event: any) => (this.imagemURL = event.target.result);

    this.file = ev.target.files;
    reader.readAsDataURL(this.file[0]);

    this.uploadImagem();
  }

  uploadImagem(): void {
    this.spinner.show();
    this.contatoService
      .postUpload(this.contatoId, this.file)
      .subscribe(
        () => {
          this.carregarContato();
          this.toastr.success('Imagem atualizada com Sucesso', 'Sucesso!');
        },
        (error: any) => {
          this.toastr.error('Erro ao fazer upload de imagem', 'Erro!');
          console.log(error);
        }
      )
      .add(() => this.spinner.hide());
  }
}
