export interface Estudiante {
  id?: number;
  nombreCompleto: string;
  edad: number;
  telefono: string;
  correo: string;
  direccion?: string;
  matricula: string;
  carrera: string;
  semestre: number;
  fechaRegistro?: string;
}

export const CARRERAS: string[] = [
  'Ingenieria en Sistemas',
  'Administracion de Empresas',
  'Contaduria Publica',
  'Ingenieria Civil',
  'Diseno Grafico',
  'Medicina',
  'Derecho',
  'Psicologia',
  'Educacion',
  'Enfermeria'
];

export const SEMESTRES: { value: number; label: string }[] = [
  { value: 1, label: '1er Semestre' },
  { value: 2, label: '2do Semestre' },
  { value: 3, label: '3er Semestre' },
  { value: 4, label: '4to Semestre' },
  { value: 5, label: '5to Semestre' },
  { value: 6, label: '6to Semestre' },
  { value: 7, label: '7mo Semestre' },
  { value: 8, label: '8vo Semestre' },
  { value: 9, label: '9no Semestre' },
  { value: 10, label: '10mo Semestre' },
  { value: 11, label: '11vo Semestre' },
  { value: 12, label: '12vo Semestre' }
];
