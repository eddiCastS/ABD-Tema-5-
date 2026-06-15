import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { Estudiante } from '../../models/estudiante.model';
import { EstudianteService } from '../../services/estudiante.service';

@Component({
  selector: 'app-estudiante-lista',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './estudiante-lista.html',
  styleUrl: './estudiante-lista.css'
})
export class EstudianteListaComponent implements OnInit {
  @Output() editar = new EventEmitter<Estudiante>();

  private estudianteService = inject(EstudianteService);

  estudiantes: Estudiante[] = [];
  cargando = false;
  errorConexion = false;
  filtro = '';

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.errorConexion = false;
    this.estudianteService.listarTodos().subscribe({
      next: (data) => {
        this.estudiantes = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.errorConexion = true;
      }
    });
  }

  get estudiantesFiltrados(): Estudiante[] {
    const texto = this.filtro.trim().toLowerCase();
    if (!texto) return this.estudiantes;
    return this.estudiantes.filter((e) =>
      e.nombreCompleto.toLowerCase().includes(texto) ||
      e.matricula.toLowerCase().includes(texto) ||
      e.carrera.toLowerCase().includes(texto) ||
      e.correo.toLowerCase().includes(texto)
    );
  }

  onEditar(estudiante: Estudiante): void {
    this.editar.emit(estudiante);
  }

  eliminar(estudiante: Estudiante): void {
    if (!estudiante.id) return;
    const confirmado = confirm(`Eliminar a "${estudiante.nombreCompleto}"? Esta accion no se puede deshacer.`);
    if (!confirmado) return;

    this.estudianteService.eliminar(estudiante.id).subscribe({
      next: () => this.cargar(),
      error: () => alert('No se pudo eliminar el estudiante.')
    });
  }

  exportarExcel(): void {
    const filas = this.estudiantesFiltrados.map((e) => ({
      ID: e.id,
      'Nombre completo': e.nombreCompleto,
      Edad: e.edad,
      Telefono: e.telefono,
      Correo: e.correo,
      Direccion: e.direccion ?? '',
      Matricula: e.matricula,
      Carrera: e.carrera,
      Semestre: e.semestre,
      'Fecha de registro': e.fechaRegistro ?? ''
    }));

    const hoja = XLSX.utils.json_to_sheet(filas);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Estudiantes');
    XLSX.writeFile(libro, 'estudiantes.xlsx');
  }
}
