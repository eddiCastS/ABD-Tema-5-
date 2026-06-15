import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estudiante } from '../models/estudiante.model';

// Ruta relativa: en desarrollo la resuelve proxy.conf.json (-> localhost:8080),
// en produccion la resuelve Nginx con su bloque "location /api/".
const API_URL = '/api/estudiantes';

@Injectable({ providedIn: 'root' })
export class EstudianteService {
  private http = inject(HttpClient);

  listarTodos(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(API_URL);
  }

  buscarPorId(id: number): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${API_URL}/${id}`);
  }

  buscarPorNombre(nombre: string): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(`${API_URL}/buscar`, {
      params: { nombre }
    });
  }

  buscarPorCarrera(carrera: string): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(`${API_URL}/carrera/${carrera}`);
  }

  registrar(estudiante: Estudiante): Observable<Estudiante> {
    return this.http.post<Estudiante>(API_URL, estudiante);
  }

  actualizar(id: number, estudiante: Estudiante): Observable<Estudiante> {
    return this.http.put<Estudiante>(`${API_URL}/${id}`, estudiante);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
