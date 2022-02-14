import { Contato } from '../models/Contato';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '@environments/environment';

@Injectable()
export class ContatoService {
  baseURL = environment.apiURL + 'api/contatos';

  constructor(private http: HttpClient) {}

  public getContatos(): Observable<Contato[]> {
    return this.http.get<Contato[]>(this.baseURL).pipe(take(1));
  }

  public getContatoById(id: number): Observable<Contato> {
    return this.http.get<Contato>(`${this.baseURL}/${id}`).pipe(take(1));
  }

  public post(contato: Contato): Observable<Contato> {
    return this.http.post<Contato>(this.baseURL, contato).pipe(take(1));
  }

  public put(contato: Contato): Observable<Contato> {
    return this.http
      .put<Contato>(`${this.baseURL}/${contato.id}`, contato)
      .pipe(take(1));
  }

  public deleteContato(id: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/${id}`).pipe(take(1));
  }

  postUpload(contatoId: number, file: File): Observable<Contato> {
    const fileToUpload = file[0] as File;
    const formData = new FormData();
    formData.append('file', fileToUpload);

    return this.http
      .post<Contato>(`${this.baseURL}/upload-image/${contatoId}`, formData)
      .pipe(take(1));
  }
}
