import { directus } from './directus';
import { readItems } from '@directus/sdk';

export interface Departamento {
    id: string;
    nombre: string;
    codigo: string;
}

export interface Provincia {
    id: string;
    nombre: string;
    codigo: string;
    departamento_id: string;
}

export interface Distrito {
    id: string;
    nombre: string;
    codigo: string;
    provincia_id: string;
}

/**
 * Obtener todos los departamentos de Perú
 */
export async function getDepartamentos(): Promise<Departamento[]> {
    try {
        const departamentos = await directus.request(
            readItems('departamentos_peru', {
                fields: ['id', 'nombre', 'codigo'],
                sort: ['nombre'],
                limit: -1,
            })
        );
        return departamentos as Departamento[];
    } catch (error) {
        console.error('Error al obtener departamentos:', error);
        throw error;
    }
}

/**
 * Obtener provincias por departamento ID
 */
export async function getProvinciasByDepartamento(departamentoId: string): Promise<Provincia[]> {
    try {
        const provincias = await directus.request(
            readItems('provincias_peru', {
                fields: ['id', 'nombre', 'codigo', 'departamento_id'],
                filter: {
                    departamento_id: {
                        _eq: departamentoId,
                    },
                },
                sort: ['nombre'],
                limit: -1,
            })
        );
        return provincias as Provincia[];
    } catch (error) {
        console.error('Error al obtener provincias:', error);
        throw error;
    }
}

/**
 * Obtener distritos por provincia ID
 */
export async function getDistritosByProvincia(provinciaId: string): Promise<Distrito[]> {
    try {
        const distritos = await directus.request(
            readItems('distritos_peru', {
                fields: ['id', 'nombre', 'codigo', 'provincia_id'],
                filter: {
                    provincia_id: {
                        _eq: provinciaId,
                    },
                },
                sort: ['nombre'],
                limit: -1,
            })
        );
        return distritos as Distrito[];
    } catch (error) {
        console.error('Error al obtener distritos:', error);
        throw error;
    }
}

/**
 * Obtener un departamento por ID
 */
export async function getDepartamentoById(id: string): Promise<Departamento | null> {
    try {
        const departamento = await directus.request(
            readItems('departamentos_peru', {
                fields: ['id', 'nombre', 'codigo'],
                filter: {
                    id: {
                        _eq: id,
                    },
                },
            })
        );
        return (departamento as Departamento[])[0] || null;
    } catch (error) {
        console.error('Error al obtener departamento:', error);
        return null;
    }
}

/**
 * Obtener una provincia por ID
 */
export async function getProvinciaById(id: string): Promise<Provincia | null> {
    try {
        const provincia = await directus.request(
            readItems('provincias_peru', {
                fields: ['id', 'nombre', 'codigo', 'departamento_id'],
                filter: {
                    id: {
                        _eq: id,
                    },
                },
            })
        );
        return (provincia as Provincia[])[0] || null;
    } catch (error) {
        console.error('Error al obtener provincia:', error);
        return null;
    }
}

/**
 * Obtener un distrito por ID
 */
export async function getDistritoById(id: string): Promise<Distrito | null> {
    try {
        const distrito = await directus.request(
            readItems('distritos_peru', {
                fields: ['id', 'nombre', 'codigo', 'provincia_id'],
                filter: {
                    id: {
                        _eq: id,
                    },
                },
            })
        );
        return (distrito as Distrito[])[0] || null;
    } catch (error) {
        console.error('Error al obtener distrito:', error);
        return null;
    }
}
