import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContatosComponent } from './components/contatos/contatos.component';
import { ContatoDetalheComponent } from './components/contatos/contato-detalhe/contato-detalhe.component';
import { ContatoListaComponent } from './components/contatos/contato-lista/contato-lista.component';

const routes: Routes = [
  { path: 'contatos', redirectTo: 'contatos/lista' },
  {
    path: 'contatos',
    component: ContatosComponent,
    children: [
      { path: 'detalhe/:id', component: ContatoDetalheComponent },
      { path: 'detalhe', component: ContatoDetalheComponent },
      { path: 'lista', component: ContatoListaComponent },
    ],
  },
  { path: '', redirectTo: 'contatos/lista', pathMatch: 'full' },
  { path: '**', redirectTo: 'contatos/lista', pathMatch: 'full' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
