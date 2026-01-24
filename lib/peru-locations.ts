/**
 * Datos geográficos de Perú (Departamentos, Provincias y Distritos)
 * Fuente: INEI - Instituto Nacional de Estadística e Informática
 */

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

// Lista completa de departamentos del Perú
export const DEPARTAMENTOS: Departamento[] = [
    { id: "01", nombre: "Amazonas", codigo: "01" },
    { id: "02", nombre: "Áncash", codigo: "02" },
    { id: "03", nombre: "Apurímac", codigo: "03" },
    { id: "04", nombre: "Arequipa", codigo: "04" },
    { id: "05", nombre: "Ayacucho", codigo: "05" },
    { id: "06", nombre: "Cajamarca", codigo: "06" },
    { id: "07", nombre: "Callao", codigo: "07" },
    { id: "08", nombre: "Cusco", codigo: "08" },
    { id: "09", nombre: "Huancavelica", codigo: "09" },
    { id: "10", nombre: "Huánuco", codigo: "10" },
    { id: "11", nombre: "Ica", codigo: "11" },
    { id: "12", nombre: "Junín", codigo: "12" },
    { id: "13", nombre: "La Libertad", codigo: "13" },
    { id: "14", nombre: "Lambayeque", codigo: "14" },
    { id: "15", nombre: "Lima", codigo: "15" },
    { id: "16", nombre: "Loreto", codigo: "16" },
    { id: "17", nombre: "Madre de Dios", codigo: "17" },
    { id: "18", nombre: "Moquegua", codigo: "18" },
    { id: "19", nombre: "Pasco", codigo: "19" },
    { id: "20", nombre: "Piura", codigo: "20" },
    { id: "21", nombre: "Puno", codigo: "21" },
    { id: "22", nombre: "San Martín", codigo: "22" },
    { id: "23", nombre: "Tacna", codigo: "23" },
    { id: "24", nombre: "Tumbes", codigo: "24" },
    { id: "25", nombre: "Ucayali", codigo: "25" },
];

// Provincias del Perú (principales)
export const PROVINCIAS: Provincia[] = [
    // --- LIMA (15) ---
    { id: "1501", nombre: "Lima", codigo: "1501", departamento_id: "15" },
    { id: "1502", nombre: "Barranca", codigo: "1502", departamento_id: "15" },
    { id: "1503", nombre: "Cajatambo", codigo: "1503", departamento_id: "15" },
    { id: "1504", nombre: "Canta", codigo: "1504", departamento_id: "15" },
    { id: "1505", nombre: "Cañete", codigo: "1505", departamento_id: "15" },
    { id: "1506", nombre: "Huaral", codigo: "1506", departamento_id: "15" },
    { id: "1507", nombre: "Huarochirí", codigo: "1507", departamento_id: "15" },
    { id: "1508", nombre: "Huaura", codigo: "1508", departamento_id: "15" },
    { id: "1509", nombre: "Oyón", codigo: "1509", departamento_id: "15" },
    { id: "1510", nombre: "Yauyos", codigo: "1510", departamento_id: "15" },

    // --- AREQUIPA (04) ---
    { id: "0401", nombre: "Arequipa", codigo: "0401", departamento_id: "04" },
    { id: "0402", nombre: "Camaná", codigo: "0402", departamento_id: "04" },
    { id: "0403", nombre: "Caravelí", codigo: "0403", departamento_id: "04" },
    { id: "0404", nombre: "Castilla", codigo: "0404", departamento_id: "04" },
    { id: "0405", nombre: "Caylloma", codigo: "0405", departamento_id: "04" },
    { id: "0406", nombre: "Condesuyos", codigo: "0406", departamento_id: "04" },
    { id: "0407", nombre: "Islay", codigo: "0407", departamento_id: "04" },
    { id: "0408", nombre: "La Unión", codigo: "0408", departamento_id: "04" },

    // --- CUSCO (08) ---
    { id: "0801", nombre: "Cusco", codigo: "0801", departamento_id: "08" },
    { id: "0802", nombre: "Acomayo", codigo: "0802", departamento_id: "08" },
    { id: "0803", nombre: "Anta", codigo: "0803", departamento_id: "08" },
    { id: "0804", nombre: "Calca", codigo: "0804", departamento_id: "08" },
    { id: "0805", nombre: "Canas", codigo: "0805", departamento_id: "08" },
    { id: "0806", nombre: "Canchis", codigo: "0806", departamento_id: "08" },
    { id: "0807", nombre: "Chumbivilcas", codigo: "0807", departamento_id: "08" },
    { id: "0808", nombre: "Espinar", codigo: "0808", departamento_id: "08" },
    { id: "0809", nombre: "La Convención", codigo: "0809", departamento_id: "08" },
    { id: "0810", nombre: "Paruro", codigo: "0810", departamento_id: "08" },
    { id: "0811", nombre: "Paucartambo", codigo: "0811", departamento_id: "08" },
    { id: "0812", nombre: "Quispicanchi", codigo: "0812", departamento_id: "08" },
    { id: "0813", nombre: "Urubamba", codigo: "0813", departamento_id: "08" },

    // --- LA LIBERTAD (13) ---
    { id: "1301", nombre: "Trujillo", codigo: "1301", departamento_id: "13" },
    { id: "1302", nombre: "Ascope", codigo: "1302", departamento_id: "13" },
    { id: "1303", nombre: "Bolívar", codigo: "1303", departamento_id: "13" },
    { id: "1304", nombre: "Chepén", codigo: "1304", departamento_id: "13" },
    { id: "1305", nombre: "Julcán", codigo: "1305", departamento_id: "13" },
    { id: "1306", nombre: "Otuzco", codigo: "1306", departamento_id: "13" },
    { id: "1307", nombre: "Pacasmayo", codigo: "1307", departamento_id: "13" },
    { id: "1308", nombre: "Pataz", codigo: "1308", departamento_id: "13" },
    { id: "1309", nombre: "Sánchez Carrión", codigo: "1309", departamento_id: "13" },
    { id: "1310", nombre: "Santiago de Chuco", codigo: "1310", departamento_id: "13" },
    { id: "1311", nombre: "Gran Chimú", codigo: "1311", departamento_id: "13" },
    { id: "1312", nombre: "Virú", codigo: "1312", departamento_id: "13" },

    // --- PIURA (20) ---
    { id: "2001", nombre: "Piura", codigo: "2001", departamento_id: "20" },
    { id: "2002", nombre: "Ayabaca", codigo: "2002", departamento_id: "20" },
    { id: "2003", nombre: "Huancabamba", codigo: "2003", departamento_id: "20" },
    { id: "2004", nombre: "Morropón", codigo: "2004", departamento_id: "20" },
    { id: "2005", nombre: "Paita", codigo: "2005", departamento_id: "20" },
    { id: "2006", nombre: "Sullana", codigo: "2006", departamento_id: "20" },
    { id: "2007", nombre: "Talara", codigo: "2007", departamento_id: "20" },
    { id: "2008", nombre: "Sechura", codigo: "2008", departamento_id: "20" },

    // --- CALLAO (07) ---
    { id: "0701", nombre: "Callao", codigo: "0701", departamento_id: "07" },
];

// Distritos del Perú (principales de Lima, Callao, Arequipa, Cusco, Trujillo, Piura)
export const DISTRITOS: Distrito[] = [
    // --- LIMA METROPOLITANA (Provincia Lima 1501) ---
    { id: "150101", nombre: "Lima", codigo: "150101", provincia_id: "1501" },
    { id: "150102", nombre: "Ancón", codigo: "150102", provincia_id: "1501" },
    { id: "150103", nombre: "Ate", codigo: "150103", provincia_id: "1501" },
    { id: "150104", nombre: "Barranco", codigo: "150104", provincia_id: "1501" },
    { id: "150105", nombre: "Breña", codigo: "150105", provincia_id: "1501" },
    { id: "150106", nombre: "Carabayllo", codigo: "150106", provincia_id: "1501" },
    { id: "150107", nombre: "Chaclacayo", codigo: "150107", provincia_id: "1501" },
    { id: "150108", nombre: "Chorrillos", codigo: "150108", provincia_id: "1501" },
    { id: "150109", nombre: "Cieneguilla", codigo: "150109", provincia_id: "1501" },
    { id: "150110", nombre: "Comas", codigo: "150110", provincia_id: "1501" },
    { id: "150111", nombre: "El Agustino", codigo: "150111", provincia_id: "1501" },
    { id: "150112", nombre: "Independencia", codigo: "150112", provincia_id: "1501" },
    { id: "150113", nombre: "Jesús María", codigo: "150113", provincia_id: "1501" },
    { id: "150114", nombre: "La Molina", codigo: "150114", provincia_id: "1501" },
    { id: "150115", nombre: "La Victoria", codigo: "150115", provincia_id: "1501" },
    { id: "150116", nombre: "Lince", codigo: "150116", provincia_id: "1501" },
    { id: "150117", nombre: "Los Olivos", codigo: "150117", provincia_id: "1501" },
    { id: "150118", nombre: "Lurigancho", codigo: "150118", provincia_id: "1501" },
    { id: "150119", nombre: "Lurín", codigo: "150119", provincia_id: "1501" },
    { id: "150120", nombre: "Magdalena del Mar", codigo: "150120", provincia_id: "1501" },
    { id: "150121", nombre: "Miraflores", codigo: "150121", provincia_id: "1501" },
    { id: "150122", nombre: "Pachacámac", codigo: "150122", provincia_id: "1501" },
    { id: "150123", nombre: "Pucusana", codigo: "150123", provincia_id: "1501" },
    { id: "150124", nombre: "Pueblo Libre", codigo: "150124", provincia_id: "1501" },
    { id: "150125", nombre: "Puente Piedra", codigo: "150125", provincia_id: "1501" },
    { id: "150126", nombre: "Punta Hermosa", codigo: "150126", provincia_id: "1501" },
    { id: "150127", nombre: "Punta Negra", codigo: "150127", provincia_id: "1501" },
    { id: "150128", nombre: "Rímac", codigo: "150128", provincia_id: "1501" },
    { id: "150129", nombre: "San Bartolo", codigo: "150129", provincia_id: "1501" },
    { id: "150130", nombre: "San Borja", codigo: "150130", provincia_id: "1501" },
    { id: "150131", nombre: "San Isidro", codigo: "150131", provincia_id: "1501" },
    { id: "150132", nombre: "San Juan de Lurigancho", codigo: "150132", provincia_id: "1501" },
    { id: "150133", nombre: "San Juan de Miraflores", codigo: "150133", provincia_id: "1501" },
    { id: "150134", nombre: "San Luis", codigo: "150134", provincia_id: "1501" },
    { id: "150135", nombre: "San Martín de Porres", codigo: "150135", provincia_id: "1501" },
    { id: "150136", nombre: "San Miguel", codigo: "150136", provincia_id: "1501" },
    { id: "150137", nombre: "Santa Anita", codigo: "150137", provincia_id: "1501" },
    { id: "150138", nombre: "Santa María del Mar", codigo: "150138", provincia_id: "1501" },
    { id: "150139", nombre: "Santa Rosa", codigo: "150139", provincia_id: "1501" },
    { id: "150140", nombre: "Santiago de Surco", codigo: "150140", provincia_id: "1501" },
    { id: "150141", nombre: "Surquillo", codigo: "150141", provincia_id: "1501" },
    { id: "150142", nombre: "Villa El Salvador", codigo: "150142", provincia_id: "1501" },
    { id: "150143", nombre: "Villa María del Triunfo", codigo: "150143", provincia_id: "1501" },

    // --- AREQUIPA (Provincia Arequipa 0401) ---
    { id: "040101", nombre: "Arequipa", codigo: "040101", provincia_id: "0401" },
    { id: "040102", nombre: "Alto Selva Alegre", codigo: "040102", provincia_id: "0401" },
    { id: "040103", nombre: "Cayma", codigo: "040103", provincia_id: "0401" },
    { id: "040104", nombre: "Cerro Colorado", codigo: "040104", provincia_id: "0401" },
    { id: "040105", nombre: "Characato", codigo: "040105", provincia_id: "0401" },
    { id: "040106", nombre: "Chiguata", codigo: "040106", provincia_id: "0401" },
    { id: "040107", nombre: "Jacobo Hunter", codigo: "040107", provincia_id: "0401" },
    { id: "040108", nombre: "La Joya", codigo: "040108", provincia_id: "0401" },
    { id: "040109", nombre: "Mariano Melgar", codigo: "040109", provincia_id: "0401" },
    { id: "040110", nombre: "Miraflores", codigo: "040110", provincia_id: "0401" },
    { id: "040111", nombre: "Mollebaya", codigo: "040111", provincia_id: "0401" },
    { id: "040112", nombre: "Paucarpata", codigo: "040112", provincia_id: "0401" },
    { id: "040113", nombre: "Pocsi", codigo: "040113", provincia_id: "0401" },
    { id: "040114", nombre: "Polobaya", codigo: "040114", provincia_id: "0401" },
    { id: "040115", nombre: "Quequeña", codigo: "040115", provincia_id: "0401" },
    { id: "040116", nombre: "Sabandía", codigo: "040116", provincia_id: "0401" },
    { id: "040117", nombre: "Sachaca", codigo: "040117", provincia_id: "0401" },
    { id: "040118", nombre: "San Juan de Siguas", codigo: "040118", provincia_id: "0401" },
    { id: "040119", nombre: "San Juan de Tarucani", codigo: "040119", provincia_id: "0401" },
    { id: "040120", nombre: "Santa Isabel de Siguas", codigo: "040120", provincia_id: "0401" },
    { id: "040121", nombre: "Santa Rita de Siguas", codigo: "040121", provincia_id: "0401" },
    { id: "040122", nombre: "Socabaya", codigo: "040122", provincia_id: "0401" },
    { id: "040123", nombre: "Tiabaya", codigo: "040123", provincia_id: "0401" },
    { id: "040124", nombre: "Uchumayo", codigo: "040124", provincia_id: "0401" },
    { id: "040125", nombre: "Vitor", codigo: "040125", provincia_id: "0401" },
    { id: "040126", nombre: "Yanahuara", codigo: "040126", provincia_id: "0401" },
    { id: "040127", nombre: "Yarabamba", codigo: "040127", provincia_id: "0401" },
    { id: "040128", nombre: "Yura", codigo: "040128", provincia_id: "0401" },
    { id: "040129", nombre: "José Luis Bustamante y Rivero", codigo: "040129", provincia_id: "0401" },

    // --- CALLAO (Provincia Callao 0701) ---
    { id: "070101", nombre: "Callao", codigo: "070101", provincia_id: "0701" },
    { id: "070102", nombre: "Bellavista", codigo: "070102", provincia_id: "0701" },
    { id: "070103", nombre: "Carmen de la Legua Reynoso", codigo: "070103", provincia_id: "0701" },
    { id: "070104", nombre: "La Perla", codigo: "070104", provincia_id: "0701" },
    { id: "070105", nombre: "La Punta", codigo: "070105", provincia_id: "0701" },
    { id: "070106", nombre: "Ventanilla", codigo: "070106", provincia_id: "0701" },
    { id: "070107", nombre: "Mi Perú", codigo: "070107", provincia_id: "0701" },

    // --- CUSCO (Provincia Cusco 0801) ---
    { id: "080101", nombre: "Cusco", codigo: "080101", provincia_id: "0801" },
    { id: "080102", nombre: "Ccorca", codigo: "080102", provincia_id: "0801" },
    { id: "080103", nombre: "Poroy", codigo: "080103", provincia_id: "0801" },
    { id: "080104", nombre: "San Jerónimo", codigo: "080104", provincia_id: "0801" },
    { id: "080105", nombre: "San Sebastián", codigo: "080105", provincia_id: "0801" },
    { id: "080106", nombre: "Santiago", codigo: "080106", provincia_id: "0801" },
    { id: "080107", nombre: "Saylla", codigo: "080107", provincia_id: "0801" },
    { id: "080108", nombre: "Wanchaq", codigo: "080108", provincia_id: "0801" },

    // --- TRUJILLO (Provincia Trujillo 1301) ---
    { id: "130101", nombre: "Trujillo", codigo: "130101", provincia_id: "1301" },
    { id: "130102", nombre: "El Porvenir", codigo: "130102", provincia_id: "1301" },
    { id: "130103", nombre: "Florencia de Mora", codigo: "130103", provincia_id: "1301" },
    { id: "130104", nombre: "Huanchaco", codigo: "130104", provincia_id: "1301" },
    { id: "130105", nombre: "La Esperanza", codigo: "130105", provincia_id: "1301" },
    { id: "130106", nombre: "Laredo", codigo: "130106", provincia_id: "1301" },
    { id: "130107", nombre: "Moche", codigo: "130107", provincia_id: "1301" },
    { id: "130108", nombre: "Poroto", codigo: "130108", provincia_id: "1301" },
    { id: "130109", nombre: "Salaverry", codigo: "130109", provincia_id: "1301" },
    { id: "130110", nombre: "Simbal", codigo: "130110", provincia_id: "1301" },
    { id: "130111", nombre: "Victor Larco Herrera", codigo: "130111", provincia_id: "1301" },

    // --- PIURA (Provincia Piura 2001) ---
    { id: "200101", nombre: "Piura", codigo: "200101", provincia_id: "2001" },
    { id: "200102", nombre: "Castilla", codigo: "200102", provincia_id: "2001" },
    { id: "200103", nombre: "Catacaos", codigo: "200103", provincia_id: "2001" },
    { id: "200104", nombre: "Cura Mori", codigo: "200104", provincia_id: "2001" },
    { id: "200105", nombre: "El Tallán", codigo: "200105", provincia_id: "2001" },
    { id: "200106", nombre: "La Arena", codigo: "200106", provincia_id: "2001" },
    { id: "200107", nombre: "La Unión", codigo: "200107", provincia_id: "2001" },
    { id: "200108", nombre: "Las Lomas", codigo: "200108", provincia_id: "2001" },
    { id: "200109", nombre: "Tambo Grande", codigo: "200109", provincia_id: "2001" },
];

/**
 * Obtener todas las provincias de un departamento
 */
export function getProvinciasByDepartamento(departamentoId: string): Provincia[] {
    return PROVINCIAS.filter(p => p.departamento_id === departamentoId);
}

/**
 * Obtener todos los distritos de una provincia
 */
export function getDistritosByProvincia(provinciaId: string): Distrito[] {
    return DISTRITOS.filter(d => d.provincia_id === provinciaId);
}

/**
 * Obtener un departamento por ID
 */
export function getDepartamentoById(id: string): Departamento | undefined {
    return DEPARTAMENTOS.find(d => d.id === id);
}

/**
 * Obtener una provincia por ID
 */
export function getProvinciaById(id: string): Provincia | undefined {
    return PROVINCIAS.find(p => p.id === id);
}

/**
 * Obtener un distrito por ID
 */
export function getDistritoById(id: string): Distrito | undefined {
    return DISTRITOS.find(d => d.id === id);
}
