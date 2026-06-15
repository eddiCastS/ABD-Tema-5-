import { Component, ViewChild } from '@angular/core';
import { EstudianteListaComponent } from './estudiantes/estudiante-lista/estudiante-lista';
import { EstudianteFormularioComponent } from './estudiantes/estudiante-formulario/estudiante-formulario';
import { Estudiante } from './models/estudiante.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [EstudianteListaComponent, EstudianteFormularioComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  @ViewChild(EstudianteListaComponent) lista!: EstudianteListaComponent;

  drawerAbierto = false;
  estudianteSeleccionado: Estudiante | null = null;

  abrirNuevo(): void {
    this.estudianteSeleccionado = null;
    this.drawerAbierto = true;
  }

  abrirEdicion(estudiante: Estudiante): void {
    this.estudianteSeleccionado = estudiante;
    this.drawerAbierto = true;
  }

  cerrarDrawer(): void {
    this.drawerAbierto = false;
  }

  onGuardado(): void {
    this.drawerAbierto = false;
    this.lista.cargar();
  }
}
