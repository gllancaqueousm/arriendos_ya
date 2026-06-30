import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { EventoRecord } from '../models/evento.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private readonly http = inject(HttpClient);
  private readonly apiBasePath = `${environment.apiBasePath}/eventos`;

  getEventosByPropiedad(propiedadId: number): Observable<EventoRecord[]> {
    return this.http.get<EventoRecord[]>(`${this.apiBasePath}/propiedad/${propiedadId}`);
  }

  createEvento(evento: Omit<EventoRecord, 'id'>): Observable<EventoRecord> {
    return this.http.post<EventoRecord>(this.apiBasePath, evento);
  }
}
