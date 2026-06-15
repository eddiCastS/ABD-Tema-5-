package com.estudiantes.service.service;

import com.estudiantes.service.exception.RecursoNoEncontradoException;
import com.estudiantes.service.exception.ValidacionException;
import com.estudiantes.service.entity.Estudiante;
import com.estudiantes.service.repository.EstudianteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// IMPORTS PARA LOGS
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

// @Service le dice a Spring que esta clase contiene la lógica de negocio
@Service
public class EstudianteService {

    // LOGGER PARA REGISTRAR LOS LOGS DEL SERVICIO
    private static final Logger logger = LoggerFactory.getLogger(EstudianteService.class);

    // @Autowired inyecta automáticamente el repositorio
    @Autowired
    private EstudianteRepository estudianteRepository;

    // ----------------------------------------------------------
    // LISTAR TODOS LOS ESTUDIANTES
    // ----------------------------------------------------------
    public List<Estudiante> listarTodos() {
        logger.info("Consultando la lista de todos los estudiantes");
        return estudianteRepository.findAll();
    }

    // ----------------------------------------------------------
    // BUSCAR ESTUDIANTE POR ID
    // Si no existe, lanza una excepción personalizada
    // ----------------------------------------------------------
    public Estudiante buscarPorId(Long id) {
        logger.info("Buscando estudiante con ID: {}", id);

        return estudianteRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("No se encontró ningún estudiante con el ID: {}", id);
                    return new RecursoNoEncontradoException(
                            "No se encontró ningún estudiante con el ID: " + id);
                });
    }

    // ----------------------------------------------------------
    // BUSCAR POR NOMBRE
    // ----------------------------------------------------------
    public List<Estudiante> buscarPorNombre(String nombre) {
        logger.info("Buscando estudiantes por nombre: {}", nombre);
        return estudianteRepository.buscarPorNombre(nombre);
    }

    // ----------------------------------------------------------
    // BUSCAR POR CARRERA
    // ----------------------------------------------------------
    public List<Estudiante> buscarPorCarrera(String carrera) {
        logger.info("Buscando estudiantes por carrera: {}", carrera);
        return estudianteRepository.findByCarrera(carrera);
    }

    // ----------------------------------------------------------
    // REGISTRAR NUEVO ESTUDIANTE
    // @Transactional = si algo falla, se revierte todo
    // ----------------------------------------------------------
    @Transactional
    public Estudiante registrar(Estudiante estudiante) {
        logger.info("Intentando registrar un nuevo estudiante con matrícula: {}", estudiante.getMatricula());

        // Validar que el correo no esté ya registrado
        if (estudianteRepository.existsByCorreo(estudiante.getCorreo())) {
            logger.warn("No se pudo registrar. El correo ya existe: {}", estudiante.getCorreo());

            throw new ValidacionException(
                    "Ya existe un estudiante registrado con el correo: " + estudiante.getCorreo());
        }

        // Validar que la matrícula no esté ya registrada
        if (estudianteRepository.existsByMatricula(estudiante.getMatricula())) {
            logger.warn("No se pudo registrar. La matrícula ya existe: {}", estudiante.getMatricula());

            throw new ValidacionException(
                    "Ya existe un estudiante registrado con la matrícula: " + estudiante.getMatricula());
        }

        // Guardar en la BD y regresar el estudiante guardado
        Estudiante estudianteGuardado = estudianteRepository.save(estudiante);

        logger.info("Estudiante registrado correctamente con ID: {}", estudianteGuardado.getId());

        return estudianteGuardado;
    }

    // ----------------------------------------------------------
    // ACTUALIZAR ESTUDIANTE EXISTENTE
    // ----------------------------------------------------------
    @Transactional
    public Estudiante actualizar(Long id, Estudiante datosActualizados) {
        logger.info("Intentando actualizar el estudiante con ID: {}", id);

        // Verificar que el estudiante exista
        Estudiante estudianteExistente = buscarPorId(id);

        // Validar que el correo no lo use OTRO estudiante diferente
        if (estudianteRepository.existsByCorreoAndIdNot(datosActualizados.getCorreo(), id)) {
            logger.warn("No se pudo actualizar. El correo ya está en uso: {}", datosActualizados.getCorreo());

            throw new ValidacionException(
                    "El correo " + datosActualizados.getCorreo() + " ya está en uso por otro estudiante");
        }

        // Validar que la matrícula no la use OTRO estudiante diferente
        if (estudianteRepository.existsByMatriculaAndIdNot(datosActualizados.getMatricula(), id)) {
            logger.warn("No se pudo actualizar. La matrícula ya está en uso: {}", datosActualizados.getMatricula());

            throw new ValidacionException(
                    "La matrícula " + datosActualizados.getMatricula() + " ya está en uso por otro estudiante");
        }

        // Actualizar los campos con los nuevos datos
        estudianteExistente.setNombreCompleto(datosActualizados.getNombreCompleto());
        estudianteExistente.setEdad(datosActualizados.getEdad());
        estudianteExistente.setTelefono(datosActualizados.getTelefono());
        estudianteExistente.setCorreo(datosActualizados.getCorreo());
        estudianteExistente.setDireccion(datosActualizados.getDireccion());
        estudianteExistente.setMatricula(datosActualizados.getMatricula());
        estudianteExistente.setCarrera(datosActualizados.getCarrera());
        estudianteExistente.setSemestre(datosActualizados.getSemestre());

        Estudiante estudianteActualizado = estudianteRepository.save(estudianteExistente);

        logger.info("Estudiante actualizado correctamente con ID: {}", estudianteActualizado.getId());

        return estudianteActualizado;
    }

    // ----------------------------------------------------------
    // ELIMINAR ESTUDIANTE
    // ----------------------------------------------------------
    @Transactional
    public void eliminar(Long id) {
        logger.info("Intentando eliminar el estudiante con ID: {}", id);

        // Verificar que el estudiante exista antes de eliminar
        buscarPorId(id);

        estudianteRepository.deleteById(id);

        logger.info("Estudiante eliminado correctamente con ID: {}", id);
    }
}