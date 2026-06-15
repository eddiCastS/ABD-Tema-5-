import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Estudiante, CARRERAS, SEMESTRES } from '../../models/estudiante.model';
import { EstudianteService } from '../../services/estudiante.service';

@Component({
  selector: 'app-estudiante-formulario',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './estudiante-formulario.html',
  styleUrl: './estudiante-formulario.css'
})
export class EstudianteFormularioComponent implements OnChanges {
  @Input() abierto = false;
  @Input() estudiante: Estudiante | null = null;

  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private estudianteService = inject(EstudianteService);

  carreras = CARRERAS;
  semestres = SEMESTRES;
  guardando = false;
  errorGeneral = '';

  form: FormGroup = this.fb.group({
    nombreCompleto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
    edad: [null, [Validators.required, Validators.min(1), Validators.max(120)]],
    telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    correo: ['', [Validators.required, Validators.email]],
    direccion: [''],
    matricula: ['', [Validators.required]],
    carrera: ['', [Validators.required]],
    semestre: [null, [Validators.required, Validators.min(1), Validators.max(12)]]
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['estudiante'] || changes['abierto']) {
      this.errorGeneral = '';
      if (this.estudiante) {
        this.form.reset({
          nombreCompleto: this.estudiante.nombreCompleto,
          edad: this.estudiante.edad,
          telefono: this.estudiante.telefono,
          correo: this.estudiante.correo,
          direccion: this.estudiante.direccion ?? '',
          matricula: this.estudiante.matricula,
          carrera: this.estudiante.carrera,
          semestre: this.estudiante.semestre
        });
      } else {
        this.form.reset({
          nombreCompleto: '',
          edad: null,
          telefono: '',
          correo: '',
          direccion: '',
          matricula: '',
          carrera: '',
          semestre: null
        });
      }
    }
  }

  get esEdicion(): boolean {
    return !!this.estudiante?.id;
  }

  campoInvalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.errorGeneral = '';
    const datos: Estudiante = this.form.value;

    const peticion = this.esEdicion
      ? this.estudianteService.actualizar(this.estudiante!.id!, datos)
      : this.estudianteService.registrar(datos);

    peticion.subscribe({
      next: () => {
        this.guardando = false;
        this.guardado.emit();
      },
      error: (err) => {
        this.guardando = false;
        this.errorGeneral = err?.error?.mensaje || 'Ocurrio un error al guardar el estudiante.';
      }
    });
  }

  onCerrar(): void {
    this.cerrar.emit();
  }
}
