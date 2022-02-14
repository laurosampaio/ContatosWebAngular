import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Contato } from '@app/models/Contato';
import { ContatoService } from '@app/services/contato.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-contato-lista',
  templateUrl: './contato-lista.component.html',
  styleUrls: ['./contato-lista.component.scss'],
})
export class ContatoListaComponent implements OnInit {
  modalRef: BsModalRef;
  public contatos: Contato[] = [];
  public contatosFiltrados: Contato[] = [];
  public contatoId = 0;

  public larguraImagem = 40;
  public margemImagem = 2;
  public exibirImagem = true;
  private filtroListado = '';

  public get filtroLista(): string {
    return this.filtroListado;
  }

  public set filtroLista(value: string) {
    this.filtroListado = value;
    this.contatosFiltrados = this.filtroLista
      ? this.filtrarContatos(this.filtroLista)
      : this.contatos;
  }

  public filtrarContatos(filtrarPor: string): Contato[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.contatos.filter(
      (contato) =>
        contato.nome.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
        contato.sobrenome.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
        contato.telefone.indexOf(filtrarPor) !== -1
    );
  }

  constructor(
    private contatoService: ContatoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.spinner.show();
    this.carregarContatos();
  }

  public alterarImagem(): void {
    this.exibirImagem = !this.exibirImagem;
  }

  public mostraImagem(imagemURL: string): string {
    return imagemURL !== ''
      ? `${environment.apiURL}resources/images/${imagemURL}`
      : 'assets/img/contacts-icon.png';
  }

  public carregarContatos(): void {
    this.contatoService.getContatos().subscribe({
      next: (contatos: Contato[]) => {
        this.contatos = contatos;
        this.contatosFiltrados = this.contatos;
      },
      error: (error: any) => {
        this.spinner.hide();
        this.toastr.error('Erro ao Carregar os Contatos', 'Erro!');
      },
      complete: () => this.spinner.hide(),
    });
  }

  openModal(event: any, template: TemplateRef<any>, contatoId: number): void {
    event.stopPropagation();
    this.contatoId = contatoId;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.modalRef.hide();
    this.spinner.show();

    this.contatoService
      .deleteContato(this.contatoId)
      .subscribe(
        (result: any) => {
          if (result.message === 'Ok') {
            this.toastr.success(
              'O Contato foi excluido com Sucesso.',
              'Excluido!'
            );
            this.carregarContatos();
          }
        },
        (error: any) => {
          console.error(error);
          this.toastr.error(
            `Erro ao tentar excluir o contato ${this.contatoId}`,
            'Erro'
          );
        }
      )
      .add(() => this.spinner.hide());
  }

  decline(): void {
    this.modalRef.hide();
  }

  detalheContato(id: number): void {
    this.router.navigate([`contatos/detalhe/${id}`]);
  }
}
