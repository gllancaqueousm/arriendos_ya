import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactRecord, ContactResource } from '../models/contact.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactManagementService {
  private readonly http = inject(HttpClient);
  private readonly apiBasePath = environment.apiBasePath;

  listContacts(resource: ContactResource): Observable<ContactRecord[]> {
    return this.http.get<ContactRecord[]>(`${this.apiBasePath}/${resource}`);
  }

  createContact(resource: ContactResource, payload: ContactRecord): Observable<ContactRecord> {
    return this.http.post<ContactRecord>(`${this.apiBasePath}/${resource}`, payload);
  }

  updateContact(resource: ContactResource, rut: string, payload: ContactRecord): Observable<ContactRecord> {
    return this.http.put<ContactRecord>(`${this.apiBasePath}/${resource}/${rut}`, payload);
  }

  getContactByRut(resource: ContactResource, rut: string): Observable<ContactRecord> {
    return this.http.get<ContactRecord>(`${this.apiBasePath}/${resource}/${rut}`);
  }

  deleteContact(resource: ContactResource, rut: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBasePath}/${resource}/${rut}`);
  }
}
