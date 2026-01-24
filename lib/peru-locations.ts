/**
 * Datos geográficos completos de Perú (Departamentos, Provincias y Distritos)
 * Fuente: INEI - Instituto Nacional de Estadística e Informática
 * Generado automáticamente - 2026-01-24T17:41:30.821Z
 * 
 * Total:
 * - 25 Departamentos
 * - 196 Provincias
 * - 1892 Distritos
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

// ========================================
// DEPARTAMENTOS (25)
// ========================================
export const DEPARTAMENTOS: Departamento[] = [
    {
        "id": "01",
        "nombre": "AMAZONAS",
        "codigo": "01"
    },
    {
        "id": "02",
        "nombre": "ANCASH",
        "codigo": "02"
    },
    {
        "id": "03",
        "nombre": "APURIMAC",
        "codigo": "03"
    },
    {
        "id": "04",
        "nombre": "AREQUIPA",
        "codigo": "04"
    },
    {
        "id": "05",
        "nombre": "AYACUCHO",
        "codigo": "05"
    },
    {
        "id": "06",
        "nombre": "CAJAMARCA",
        "codigo": "06"
    },
    {
        "id": "07",
        "nombre": "CALLAO",
        "codigo": "07"
    },
    {
        "id": "08",
        "nombre": "CUSCO",
        "codigo": "08"
    },
    {
        "id": "09",
        "nombre": "HUANCAVELICA",
        "codigo": "09"
    },
    {
        "id": "10",
        "nombre": "HUANUCO",
        "codigo": "10"
    },
    {
        "id": "11",
        "nombre": "ICA",
        "codigo": "11"
    },
    {
        "id": "12",
        "nombre": "JUNIN",
        "codigo": "12"
    },
    {
        "id": "13",
        "nombre": "LA LIBERTAD",
        "codigo": "13"
    },
    {
        "id": "14",
        "nombre": "LAMBAYEQUE",
        "codigo": "14"
    },
    {
        "id": "15",
        "nombre": "LIMA",
        "codigo": "15"
    },
    {
        "id": "16",
        "nombre": "LORETO",
        "codigo": "16"
    },
    {
        "id": "17",
        "nombre": "MADRE DE DIOS",
        "codigo": "17"
    },
    {
        "id": "18",
        "nombre": "MOQUEGUA",
        "codigo": "18"
    },
    {
        "id": "19",
        "nombre": "PASCO",
        "codigo": "19"
    },
    {
        "id": "20",
        "nombre": "PIURA",
        "codigo": "20"
    },
    {
        "id": "21",
        "nombre": "PUNO",
        "codigo": "21"
    },
    {
        "id": "22",
        "nombre": "SAN MARTIN",
        "codigo": "22"
    },
    {
        "id": "23",
        "nombre": "TACNA",
        "codigo": "23"
    },
    {
        "id": "24",
        "nombre": "TUMBES",
        "codigo": "24"
    },
    {
        "id": "25",
        "nombre": "UCAYALI",
        "codigo": "25"
    }
];

// ========================================
// PROVINCIAS (196)
// ========================================
export const PROVINCIAS: Provincia[] = [
    {
        "id": "0101",
        "nombre": "CHACHAPOYAS",
        "codigo": "0101",
        "departamento_id": "01"
    },
    {
        "id": "0102",
        "nombre": "BAGUA",
        "codigo": "0102",
        "departamento_id": "01"
    },
    {
        "id": "0103",
        "nombre": "BONGARA",
        "codigo": "0103",
        "departamento_id": "01"
    },
    {
        "id": "0104",
        "nombre": "CONDORCANQUI",
        "codigo": "0104",
        "departamento_id": "01"
    },
    {
        "id": "0105",
        "nombre": "LUYA",
        "codigo": "0105",
        "departamento_id": "01"
    },
    {
        "id": "0106",
        "nombre": "RODRIGUEZ DE MENDOZA",
        "codigo": "0106",
        "departamento_id": "01"
    },
    {
        "id": "0107",
        "nombre": "UTCUBAMBA",
        "codigo": "0107",
        "departamento_id": "01"
    },
    {
        "id": "0201",
        "nombre": "HUARAZ",
        "codigo": "0201",
        "departamento_id": "02"
    },
    {
        "id": "0202",
        "nombre": "AIJA",
        "codigo": "0202",
        "departamento_id": "02"
    },
    {
        "id": "0203",
        "nombre": "ANTONIO RAYMONDI",
        "codigo": "0203",
        "departamento_id": "02"
    },
    {
        "id": "0204",
        "nombre": "ASUNCION",
        "codigo": "0204",
        "departamento_id": "02"
    },
    {
        "id": "0205",
        "nombre": "BOLOGNESI",
        "codigo": "0205",
        "departamento_id": "02"
    },
    {
        "id": "0206",
        "nombre": "CARHUAZ",
        "codigo": "0206",
        "departamento_id": "02"
    },
    {
        "id": "0207",
        "nombre": "CARLOS FERMIN FITZCARRALD",
        "codigo": "0207",
        "departamento_id": "02"
    },
    {
        "id": "0208",
        "nombre": "CASMA",
        "codigo": "0208",
        "departamento_id": "02"
    },
    {
        "id": "0209",
        "nombre": "CORONGO",
        "codigo": "0209",
        "departamento_id": "02"
    },
    {
        "id": "0210",
        "nombre": "HUARI",
        "codigo": "0210",
        "departamento_id": "02"
    },
    {
        "id": "0211",
        "nombre": "HUARMEY",
        "codigo": "0211",
        "departamento_id": "02"
    },
    {
        "id": "0212",
        "nombre": "HUAYLAS",
        "codigo": "0212",
        "departamento_id": "02"
    },
    {
        "id": "0213",
        "nombre": "MARISCAL LUZURIAGA",
        "codigo": "0213",
        "departamento_id": "02"
    },
    {
        "id": "0214",
        "nombre": "OCROS",
        "codigo": "0214",
        "departamento_id": "02"
    },
    {
        "id": "0215",
        "nombre": "PALLASCA",
        "codigo": "0215",
        "departamento_id": "02"
    },
    {
        "id": "0216",
        "nombre": "POMABAMBA",
        "codigo": "0216",
        "departamento_id": "02"
    },
    {
        "id": "0217",
        "nombre": "RECUAY",
        "codigo": "0217",
        "departamento_id": "02"
    },
    {
        "id": "0218",
        "nombre": "SANTA",
        "codigo": "0218",
        "departamento_id": "02"
    },
    {
        "id": "0219",
        "nombre": "SIHUAS",
        "codigo": "0219",
        "departamento_id": "02"
    },
    {
        "id": "0220",
        "nombre": "YUNGAY",
        "codigo": "0220",
        "departamento_id": "02"
    },
    {
        "id": "0301",
        "nombre": "ABANCAY",
        "codigo": "0301",
        "departamento_id": "03"
    },
    {
        "id": "0302",
        "nombre": "ANDAHUAYLAS",
        "codigo": "0302",
        "departamento_id": "03"
    },
    {
        "id": "0303",
        "nombre": "ANTABAMBA",
        "codigo": "0303",
        "departamento_id": "03"
    },
    {
        "id": "0304",
        "nombre": "AYMARAES",
        "codigo": "0304",
        "departamento_id": "03"
    },
    {
        "id": "0305",
        "nombre": "COTABAMBAS",
        "codigo": "0305",
        "departamento_id": "03"
    },
    {
        "id": "0306",
        "nombre": "CHINCHEROS",
        "codigo": "0306",
        "departamento_id": "03"
    },
    {
        "id": "0307",
        "nombre": "GRAU",
        "codigo": "0307",
        "departamento_id": "03"
    },
    {
        "id": "0401",
        "nombre": "AREQUIPA",
        "codigo": "0401",
        "departamento_id": "04"
    },
    {
        "id": "0402",
        "nombre": "CAMANA",
        "codigo": "0402",
        "departamento_id": "04"
    },
    {
        "id": "0403",
        "nombre": "CARAVELI",
        "codigo": "0403",
        "departamento_id": "04"
    },
    {
        "id": "0404",
        "nombre": "CASTILLA",
        "codigo": "0404",
        "departamento_id": "04"
    },
    {
        "id": "0405",
        "nombre": "CAYLLOMA",
        "codigo": "0405",
        "departamento_id": "04"
    },
    {
        "id": "0406",
        "nombre": "CONDESUYOS",
        "codigo": "0406",
        "departamento_id": "04"
    },
    {
        "id": "0407",
        "nombre": "ISLAY",
        "codigo": "0407",
        "departamento_id": "04"
    },
    {
        "id": "0408",
        "nombre": "LA UNION",
        "codigo": "0408",
        "departamento_id": "04"
    },
    {
        "id": "0501",
        "nombre": "HUAMANGA",
        "codigo": "0501",
        "departamento_id": "05"
    },
    {
        "id": "0502",
        "nombre": "CANGALLO",
        "codigo": "0502",
        "departamento_id": "05"
    },
    {
        "id": "0503",
        "nombre": "HUANCA SANCOS",
        "codigo": "0503",
        "departamento_id": "05"
    },
    {
        "id": "0504",
        "nombre": "HUANTA",
        "codigo": "0504",
        "departamento_id": "05"
    },
    {
        "id": "0505",
        "nombre": "LA MAR",
        "codigo": "0505",
        "departamento_id": "05"
    },
    {
        "id": "0506",
        "nombre": "LUCANAS",
        "codigo": "0506",
        "departamento_id": "05"
    },
    {
        "id": "0507",
        "nombre": "PARINACOCHAS",
        "codigo": "0507",
        "departamento_id": "05"
    },
    {
        "id": "0508",
        "nombre": "PAUCAR DEL SARA SARA",
        "codigo": "0508",
        "departamento_id": "05"
    },
    {
        "id": "0509",
        "nombre": "SUCRE",
        "codigo": "0509",
        "departamento_id": "05"
    },
    {
        "id": "0510",
        "nombre": "VICTOR FAJARDO",
        "codigo": "0510",
        "departamento_id": "05"
    },
    {
        "id": "0511",
        "nombre": "VILCAS HUAMAN",
        "codigo": "0511",
        "departamento_id": "05"
    },
    {
        "id": "0601",
        "nombre": "CAJAMARCA",
        "codigo": "0601",
        "departamento_id": "06"
    },
    {
        "id": "0602",
        "nombre": "CAJABAMBA",
        "codigo": "0602",
        "departamento_id": "06"
    },
    {
        "id": "0603",
        "nombre": "CELENDIN",
        "codigo": "0603",
        "departamento_id": "06"
    },
    {
        "id": "0604",
        "nombre": "CHOTA",
        "codigo": "0604",
        "departamento_id": "06"
    },
    {
        "id": "0605",
        "nombre": "CONTUMAZA",
        "codigo": "0605",
        "departamento_id": "06"
    },
    {
        "id": "0606",
        "nombre": "CUTERVO",
        "codigo": "0606",
        "departamento_id": "06"
    },
    {
        "id": "0607",
        "nombre": "HUALGAYOC",
        "codigo": "0607",
        "departamento_id": "06"
    },
    {
        "id": "0608",
        "nombre": "JAEN",
        "codigo": "0608",
        "departamento_id": "06"
    },
    {
        "id": "0609",
        "nombre": "SAN IGNACIO",
        "codigo": "0609",
        "departamento_id": "06"
    },
    {
        "id": "0610",
        "nombre": "SAN MARCOS",
        "codigo": "0610",
        "departamento_id": "06"
    },
    {
        "id": "0611",
        "nombre": "SAN MIGUEL",
        "codigo": "0611",
        "departamento_id": "06"
    },
    {
        "id": "0612",
        "nombre": "SAN PABLO",
        "codigo": "0612",
        "departamento_id": "06"
    },
    {
        "id": "0613",
        "nombre": "SANTA CRUZ",
        "codigo": "0613",
        "departamento_id": "06"
    },
    {
        "id": "0701",
        "nombre": "CALLAO",
        "codigo": "0701",
        "departamento_id": "07"
    },
    {
        "id": "0801",
        "nombre": "CUSCO",
        "codigo": "0801",
        "departamento_id": "08"
    },
    {
        "id": "0802",
        "nombre": "ACOMAYO",
        "codigo": "0802",
        "departamento_id": "08"
    },
    {
        "id": "0803",
        "nombre": "ANTA",
        "codigo": "0803",
        "departamento_id": "08"
    },
    {
        "id": "0804",
        "nombre": "CALCA",
        "codigo": "0804",
        "departamento_id": "08"
    },
    {
        "id": "0805",
        "nombre": "CANAS",
        "codigo": "0805",
        "departamento_id": "08"
    },
    {
        "id": "0806",
        "nombre": "CANCHIS",
        "codigo": "0806",
        "departamento_id": "08"
    },
    {
        "id": "0807",
        "nombre": "CHUMBIVILCAS",
        "codigo": "0807",
        "departamento_id": "08"
    },
    {
        "id": "0808",
        "nombre": "ESPINAR",
        "codigo": "0808",
        "departamento_id": "08"
    },
    {
        "id": "0809",
        "nombre": "LA CONVENCION",
        "codigo": "0809",
        "departamento_id": "08"
    },
    {
        "id": "0810",
        "nombre": "PARURO",
        "codigo": "0810",
        "departamento_id": "08"
    },
    {
        "id": "0811",
        "nombre": "PAUCARTAMBO",
        "codigo": "0811",
        "departamento_id": "08"
    },
    {
        "id": "0812",
        "nombre": "QUISPICANCHI",
        "codigo": "0812",
        "departamento_id": "08"
    },
    {
        "id": "0813",
        "nombre": "URUBAMBA",
        "codigo": "0813",
        "departamento_id": "08"
    },
    {
        "id": "0901",
        "nombre": "HUANCAVELICA",
        "codigo": "0901",
        "departamento_id": "09"
    },
    {
        "id": "0902",
        "nombre": "ACOBAMBA",
        "codigo": "0902",
        "departamento_id": "09"
    },
    {
        "id": "0903",
        "nombre": "ANGARAES",
        "codigo": "0903",
        "departamento_id": "09"
    },
    {
        "id": "0904",
        "nombre": "CASTROVIRREYNA",
        "codigo": "0904",
        "departamento_id": "09"
    },
    {
        "id": "0905",
        "nombre": "CHURCAMPA",
        "codigo": "0905",
        "departamento_id": "09"
    },
    {
        "id": "0906",
        "nombre": "HUAYTARA",
        "codigo": "0906",
        "departamento_id": "09"
    },
    {
        "id": "0907",
        "nombre": "TAYACAJA",
        "codigo": "0907",
        "departamento_id": "09"
    },
    {
        "id": "1001",
        "nombre": "HUANUCO",
        "codigo": "1001",
        "departamento_id": "10"
    },
    {
        "id": "1002",
        "nombre": "AMBO",
        "codigo": "1002",
        "departamento_id": "10"
    },
    {
        "id": "1003",
        "nombre": "DOS DE MAYO",
        "codigo": "1003",
        "departamento_id": "10"
    },
    {
        "id": "1004",
        "nombre": "HUACAYBAMBA",
        "codigo": "1004",
        "departamento_id": "10"
    },
    {
        "id": "1005",
        "nombre": "HUAMALIES",
        "codigo": "1005",
        "departamento_id": "10"
    },
    {
        "id": "1006",
        "nombre": "LEONCIO PRADO",
        "codigo": "1006",
        "departamento_id": "10"
    },
    {
        "id": "1007",
        "nombre": "MARAÑON",
        "codigo": "1007",
        "departamento_id": "10"
    },
    {
        "id": "1008",
        "nombre": "PACHITEA",
        "codigo": "1008",
        "departamento_id": "10"
    },
    {
        "id": "1009",
        "nombre": "PUERTO INCA",
        "codigo": "1009",
        "departamento_id": "10"
    },
    {
        "id": "1010",
        "nombre": "LAURICOCHA",
        "codigo": "1010",
        "departamento_id": "10"
    },
    {
        "id": "1011",
        "nombre": "YAROWILCA",
        "codigo": "1011",
        "departamento_id": "10"
    },
    {
        "id": "1101",
        "nombre": "ICA",
        "codigo": "1101",
        "departamento_id": "11"
    },
    {
        "id": "1102",
        "nombre": "CHINCHA",
        "codigo": "1102",
        "departamento_id": "11"
    },
    {
        "id": "1103",
        "nombre": "NAZCA",
        "codigo": "1103",
        "departamento_id": "11"
    },
    {
        "id": "1104",
        "nombre": "PALPA",
        "codigo": "1104",
        "departamento_id": "11"
    },
    {
        "id": "1105",
        "nombre": "PISCO",
        "codigo": "1105",
        "departamento_id": "11"
    },
    {
        "id": "1201",
        "nombre": "HUANCAYO",
        "codigo": "1201",
        "departamento_id": "12"
    },
    {
        "id": "1202",
        "nombre": "CONCEPCION",
        "codigo": "1202",
        "departamento_id": "12"
    },
    {
        "id": "1203",
        "nombre": "CHANCHAMAYO",
        "codigo": "1203",
        "departamento_id": "12"
    },
    {
        "id": "1204",
        "nombre": "JAUJA",
        "codigo": "1204",
        "departamento_id": "12"
    },
    {
        "id": "1205",
        "nombre": "JUNIN",
        "codigo": "1205",
        "departamento_id": "12"
    },
    {
        "id": "1206",
        "nombre": "SATIPO",
        "codigo": "1206",
        "departamento_id": "12"
    },
    {
        "id": "1207",
        "nombre": "TARMA",
        "codigo": "1207",
        "departamento_id": "12"
    },
    {
        "id": "1208",
        "nombre": "YAULI",
        "codigo": "1208",
        "departamento_id": "12"
    },
    {
        "id": "1209",
        "nombre": "CHUPACA",
        "codigo": "1209",
        "departamento_id": "12"
    },
    {
        "id": "1301",
        "nombre": "TRUJILLO",
        "codigo": "1301",
        "departamento_id": "13"
    },
    {
        "id": "1302",
        "nombre": "ASCOPE",
        "codigo": "1302",
        "departamento_id": "13"
    },
    {
        "id": "1303",
        "nombre": "BOLIVAR",
        "codigo": "1303",
        "departamento_id": "13"
    },
    {
        "id": "1304",
        "nombre": "CHEPEN",
        "codigo": "1304",
        "departamento_id": "13"
    },
    {
        "id": "1305",
        "nombre": "JULCAN",
        "codigo": "1305",
        "departamento_id": "13"
    },
    {
        "id": "1306",
        "nombre": "OTUZCO",
        "codigo": "1306",
        "departamento_id": "13"
    },
    {
        "id": "1307",
        "nombre": "PACASMAYO",
        "codigo": "1307",
        "departamento_id": "13"
    },
    {
        "id": "1308",
        "nombre": "PATAZ",
        "codigo": "1308",
        "departamento_id": "13"
    },
    {
        "id": "1309",
        "nombre": "SANCHEZ CARRION",
        "codigo": "1309",
        "departamento_id": "13"
    },
    {
        "id": "1310",
        "nombre": "SANTIAGO DE CHUCO",
        "codigo": "1310",
        "departamento_id": "13"
    },
    {
        "id": "1311",
        "nombre": "GRAN CHIMU",
        "codigo": "1311",
        "departamento_id": "13"
    },
    {
        "id": "1312",
        "nombre": "VIRU",
        "codigo": "1312",
        "departamento_id": "13"
    },
    {
        "id": "1401",
        "nombre": "CHICLAYO",
        "codigo": "1401",
        "departamento_id": "14"
    },
    {
        "id": "1402",
        "nombre": "FERREÑAFE",
        "codigo": "1402",
        "departamento_id": "14"
    },
    {
        "id": "1403",
        "nombre": "LAMBAYEQUE",
        "codigo": "1403",
        "departamento_id": "14"
    },
    {
        "id": "1501",
        "nombre": "LIMA",
        "codigo": "1501",
        "departamento_id": "15"
    },
    {
        "id": "1502",
        "nombre": "BARRANCA",
        "codigo": "1502",
        "departamento_id": "15"
    },
    {
        "id": "1503",
        "nombre": "CAJATAMBO",
        "codigo": "1503",
        "departamento_id": "15"
    },
    {
        "id": "1504",
        "nombre": "CANTA",
        "codigo": "1504",
        "departamento_id": "15"
    },
    {
        "id": "1505",
        "nombre": "CAÑETE",
        "codigo": "1505",
        "departamento_id": "15"
    },
    {
        "id": "1506",
        "nombre": "HUARAL",
        "codigo": "1506",
        "departamento_id": "15"
    },
    {
        "id": "1507",
        "nombre": "HUAROCHIRI",
        "codigo": "1507",
        "departamento_id": "15"
    },
    {
        "id": "1508",
        "nombre": "HUAURA",
        "codigo": "1508",
        "departamento_id": "15"
    },
    {
        "id": "1509",
        "nombre": "OYON",
        "codigo": "1509",
        "departamento_id": "15"
    },
    {
        "id": "1510",
        "nombre": "YAUYOS",
        "codigo": "1510",
        "departamento_id": "15"
    },
    {
        "id": "1601",
        "nombre": "MAYNAS",
        "codigo": "1601",
        "departamento_id": "16"
    },
    {
        "id": "1602",
        "nombre": "ALTO AMAZONAS",
        "codigo": "1602",
        "departamento_id": "16"
    },
    {
        "id": "1603",
        "nombre": "LORETO",
        "codigo": "1603",
        "departamento_id": "16"
    },
    {
        "id": "1604",
        "nombre": "MARISCAL RAMON CASTILLA",
        "codigo": "1604",
        "departamento_id": "16"
    },
    {
        "id": "1605",
        "nombre": "REQUENA",
        "codigo": "1605",
        "departamento_id": "16"
    },
    {
        "id": "1606",
        "nombre": "UCAYALI",
        "codigo": "1606",
        "departamento_id": "16"
    },
    {
        "id": "1607",
        "nombre": "DATEM DEL MARAÑON",
        "codigo": "1607",
        "departamento_id": "16"
    },
    {
        "id": "1608",
        "nombre": "PUTUMAYO",
        "codigo": "1608",
        "departamento_id": "16"
    },
    {
        "id": "1701",
        "nombre": "TAMBOPATA",
        "codigo": "1701",
        "departamento_id": "17"
    },
    {
        "id": "1702",
        "nombre": "MANU",
        "codigo": "1702",
        "departamento_id": "17"
    },
    {
        "id": "1703",
        "nombre": "TAHUAMANU",
        "codigo": "1703",
        "departamento_id": "17"
    },
    {
        "id": "1801",
        "nombre": "MARISCAL NIETO",
        "codigo": "1801",
        "departamento_id": "18"
    },
    {
        "id": "1802",
        "nombre": "GENERAL SANCHEZ CERRO",
        "codigo": "1802",
        "departamento_id": "18"
    },
    {
        "id": "1803",
        "nombre": "ILO",
        "codigo": "1803",
        "departamento_id": "18"
    },
    {
        "id": "1901",
        "nombre": "PASCO",
        "codigo": "1901",
        "departamento_id": "19"
    },
    {
        "id": "1902",
        "nombre": "DANIEL ALCIDES CARRION",
        "codigo": "1902",
        "departamento_id": "19"
    },
    {
        "id": "1903",
        "nombre": "OXAPAMPA",
        "codigo": "1903",
        "departamento_id": "19"
    },
    {
        "id": "2001",
        "nombre": "PIURA",
        "codigo": "2001",
        "departamento_id": "20"
    },
    {
        "id": "2002",
        "nombre": "AYABACA",
        "codigo": "2002",
        "departamento_id": "20"
    },
    {
        "id": "2003",
        "nombre": "HUANCABAMBA",
        "codigo": "2003",
        "departamento_id": "20"
    },
    {
        "id": "2004",
        "nombre": "MORROPON",
        "codigo": "2004",
        "departamento_id": "20"
    },
    {
        "id": "2005",
        "nombre": "PAITA",
        "codigo": "2005",
        "departamento_id": "20"
    },
    {
        "id": "2006",
        "nombre": "SULLANA",
        "codigo": "2006",
        "departamento_id": "20"
    },
    {
        "id": "2007",
        "nombre": "TALARA",
        "codigo": "2007",
        "departamento_id": "20"
    },
    {
        "id": "2008",
        "nombre": "SECHURA",
        "codigo": "2008",
        "departamento_id": "20"
    },
    {
        "id": "2101",
        "nombre": "PUNO",
        "codigo": "2101",
        "departamento_id": "21"
    },
    {
        "id": "2102",
        "nombre": "AZANGARO",
        "codigo": "2102",
        "departamento_id": "21"
    },
    {
        "id": "2103",
        "nombre": "CARABAYA",
        "codigo": "2103",
        "departamento_id": "21"
    },
    {
        "id": "2104",
        "nombre": "CHUCUITO",
        "codigo": "2104",
        "departamento_id": "21"
    },
    {
        "id": "2105",
        "nombre": "EL COLLAO",
        "codigo": "2105",
        "departamento_id": "21"
    },
    {
        "id": "2106",
        "nombre": "HUANCANE",
        "codigo": "2106",
        "departamento_id": "21"
    },
    {
        "id": "2107",
        "nombre": "LAMPA",
        "codigo": "2107",
        "departamento_id": "21"
    },
    {
        "id": "2108",
        "nombre": "MELGAR",
        "codigo": "2108",
        "departamento_id": "21"
    },
    {
        "id": "2109",
        "nombre": "MOHO",
        "codigo": "2109",
        "departamento_id": "21"
    },
    {
        "id": "2110",
        "nombre": "SAN ANTONIO DE PUTINA",
        "codigo": "2110",
        "departamento_id": "21"
    },
    {
        "id": "2111",
        "nombre": "SAN ROMAN",
        "codigo": "2111",
        "departamento_id": "21"
    },
    {
        "id": "2112",
        "nombre": "SANDIA",
        "codigo": "2112",
        "departamento_id": "21"
    },
    {
        "id": "2113",
        "nombre": "YUNGUYO",
        "codigo": "2113",
        "departamento_id": "21"
    },
    {
        "id": "2201",
        "nombre": "MOYOBAMBA",
        "codigo": "2201",
        "departamento_id": "22"
    },
    {
        "id": "2202",
        "nombre": "BELLAVISTA",
        "codigo": "2202",
        "departamento_id": "22"
    },
    {
        "id": "2203",
        "nombre": "EL DORADO",
        "codigo": "2203",
        "departamento_id": "22"
    },
    {
        "id": "2204",
        "nombre": "HUALLAGA",
        "codigo": "2204",
        "departamento_id": "22"
    },
    {
        "id": "2205",
        "nombre": "LAMAS",
        "codigo": "2205",
        "departamento_id": "22"
    },
    {
        "id": "2206",
        "nombre": "MARISCAL CACERES",
        "codigo": "2206",
        "departamento_id": "22"
    },
    {
        "id": "2207",
        "nombre": "PICOTA",
        "codigo": "2207",
        "departamento_id": "22"
    },
    {
        "id": "2208",
        "nombre": "RIOJA",
        "codigo": "2208",
        "departamento_id": "22"
    },
    {
        "id": "2209",
        "nombre": "SAN MARTIN",
        "codigo": "2209",
        "departamento_id": "22"
    },
    {
        "id": "2210",
        "nombre": "TOCACHE",
        "codigo": "2210",
        "departamento_id": "22"
    },
    {
        "id": "2301",
        "nombre": "TACNA",
        "codigo": "2301",
        "departamento_id": "23"
    },
    {
        "id": "2302",
        "nombre": "CANDARAVE",
        "codigo": "2302",
        "departamento_id": "23"
    },
    {
        "id": "2303",
        "nombre": "JORGE BASADRE",
        "codigo": "2303",
        "departamento_id": "23"
    },
    {
        "id": "2304",
        "nombre": "TARATA",
        "codigo": "2304",
        "departamento_id": "23"
    },
    {
        "id": "2401",
        "nombre": "TUMBES",
        "codigo": "2401",
        "departamento_id": "24"
    },
    {
        "id": "2402",
        "nombre": "CONTRALMIRANTE VILLAR",
        "codigo": "2402",
        "departamento_id": "24"
    },
    {
        "id": "2403",
        "nombre": "ZARUMILLA",
        "codigo": "2403",
        "departamento_id": "24"
    },
    {
        "id": "2501",
        "nombre": "CORONEL PORTILLO",
        "codigo": "2501",
        "departamento_id": "25"
    },
    {
        "id": "2502",
        "nombre": "ATALAYA",
        "codigo": "2502",
        "departamento_id": "25"
    },
    {
        "id": "2503",
        "nombre": "PADRE ABAD",
        "codigo": "2503",
        "departamento_id": "25"
    },
    {
        "id": "2504",
        "nombre": "PURUS",
        "codigo": "2504",
        "departamento_id": "25"
    }
];

// ========================================
// DISTRITOS (1892)
// ========================================
export const DISTRITOS: Distrito[] = [
    {
        "id": "010101",
        "nombre": "CHACHAPOYAS",
        "codigo": "010101",
        "provincia_id": "0101"
    },
    {
        "id": "010102",
        "nombre": "ASUNCION",
        "codigo": "010102",
        "provincia_id": "0101"
    },
    {
        "id": "010103",
        "nombre": "BALSAS",
        "codigo": "010103",
        "provincia_id": "0101"
    },
    {
        "id": "010104",
        "nombre": "CHETO",
        "codigo": "010104",
        "provincia_id": "0101"
    },
    {
        "id": "010105",
        "nombre": "CHILIQUIN",
        "codigo": "010105",
        "provincia_id": "0101"
    },
    {
        "id": "010106",
        "nombre": "CHUQUIBAMBA",
        "codigo": "010106",
        "provincia_id": "0101"
    },
    {
        "id": "010107",
        "nombre": "GRANADA",
        "codigo": "010107",
        "provincia_id": "0101"
    },
    {
        "id": "010108",
        "nombre": "HUANCAS",
        "codigo": "010108",
        "provincia_id": "0101"
    },
    {
        "id": "010109",
        "nombre": "LA JALCA",
        "codigo": "010109",
        "provincia_id": "0101"
    },
    {
        "id": "010110",
        "nombre": "LEIMEBAMBA",
        "codigo": "010110",
        "provincia_id": "0101"
    },
    {
        "id": "010111",
        "nombre": "LEVANTO",
        "codigo": "010111",
        "provincia_id": "0101"
    },
    {
        "id": "010112",
        "nombre": "MAGDALENA",
        "codigo": "010112",
        "provincia_id": "0101"
    },
    {
        "id": "010113",
        "nombre": "MARISCAL CASTILLA",
        "codigo": "010113",
        "provincia_id": "0101"
    },
    {
        "id": "010114",
        "nombre": "MOLINOPAMPA",
        "codigo": "010114",
        "provincia_id": "0101"
    },
    {
        "id": "010115",
        "nombre": "MONTEVIDEO",
        "codigo": "010115",
        "provincia_id": "0101"
    },
    {
        "id": "010116",
        "nombre": "OLLEROS",
        "codigo": "010116",
        "provincia_id": "0101"
    },
    {
        "id": "010117",
        "nombre": "QUINJALCA",
        "codigo": "010117",
        "provincia_id": "0101"
    },
    {
        "id": "010118",
        "nombre": "SAN FRANCISCO DE DAGUAS",
        "codigo": "010118",
        "provincia_id": "0101"
    },
    {
        "id": "010119",
        "nombre": "SAN ISIDRO DE MAINO",
        "codigo": "010119",
        "provincia_id": "0101"
    },
    {
        "id": "010120",
        "nombre": "SOLOCO",
        "codigo": "010120",
        "provincia_id": "0101"
    },
    {
        "id": "010121",
        "nombre": "SONCHE",
        "codigo": "010121",
        "provincia_id": "0101"
    },
    {
        "id": "010201",
        "nombre": "BAGUA",
        "codigo": "010201",
        "provincia_id": "0102"
    },
    {
        "id": "010202",
        "nombre": "ARAMANGO",
        "codigo": "010202",
        "provincia_id": "0102"
    },
    {
        "id": "010203",
        "nombre": "COPALLIN",
        "codigo": "010203",
        "provincia_id": "0102"
    },
    {
        "id": "010204",
        "nombre": "EL PARCO",
        "codigo": "010204",
        "provincia_id": "0102"
    },
    {
        "id": "010205",
        "nombre": "IMAZA",
        "codigo": "010205",
        "provincia_id": "0102"
    },
    {
        "id": "010206",
        "nombre": "LA PECA",
        "codigo": "010206",
        "provincia_id": "0102"
    },
    {
        "id": "010301",
        "nombre": "JUMBILLA",
        "codigo": "010301",
        "provincia_id": "0103"
    },
    {
        "id": "010302",
        "nombre": "CHISQUILLA",
        "codigo": "010302",
        "provincia_id": "0103"
    },
    {
        "id": "010303",
        "nombre": "CHURUJA",
        "codigo": "010303",
        "provincia_id": "0103"
    },
    {
        "id": "010304",
        "nombre": "COROSHA",
        "codigo": "010304",
        "provincia_id": "0103"
    },
    {
        "id": "010305",
        "nombre": "CUISPES",
        "codigo": "010305",
        "provincia_id": "0103"
    },
    {
        "id": "010306",
        "nombre": "FLORIDA",
        "codigo": "010306",
        "provincia_id": "0103"
    },
    {
        "id": "010307",
        "nombre": "JAZAN",
        "codigo": "010307",
        "provincia_id": "0103"
    },
    {
        "id": "010308",
        "nombre": "RECTA",
        "codigo": "010308",
        "provincia_id": "0103"
    },
    {
        "id": "010309",
        "nombre": "SAN CARLOS",
        "codigo": "010309",
        "provincia_id": "0103"
    },
    {
        "id": "010310",
        "nombre": "SHIPASBAMBA",
        "codigo": "010310",
        "provincia_id": "0103"
    },
    {
        "id": "010311",
        "nombre": "VALERA",
        "codigo": "010311",
        "provincia_id": "0103"
    },
    {
        "id": "010312",
        "nombre": "YAMBRASBAMBA",
        "codigo": "010312",
        "provincia_id": "0103"
    },
    {
        "id": "010401",
        "nombre": "NIEVA",
        "codigo": "010401",
        "provincia_id": "0104"
    },
    {
        "id": "010402",
        "nombre": "EL CENEPA",
        "codigo": "010402",
        "provincia_id": "0104"
    },
    {
        "id": "010403",
        "nombre": "RIO SANTIAGO",
        "codigo": "010403",
        "provincia_id": "0104"
    },
    {
        "id": "010501",
        "nombre": "LAMUD",
        "codigo": "010501",
        "provincia_id": "0105"
    },
    {
        "id": "010502",
        "nombre": "CAMPORREDONDO",
        "codigo": "010502",
        "provincia_id": "0105"
    },
    {
        "id": "010503",
        "nombre": "COCABAMBA",
        "codigo": "010503",
        "provincia_id": "0105"
    },
    {
        "id": "010504",
        "nombre": "COLCAMAR",
        "codigo": "010504",
        "provincia_id": "0105"
    },
    {
        "id": "010505",
        "nombre": "CONILA",
        "codigo": "010505",
        "provincia_id": "0105"
    },
    {
        "id": "010506",
        "nombre": "INGUILPATA",
        "codigo": "010506",
        "provincia_id": "0105"
    },
    {
        "id": "010507",
        "nombre": "LONGUITA",
        "codigo": "010507",
        "provincia_id": "0105"
    },
    {
        "id": "010508",
        "nombre": "LONYA CHICO",
        "codigo": "010508",
        "provincia_id": "0105"
    },
    {
        "id": "010509",
        "nombre": "LUYA",
        "codigo": "010509",
        "provincia_id": "0105"
    },
    {
        "id": "010510",
        "nombre": "LUYA VIEJO",
        "codigo": "010510",
        "provincia_id": "0105"
    },
    {
        "id": "010511",
        "nombre": "MARIA",
        "codigo": "010511",
        "provincia_id": "0105"
    },
    {
        "id": "010512",
        "nombre": "OCALLI",
        "codigo": "010512",
        "provincia_id": "0105"
    },
    {
        "id": "010513",
        "nombre": "OCUMAL",
        "codigo": "010513",
        "provincia_id": "0105"
    },
    {
        "id": "010514",
        "nombre": "PISUQUIA",
        "codigo": "010514",
        "provincia_id": "0105"
    },
    {
        "id": "010515",
        "nombre": "PROVIDENCIA",
        "codigo": "010515",
        "provincia_id": "0105"
    },
    {
        "id": "010516",
        "nombre": "SAN CRISTOBAL",
        "codigo": "010516",
        "provincia_id": "0105"
    },
    {
        "id": "010517",
        "nombre": "SAN FRANCISCO DEL YESO",
        "codigo": "010517",
        "provincia_id": "0105"
    },
    {
        "id": "010518",
        "nombre": "SAN JERONIMO",
        "codigo": "010518",
        "provincia_id": "0105"
    },
    {
        "id": "010519",
        "nombre": "SAN JUAN DE LOPECANCHA",
        "codigo": "010519",
        "provincia_id": "0105"
    },
    {
        "id": "010520",
        "nombre": "SANTA CATALINA",
        "codigo": "010520",
        "provincia_id": "0105"
    },
    {
        "id": "010521",
        "nombre": "SANTO TOMAS",
        "codigo": "010521",
        "provincia_id": "0105"
    },
    {
        "id": "010522",
        "nombre": "TINGO",
        "codigo": "010522",
        "provincia_id": "0105"
    },
    {
        "id": "010523",
        "nombre": "TRITA",
        "codigo": "010523",
        "provincia_id": "0105"
    },
    {
        "id": "010601",
        "nombre": "SAN NICOLAS",
        "codigo": "010601",
        "provincia_id": "0106"
    },
    {
        "id": "010602",
        "nombre": "CHIRIMOTO",
        "codigo": "010602",
        "provincia_id": "0106"
    },
    {
        "id": "010603",
        "nombre": "COCHAMAL",
        "codigo": "010603",
        "provincia_id": "0106"
    },
    {
        "id": "010604",
        "nombre": "HUAMBO",
        "codigo": "010604",
        "provincia_id": "0106"
    },
    {
        "id": "010605",
        "nombre": "LIMABAMBA",
        "codigo": "010605",
        "provincia_id": "0106"
    },
    {
        "id": "010606",
        "nombre": "LONGAR",
        "codigo": "010606",
        "provincia_id": "0106"
    },
    {
        "id": "010607",
        "nombre": "MARISCAL BENAVIDES",
        "codigo": "010607",
        "provincia_id": "0106"
    },
    {
        "id": "010608",
        "nombre": "MILPUC",
        "codigo": "010608",
        "provincia_id": "0106"
    },
    {
        "id": "010609",
        "nombre": "OMIA",
        "codigo": "010609",
        "provincia_id": "0106"
    },
    {
        "id": "010610",
        "nombre": "SANTA ROSA",
        "codigo": "010610",
        "provincia_id": "0106"
    },
    {
        "id": "010611",
        "nombre": "TOTORA",
        "codigo": "010611",
        "provincia_id": "0106"
    },
    {
        "id": "010612",
        "nombre": "VISTA ALEGRE",
        "codigo": "010612",
        "provincia_id": "0106"
    },
    {
        "id": "010701",
        "nombre": "BAGUA GRANDE",
        "codigo": "010701",
        "provincia_id": "0107"
    },
    {
        "id": "010702",
        "nombre": "CAJARURO",
        "codigo": "010702",
        "provincia_id": "0107"
    },
    {
        "id": "010703",
        "nombre": "CUMBA",
        "codigo": "010703",
        "provincia_id": "0107"
    },
    {
        "id": "010704",
        "nombre": "EL MILAGRO",
        "codigo": "010704",
        "provincia_id": "0107"
    },
    {
        "id": "010705",
        "nombre": "JAMALCA",
        "codigo": "010705",
        "provincia_id": "0107"
    },
    {
        "id": "010706",
        "nombre": "LONYA GRANDE",
        "codigo": "010706",
        "provincia_id": "0107"
    },
    {
        "id": "010707",
        "nombre": "YAMON",
        "codigo": "010707",
        "provincia_id": "0107"
    },
    {
        "id": "020101",
        "nombre": "HUARAZ",
        "codigo": "020101",
        "provincia_id": "0201"
    },
    {
        "id": "020102",
        "nombre": "COCHABAMBA",
        "codigo": "020102",
        "provincia_id": "0201"
    },
    {
        "id": "020103",
        "nombre": "COLCABAMBA",
        "codigo": "020103",
        "provincia_id": "0201"
    },
    {
        "id": "020104",
        "nombre": "HUANCHAY",
        "codigo": "020104",
        "provincia_id": "0201"
    },
    {
        "id": "020105",
        "nombre": "INDEPENDENCIA",
        "codigo": "020105",
        "provincia_id": "0201"
    },
    {
        "id": "020106",
        "nombre": "JANGAS",
        "codigo": "020106",
        "provincia_id": "0201"
    },
    {
        "id": "020107",
        "nombre": "LA LIBERTAD",
        "codigo": "020107",
        "provincia_id": "0201"
    },
    {
        "id": "020108",
        "nombre": "OLLEROS",
        "codigo": "020108",
        "provincia_id": "0201"
    },
    {
        "id": "020109",
        "nombre": "PAMPAS",
        "codigo": "020109",
        "provincia_id": "0201"
    },
    {
        "id": "020110",
        "nombre": "PARIACOTO",
        "codigo": "020110",
        "provincia_id": "0201"
    },
    {
        "id": "020111",
        "nombre": "PIRA",
        "codigo": "020111",
        "provincia_id": "0201"
    },
    {
        "id": "020112",
        "nombre": "TARICA",
        "codigo": "020112",
        "provincia_id": "0201"
    },
    {
        "id": "020201",
        "nombre": "AIJA",
        "codigo": "020201",
        "provincia_id": "0202"
    },
    {
        "id": "020202",
        "nombre": "CORIS",
        "codigo": "020202",
        "provincia_id": "0202"
    },
    {
        "id": "020203",
        "nombre": "HUACLLAN",
        "codigo": "020203",
        "provincia_id": "0202"
    },
    {
        "id": "020204",
        "nombre": "LA MERCED",
        "codigo": "020204",
        "provincia_id": "0202"
    },
    {
        "id": "020205",
        "nombre": "SUCCHA",
        "codigo": "020205",
        "provincia_id": "0202"
    },
    {
        "id": "020301",
        "nombre": "LLAMELLIN",
        "codigo": "020301",
        "provincia_id": "0203"
    },
    {
        "id": "020302",
        "nombre": "ACZO",
        "codigo": "020302",
        "provincia_id": "0203"
    },
    {
        "id": "020303",
        "nombre": "CHACCHO",
        "codigo": "020303",
        "provincia_id": "0203"
    },
    {
        "id": "020304",
        "nombre": "CHINGAS",
        "codigo": "020304",
        "provincia_id": "0203"
    },
    {
        "id": "020305",
        "nombre": "MIRGAS",
        "codigo": "020305",
        "provincia_id": "0203"
    },
    {
        "id": "020306",
        "nombre": "SAN JUAN DE RONTOY",
        "codigo": "020306",
        "provincia_id": "0203"
    },
    {
        "id": "020401",
        "nombre": "CHACAS",
        "codigo": "020401",
        "provincia_id": "0204"
    },
    {
        "id": "020402",
        "nombre": "ACOCHACA",
        "codigo": "020402",
        "provincia_id": "0204"
    },
    {
        "id": "020501",
        "nombre": "CHIQUIAN",
        "codigo": "020501",
        "provincia_id": "0205"
    },
    {
        "id": "020502",
        "nombre": "ABELARDO PARDO LEZAMETA",
        "codigo": "020502",
        "provincia_id": "0205"
    },
    {
        "id": "020503",
        "nombre": "ANTONIO RAYMONDI",
        "codigo": "020503",
        "provincia_id": "0205"
    },
    {
        "id": "020504",
        "nombre": "AQUIA",
        "codigo": "020504",
        "provincia_id": "0205"
    },
    {
        "id": "020505",
        "nombre": "CAJACAY",
        "codigo": "020505",
        "provincia_id": "0205"
    },
    {
        "id": "020506",
        "nombre": "CANIS",
        "codigo": "020506",
        "provincia_id": "0205"
    },
    {
        "id": "020507",
        "nombre": "COLQUIOC",
        "codigo": "020507",
        "provincia_id": "0205"
    },
    {
        "id": "020508",
        "nombre": "HUALLANCA",
        "codigo": "020508",
        "provincia_id": "0205"
    },
    {
        "id": "020509",
        "nombre": "HUASTA",
        "codigo": "020509",
        "provincia_id": "0205"
    },
    {
        "id": "020510",
        "nombre": "HUAYLLACAYAN",
        "codigo": "020510",
        "provincia_id": "0205"
    },
    {
        "id": "020511",
        "nombre": "LA PRIMAVERA",
        "codigo": "020511",
        "provincia_id": "0205"
    },
    {
        "id": "020512",
        "nombre": "MANGAS",
        "codigo": "020512",
        "provincia_id": "0205"
    },
    {
        "id": "020513",
        "nombre": "PACLLON",
        "codigo": "020513",
        "provincia_id": "0205"
    },
    {
        "id": "020514",
        "nombre": "SAN MIGUEL DE CORPANQUI",
        "codigo": "020514",
        "provincia_id": "0205"
    },
    {
        "id": "020515",
        "nombre": "TICLLOS",
        "codigo": "020515",
        "provincia_id": "0205"
    },
    {
        "id": "020601",
        "nombre": "CARHUAZ",
        "codigo": "020601",
        "provincia_id": "0206"
    },
    {
        "id": "020602",
        "nombre": "ACOPAMPA",
        "codigo": "020602",
        "provincia_id": "0206"
    },
    {
        "id": "020603",
        "nombre": "AMASHCA",
        "codigo": "020603",
        "provincia_id": "0206"
    },
    {
        "id": "020604",
        "nombre": "ANTA",
        "codigo": "020604",
        "provincia_id": "0206"
    },
    {
        "id": "020605",
        "nombre": "ATAQUERO",
        "codigo": "020605",
        "provincia_id": "0206"
    },
    {
        "id": "020606",
        "nombre": "MARCARA",
        "codigo": "020606",
        "provincia_id": "0206"
    },
    {
        "id": "020607",
        "nombre": "PARIAHUANCA",
        "codigo": "020607",
        "provincia_id": "0206"
    },
    {
        "id": "020608",
        "nombre": "SAN MIGUEL DE ACO",
        "codigo": "020608",
        "provincia_id": "0206"
    },
    {
        "id": "020609",
        "nombre": "SHILLA",
        "codigo": "020609",
        "provincia_id": "0206"
    },
    {
        "id": "020610",
        "nombre": "TINCO",
        "codigo": "020610",
        "provincia_id": "0206"
    },
    {
        "id": "020611",
        "nombre": "YUNGAR",
        "codigo": "020611",
        "provincia_id": "0206"
    },
    {
        "id": "020701",
        "nombre": "SAN LUIS",
        "codigo": "020701",
        "provincia_id": "0207"
    },
    {
        "id": "020702",
        "nombre": "SAN NICOLAS",
        "codigo": "020702",
        "provincia_id": "0207"
    },
    {
        "id": "020703",
        "nombre": "YAUYA",
        "codigo": "020703",
        "provincia_id": "0207"
    },
    {
        "id": "020801",
        "nombre": "CASMA",
        "codigo": "020801",
        "provincia_id": "0208"
    },
    {
        "id": "020802",
        "nombre": "BUENA VISTA ALTA",
        "codigo": "020802",
        "provincia_id": "0208"
    },
    {
        "id": "020803",
        "nombre": "COMANDANTE NOEL",
        "codigo": "020803",
        "provincia_id": "0208"
    },
    {
        "id": "020804",
        "nombre": "YAUTAN",
        "codigo": "020804",
        "provincia_id": "0208"
    },
    {
        "id": "020901",
        "nombre": "CORONGO",
        "codigo": "020901",
        "provincia_id": "0209"
    },
    {
        "id": "020902",
        "nombre": "ACO",
        "codigo": "020902",
        "provincia_id": "0209"
    },
    {
        "id": "020903",
        "nombre": "BAMBAS",
        "codigo": "020903",
        "provincia_id": "0209"
    },
    {
        "id": "020904",
        "nombre": "CUSCA",
        "codigo": "020904",
        "provincia_id": "0209"
    },
    {
        "id": "020905",
        "nombre": "LA PAMPA",
        "codigo": "020905",
        "provincia_id": "0209"
    },
    {
        "id": "020906",
        "nombre": "YANAC",
        "codigo": "020906",
        "provincia_id": "0209"
    },
    {
        "id": "020907",
        "nombre": "YUPAN",
        "codigo": "020907",
        "provincia_id": "0209"
    },
    {
        "id": "021001",
        "nombre": "HUARI",
        "codigo": "021001",
        "provincia_id": "0210"
    },
    {
        "id": "021002",
        "nombre": "ANRA",
        "codigo": "021002",
        "provincia_id": "0210"
    },
    {
        "id": "021003",
        "nombre": "CAJAY",
        "codigo": "021003",
        "provincia_id": "0210"
    },
    {
        "id": "021004",
        "nombre": "CHAVIN DE HUANTAR",
        "codigo": "021004",
        "provincia_id": "0210"
    },
    {
        "id": "021005",
        "nombre": "HUACACHI",
        "codigo": "021005",
        "provincia_id": "0210"
    },
    {
        "id": "021006",
        "nombre": "HUACCHIS",
        "codigo": "021006",
        "provincia_id": "0210"
    },
    {
        "id": "021007",
        "nombre": "HUACHIS",
        "codigo": "021007",
        "provincia_id": "0210"
    },
    {
        "id": "021008",
        "nombre": "HUANTAR",
        "codigo": "021008",
        "provincia_id": "0210"
    },
    {
        "id": "021009",
        "nombre": "MASIN",
        "codigo": "021009",
        "provincia_id": "0210"
    },
    {
        "id": "021010",
        "nombre": "PAUCAS",
        "codigo": "021010",
        "provincia_id": "0210"
    },
    {
        "id": "021011",
        "nombre": "PONTO",
        "codigo": "021011",
        "provincia_id": "0210"
    },
    {
        "id": "021012",
        "nombre": "RAHUAPAMPA",
        "codigo": "021012",
        "provincia_id": "0210"
    },
    {
        "id": "021013",
        "nombre": "RAPAYAN",
        "codigo": "021013",
        "provincia_id": "0210"
    },
    {
        "id": "021014",
        "nombre": "SAN MARCOS",
        "codigo": "021014",
        "provincia_id": "0210"
    },
    {
        "id": "021015",
        "nombre": "SAN PEDRO DE CHANA",
        "codigo": "021015",
        "provincia_id": "0210"
    },
    {
        "id": "021016",
        "nombre": "UCO",
        "codigo": "021016",
        "provincia_id": "0210"
    },
    {
        "id": "021101",
        "nombre": "HUARMEY",
        "codigo": "021101",
        "provincia_id": "0211"
    },
    {
        "id": "021102",
        "nombre": "COCHAPETI",
        "codigo": "021102",
        "provincia_id": "0211"
    },
    {
        "id": "021103",
        "nombre": "CULEBRAS",
        "codigo": "021103",
        "provincia_id": "0211"
    },
    {
        "id": "021104",
        "nombre": "HUAYAN",
        "codigo": "021104",
        "provincia_id": "0211"
    },
    {
        "id": "021105",
        "nombre": "MALVAS",
        "codigo": "021105",
        "provincia_id": "0211"
    },
    {
        "id": "021201",
        "nombre": "CARAZ",
        "codigo": "021201",
        "provincia_id": "0212"
    },
    {
        "id": "021202",
        "nombre": "HUALLANCA",
        "codigo": "021202",
        "provincia_id": "0212"
    },
    {
        "id": "021203",
        "nombre": "HUATA",
        "codigo": "021203",
        "provincia_id": "0212"
    },
    {
        "id": "021204",
        "nombre": "HUAYLAS",
        "codigo": "021204",
        "provincia_id": "0212"
    },
    {
        "id": "021205",
        "nombre": "MATO",
        "codigo": "021205",
        "provincia_id": "0212"
    },
    {
        "id": "021206",
        "nombre": "PAMPAROMAS",
        "codigo": "021206",
        "provincia_id": "0212"
    },
    {
        "id": "021207",
        "nombre": "PUEBLO LIBRE",
        "codigo": "021207",
        "provincia_id": "0212"
    },
    {
        "id": "021208",
        "nombre": "SANTA CRUZ",
        "codigo": "021208",
        "provincia_id": "0212"
    },
    {
        "id": "021209",
        "nombre": "SANTO TORIBIO",
        "codigo": "021209",
        "provincia_id": "0212"
    },
    {
        "id": "021210",
        "nombre": "YURACMARCA",
        "codigo": "021210",
        "provincia_id": "0212"
    },
    {
        "id": "021301",
        "nombre": "PISCOBAMBA",
        "codigo": "021301",
        "provincia_id": "0213"
    },
    {
        "id": "021302",
        "nombre": "CASCA",
        "codigo": "021302",
        "provincia_id": "0213"
    },
    {
        "id": "021303",
        "nombre": "ELEAZAR GUZMAN BARRON",
        "codigo": "021303",
        "provincia_id": "0213"
    },
    {
        "id": "021304",
        "nombre": "FIDEL OLIVAS ESCUDERO",
        "codigo": "021304",
        "provincia_id": "0213"
    },
    {
        "id": "021305",
        "nombre": "LLAMA",
        "codigo": "021305",
        "provincia_id": "0213"
    },
    {
        "id": "021306",
        "nombre": "LLUMPA",
        "codigo": "021306",
        "provincia_id": "0213"
    },
    {
        "id": "021307",
        "nombre": "LUCMA",
        "codigo": "021307",
        "provincia_id": "0213"
    },
    {
        "id": "021308",
        "nombre": "MUSGA",
        "codigo": "021308",
        "provincia_id": "0213"
    },
    {
        "id": "021401",
        "nombre": "OCROS",
        "codigo": "021401",
        "provincia_id": "0214"
    },
    {
        "id": "021402",
        "nombre": "ACAS",
        "codigo": "021402",
        "provincia_id": "0214"
    },
    {
        "id": "021403",
        "nombre": "CAJAMARQUILLA",
        "codigo": "021403",
        "provincia_id": "0214"
    },
    {
        "id": "021404",
        "nombre": "CARHUAPAMPA",
        "codigo": "021404",
        "provincia_id": "0214"
    },
    {
        "id": "021405",
        "nombre": "COCHAS",
        "codigo": "021405",
        "provincia_id": "0214"
    },
    {
        "id": "021406",
        "nombre": "CONGAS",
        "codigo": "021406",
        "provincia_id": "0214"
    },
    {
        "id": "021407",
        "nombre": "LLIPA",
        "codigo": "021407",
        "provincia_id": "0214"
    },
    {
        "id": "021408",
        "nombre": "SAN CRISTOBAL DE RAJAN",
        "codigo": "021408",
        "provincia_id": "0214"
    },
    {
        "id": "021409",
        "nombre": "SAN PEDRO",
        "codigo": "021409",
        "provincia_id": "0214"
    },
    {
        "id": "021410",
        "nombre": "SANTIAGO DE CHILCAS",
        "codigo": "021410",
        "provincia_id": "0214"
    },
    {
        "id": "021501",
        "nombre": "CABANA",
        "codigo": "021501",
        "provincia_id": "0215"
    },
    {
        "id": "021502",
        "nombre": "BOLOGNESI",
        "codigo": "021502",
        "provincia_id": "0215"
    },
    {
        "id": "021503",
        "nombre": "CONCHUCOS",
        "codigo": "021503",
        "provincia_id": "0215"
    },
    {
        "id": "021504",
        "nombre": "HUACASCHUQUE",
        "codigo": "021504",
        "provincia_id": "0215"
    },
    {
        "id": "021505",
        "nombre": "HUANDOVAL",
        "codigo": "021505",
        "provincia_id": "0215"
    },
    {
        "id": "021506",
        "nombre": "LACABAMBA",
        "codigo": "021506",
        "provincia_id": "0215"
    },
    {
        "id": "021507",
        "nombre": "LLAPO",
        "codigo": "021507",
        "provincia_id": "0215"
    },
    {
        "id": "021508",
        "nombre": "PALLASCA",
        "codigo": "021508",
        "provincia_id": "0215"
    },
    {
        "id": "021509",
        "nombre": "PAMPAS",
        "codigo": "021509",
        "provincia_id": "0215"
    },
    {
        "id": "021510",
        "nombre": "SANTA ROSA",
        "codigo": "021510",
        "provincia_id": "0215"
    },
    {
        "id": "021511",
        "nombre": "TAUCA",
        "codigo": "021511",
        "provincia_id": "0215"
    },
    {
        "id": "021601",
        "nombre": "POMABAMBA",
        "codigo": "021601",
        "provincia_id": "0216"
    },
    {
        "id": "021602",
        "nombre": "HUAYLLAN",
        "codigo": "021602",
        "provincia_id": "0216"
    },
    {
        "id": "021603",
        "nombre": "PAROBAMBA",
        "codigo": "021603",
        "provincia_id": "0216"
    },
    {
        "id": "021604",
        "nombre": "QUINUABAMBA",
        "codigo": "021604",
        "provincia_id": "0216"
    },
    {
        "id": "021701",
        "nombre": "RECUAY",
        "codigo": "021701",
        "provincia_id": "0217"
    },
    {
        "id": "021702",
        "nombre": "CATAC",
        "codigo": "021702",
        "provincia_id": "0217"
    },
    {
        "id": "021703",
        "nombre": "COTAPARACO",
        "codigo": "021703",
        "provincia_id": "0217"
    },
    {
        "id": "021704",
        "nombre": "HUAYLLAPAMPA",
        "codigo": "021704",
        "provincia_id": "0217"
    },
    {
        "id": "021705",
        "nombre": "LLACLLIN",
        "codigo": "021705",
        "provincia_id": "0217"
    },
    {
        "id": "021706",
        "nombre": "MARCA",
        "codigo": "021706",
        "provincia_id": "0217"
    },
    {
        "id": "021707",
        "nombre": "PAMPAS CHICO",
        "codigo": "021707",
        "provincia_id": "0217"
    },
    {
        "id": "021708",
        "nombre": "PARARIN",
        "codigo": "021708",
        "provincia_id": "0217"
    },
    {
        "id": "021709",
        "nombre": "TAPACOCHA",
        "codigo": "021709",
        "provincia_id": "0217"
    },
    {
        "id": "021710",
        "nombre": "TICAPAMPA",
        "codigo": "021710",
        "provincia_id": "0217"
    },
    {
        "id": "021801",
        "nombre": "CHIMBOTE",
        "codigo": "021801",
        "provincia_id": "0218"
    },
    {
        "id": "021802",
        "nombre": "CACERES DEL PERU",
        "codigo": "021802",
        "provincia_id": "0218"
    },
    {
        "id": "021803",
        "nombre": "COISHCO",
        "codigo": "021803",
        "provincia_id": "0218"
    },
    {
        "id": "021804",
        "nombre": "MACATE",
        "codigo": "021804",
        "provincia_id": "0218"
    },
    {
        "id": "021805",
        "nombre": "MORO",
        "codigo": "021805",
        "provincia_id": "0218"
    },
    {
        "id": "021806",
        "nombre": "NEPEÑA",
        "codigo": "021806",
        "provincia_id": "0218"
    },
    {
        "id": "021807",
        "nombre": "SAMANCO",
        "codigo": "021807",
        "provincia_id": "0218"
    },
    {
        "id": "021808",
        "nombre": "SANTA",
        "codigo": "021808",
        "provincia_id": "0218"
    },
    {
        "id": "021809",
        "nombre": "NUEVO CHIMBOTE",
        "codigo": "021809",
        "provincia_id": "0218"
    },
    {
        "id": "021901",
        "nombre": "SIHUAS",
        "codigo": "021901",
        "provincia_id": "0219"
    },
    {
        "id": "021902",
        "nombre": "ACOBAMBA",
        "codigo": "021902",
        "provincia_id": "0219"
    },
    {
        "id": "021903",
        "nombre": "ALFONSO UGARTE",
        "codigo": "021903",
        "provincia_id": "0219"
    },
    {
        "id": "021904",
        "nombre": "CASHAPAMPA",
        "codigo": "021904",
        "provincia_id": "0219"
    },
    {
        "id": "021905",
        "nombre": "CHINGALPO",
        "codigo": "021905",
        "provincia_id": "0219"
    },
    {
        "id": "021906",
        "nombre": "HUAYLLABAMBA",
        "codigo": "021906",
        "provincia_id": "0219"
    },
    {
        "id": "021907",
        "nombre": "QUICHES",
        "codigo": "021907",
        "provincia_id": "0219"
    },
    {
        "id": "021908",
        "nombre": "RAGASH",
        "codigo": "021908",
        "provincia_id": "0219"
    },
    {
        "id": "021909",
        "nombre": "SAN JUAN",
        "codigo": "021909",
        "provincia_id": "0219"
    },
    {
        "id": "021910",
        "nombre": "SICSIBAMBA",
        "codigo": "021910",
        "provincia_id": "0219"
    },
    {
        "id": "022001",
        "nombre": "YUNGAY",
        "codigo": "022001",
        "provincia_id": "0220"
    },
    {
        "id": "022002",
        "nombre": "CASCAPARA",
        "codigo": "022002",
        "provincia_id": "0220"
    },
    {
        "id": "022003",
        "nombre": "MANCOS",
        "codigo": "022003",
        "provincia_id": "0220"
    },
    {
        "id": "022004",
        "nombre": "MATACOTO",
        "codigo": "022004",
        "provincia_id": "0220"
    },
    {
        "id": "022005",
        "nombre": "QUILLO",
        "codigo": "022005",
        "provincia_id": "0220"
    },
    {
        "id": "022006",
        "nombre": "RANRAHIRCA",
        "codigo": "022006",
        "provincia_id": "0220"
    },
    {
        "id": "022007",
        "nombre": "SHUPLUY",
        "codigo": "022007",
        "provincia_id": "0220"
    },
    {
        "id": "022008",
        "nombre": "YANAMA",
        "codigo": "022008",
        "provincia_id": "0220"
    },
    {
        "id": "030101",
        "nombre": "ABANCAY",
        "codigo": "030101",
        "provincia_id": "0301"
    },
    {
        "id": "030102",
        "nombre": "CHACOCHE",
        "codigo": "030102",
        "provincia_id": "0301"
    },
    {
        "id": "030103",
        "nombre": "CIRCA",
        "codigo": "030103",
        "provincia_id": "0301"
    },
    {
        "id": "030104",
        "nombre": "CURAHUASI",
        "codigo": "030104",
        "provincia_id": "0301"
    },
    {
        "id": "030105",
        "nombre": "HUANIPACA",
        "codigo": "030105",
        "provincia_id": "0301"
    },
    {
        "id": "030106",
        "nombre": "LAMBRAMA",
        "codigo": "030106",
        "provincia_id": "0301"
    },
    {
        "id": "030107",
        "nombre": "PICHIRHUA",
        "codigo": "030107",
        "provincia_id": "0301"
    },
    {
        "id": "030108",
        "nombre": "SAN PEDRO DE CACHORA",
        "codigo": "030108",
        "provincia_id": "0301"
    },
    {
        "id": "030109",
        "nombre": "TAMBURCO",
        "codigo": "030109",
        "provincia_id": "0301"
    },
    {
        "id": "030201",
        "nombre": "ANDAHUAYLAS",
        "codigo": "030201",
        "provincia_id": "0302"
    },
    {
        "id": "030202",
        "nombre": "ANDARAPA",
        "codigo": "030202",
        "provincia_id": "0302"
    },
    {
        "id": "030203",
        "nombre": "CHIARA",
        "codigo": "030203",
        "provincia_id": "0302"
    },
    {
        "id": "030204",
        "nombre": "HUANCARAMA",
        "codigo": "030204",
        "provincia_id": "0302"
    },
    {
        "id": "030205",
        "nombre": "HUANCARAY",
        "codigo": "030205",
        "provincia_id": "0302"
    },
    {
        "id": "030206",
        "nombre": "HUAYANA",
        "codigo": "030206",
        "provincia_id": "0302"
    },
    {
        "id": "030207",
        "nombre": "KISHUARA",
        "codigo": "030207",
        "provincia_id": "0302"
    },
    {
        "id": "030208",
        "nombre": "PACOBAMBA",
        "codigo": "030208",
        "provincia_id": "0302"
    },
    {
        "id": "030209",
        "nombre": "PACUCHA",
        "codigo": "030209",
        "provincia_id": "0302"
    },
    {
        "id": "030210",
        "nombre": "PAMPACHIRI",
        "codigo": "030210",
        "provincia_id": "0302"
    },
    {
        "id": "030211",
        "nombre": "POMACOCHA",
        "codigo": "030211",
        "provincia_id": "0302"
    },
    {
        "id": "030212",
        "nombre": "SAN ANTONIO DE CACHI",
        "codigo": "030212",
        "provincia_id": "0302"
    },
    {
        "id": "030213",
        "nombre": "SAN JERONIMO",
        "codigo": "030213",
        "provincia_id": "0302"
    },
    {
        "id": "030214",
        "nombre": "SAN MIGUEL DE CHACCRAMPA",
        "codigo": "030214",
        "provincia_id": "0302"
    },
    {
        "id": "030215",
        "nombre": "SANTA MARIA DE CHICMO",
        "codigo": "030215",
        "provincia_id": "0302"
    },
    {
        "id": "030216",
        "nombre": "TALAVERA",
        "codigo": "030216",
        "provincia_id": "0302"
    },
    {
        "id": "030217",
        "nombre": "TUMAY HUARACA",
        "codigo": "030217",
        "provincia_id": "0302"
    },
    {
        "id": "030218",
        "nombre": "TURPO",
        "codigo": "030218",
        "provincia_id": "0302"
    },
    {
        "id": "030219",
        "nombre": "KAQUIABAMBA",
        "codigo": "030219",
        "provincia_id": "0302"
    },
    {
        "id": "030220",
        "nombre": "JOSE MARIA ARGUEDAS",
        "codigo": "030220",
        "provincia_id": "0302"
    },
    {
        "id": "030301",
        "nombre": "ANTABAMBA",
        "codigo": "030301",
        "provincia_id": "0303"
    },
    {
        "id": "030302",
        "nombre": "EL ORO",
        "codigo": "030302",
        "provincia_id": "0303"
    },
    {
        "id": "030303",
        "nombre": "HUAQUIRCA",
        "codigo": "030303",
        "provincia_id": "0303"
    },
    {
        "id": "030304",
        "nombre": "JUAN ESPINOZA MEDRANO",
        "codigo": "030304",
        "provincia_id": "0303"
    },
    {
        "id": "030305",
        "nombre": "OROPESA",
        "codigo": "030305",
        "provincia_id": "0303"
    },
    {
        "id": "030306",
        "nombre": "PACHACONAS",
        "codigo": "030306",
        "provincia_id": "0303"
    },
    {
        "id": "030307",
        "nombre": "SABAINO",
        "codigo": "030307",
        "provincia_id": "0303"
    },
    {
        "id": "030401",
        "nombre": "CHALHUANCA",
        "codigo": "030401",
        "provincia_id": "0304"
    },
    {
        "id": "030402",
        "nombre": "CAPAYA",
        "codigo": "030402",
        "provincia_id": "0304"
    },
    {
        "id": "030403",
        "nombre": "CARAYBAMBA",
        "codigo": "030403",
        "provincia_id": "0304"
    },
    {
        "id": "030404",
        "nombre": "CHAPIMARCA",
        "codigo": "030404",
        "provincia_id": "0304"
    },
    {
        "id": "030405",
        "nombre": "COLCABAMBA",
        "codigo": "030405",
        "provincia_id": "0304"
    },
    {
        "id": "030406",
        "nombre": "COTARUSE",
        "codigo": "030406",
        "provincia_id": "0304"
    },
    {
        "id": "030407",
        "nombre": "HUAYLLO",
        "codigo": "030407",
        "provincia_id": "0304"
    },
    {
        "id": "030408",
        "nombre": "JUSTO APU SAHUARAURA",
        "codigo": "030408",
        "provincia_id": "0304"
    },
    {
        "id": "030409",
        "nombre": "LUCRE",
        "codigo": "030409",
        "provincia_id": "0304"
    },
    {
        "id": "030410",
        "nombre": "POCOHUANCA",
        "codigo": "030410",
        "provincia_id": "0304"
    },
    {
        "id": "030411",
        "nombre": "SAN JUAN DE CHACÑA",
        "codigo": "030411",
        "provincia_id": "0304"
    },
    {
        "id": "030412",
        "nombre": "SAÑAYCA",
        "codigo": "030412",
        "provincia_id": "0304"
    },
    {
        "id": "030413",
        "nombre": "SORAYA",
        "codigo": "030413",
        "provincia_id": "0304"
    },
    {
        "id": "030414",
        "nombre": "TAPAIRIHUA",
        "codigo": "030414",
        "provincia_id": "0304"
    },
    {
        "id": "030415",
        "nombre": "TINTAY",
        "codigo": "030415",
        "provincia_id": "0304"
    },
    {
        "id": "030416",
        "nombre": "TORAYA",
        "codigo": "030416",
        "provincia_id": "0304"
    },
    {
        "id": "030417",
        "nombre": "YANACA",
        "codigo": "030417",
        "provincia_id": "0304"
    },
    {
        "id": "030501",
        "nombre": "TAMBOBAMBA",
        "codigo": "030501",
        "provincia_id": "0305"
    },
    {
        "id": "030502",
        "nombre": "COTABAMBAS",
        "codigo": "030502",
        "provincia_id": "0305"
    },
    {
        "id": "030503",
        "nombre": "COYLLURQUI",
        "codigo": "030503",
        "provincia_id": "0305"
    },
    {
        "id": "030504",
        "nombre": "HAQUIRA",
        "codigo": "030504",
        "provincia_id": "0305"
    },
    {
        "id": "030505",
        "nombre": "MARA",
        "codigo": "030505",
        "provincia_id": "0305"
    },
    {
        "id": "030506",
        "nombre": "CHALLHUAHUACHO",
        "codigo": "030506",
        "provincia_id": "0305"
    },
    {
        "id": "030601",
        "nombre": "CHINCHEROS",
        "codigo": "030601",
        "provincia_id": "0306"
    },
    {
        "id": "030602",
        "nombre": "ANCO-HUALLO",
        "codigo": "030602",
        "provincia_id": "0306"
    },
    {
        "id": "030603",
        "nombre": "COCHARCAS",
        "codigo": "030603",
        "provincia_id": "0306"
    },
    {
        "id": "030604",
        "nombre": "HUACCANA",
        "codigo": "030604",
        "provincia_id": "0306"
    },
    {
        "id": "030605",
        "nombre": "OCOBAMBA",
        "codigo": "030605",
        "provincia_id": "0306"
    },
    {
        "id": "030606",
        "nombre": "ONGOY",
        "codigo": "030606",
        "provincia_id": "0306"
    },
    {
        "id": "030607",
        "nombre": "URANMARCA",
        "codigo": "030607",
        "provincia_id": "0306"
    },
    {
        "id": "030608",
        "nombre": "RANRACANCHA",
        "codigo": "030608",
        "provincia_id": "0306"
    },
    {
        "id": "030609",
        "nombre": "ROCCHACC",
        "codigo": "030609",
        "provincia_id": "0306"
    },
    {
        "id": "030610",
        "nombre": "EL PORVENIR",
        "codigo": "030610",
        "provincia_id": "0306"
    },
    {
        "id": "030611",
        "nombre": "LOS CHANKAS",
        "codigo": "030611",
        "provincia_id": "0306"
    },
    {
        "id": "030612",
        "nombre": "AHUAYRO",
        "codigo": "030612",
        "provincia_id": "0306"
    },
    {
        "id": "030701",
        "nombre": "CHUQUIBAMBILLA",
        "codigo": "030701",
        "provincia_id": "0307"
    },
    {
        "id": "030702",
        "nombre": "CURPAHUASI",
        "codigo": "030702",
        "provincia_id": "0307"
    },
    {
        "id": "030703",
        "nombre": "GAMARRA",
        "codigo": "030703",
        "provincia_id": "0307"
    },
    {
        "id": "030704",
        "nombre": "HUAYLLATI",
        "codigo": "030704",
        "provincia_id": "0307"
    },
    {
        "id": "030705",
        "nombre": "MAMARA",
        "codigo": "030705",
        "provincia_id": "0307"
    },
    {
        "id": "030706",
        "nombre": "MICAELA BASTIDAS",
        "codigo": "030706",
        "provincia_id": "0307"
    },
    {
        "id": "030707",
        "nombre": "PATAYPAMPA",
        "codigo": "030707",
        "provincia_id": "0307"
    },
    {
        "id": "030708",
        "nombre": "PROGRESO",
        "codigo": "030708",
        "provincia_id": "0307"
    },
    {
        "id": "030709",
        "nombre": "SAN ANTONIO",
        "codigo": "030709",
        "provincia_id": "0307"
    },
    {
        "id": "030710",
        "nombre": "SANTA ROSA",
        "codigo": "030710",
        "provincia_id": "0307"
    },
    {
        "id": "030711",
        "nombre": "TURPAY",
        "codigo": "030711",
        "provincia_id": "0307"
    },
    {
        "id": "030712",
        "nombre": "VILCABAMBA",
        "codigo": "030712",
        "provincia_id": "0307"
    },
    {
        "id": "030713",
        "nombre": "VIRUNDO",
        "codigo": "030713",
        "provincia_id": "0307"
    },
    {
        "id": "030714",
        "nombre": "CURASCO",
        "codigo": "030714",
        "provincia_id": "0307"
    },
    {
        "id": "040101",
        "nombre": "AREQUIPA",
        "codigo": "040101",
        "provincia_id": "0401"
    },
    {
        "id": "040102",
        "nombre": "ALTO SELVA ALEGRE",
        "codigo": "040102",
        "provincia_id": "0401"
    },
    {
        "id": "040103",
        "nombre": "CAYMA",
        "codigo": "040103",
        "provincia_id": "0401"
    },
    {
        "id": "040104",
        "nombre": "CERRO COLORADO",
        "codigo": "040104",
        "provincia_id": "0401"
    },
    {
        "id": "040105",
        "nombre": "CHARACATO",
        "codigo": "040105",
        "provincia_id": "0401"
    },
    {
        "id": "040106",
        "nombre": "CHIGUATA",
        "codigo": "040106",
        "provincia_id": "0401"
    },
    {
        "id": "040107",
        "nombre": "JACOBO HUNTER",
        "codigo": "040107",
        "provincia_id": "0401"
    },
    {
        "id": "040108",
        "nombre": "LA JOYA",
        "codigo": "040108",
        "provincia_id": "0401"
    },
    {
        "id": "040109",
        "nombre": "MARIANO MELGAR",
        "codigo": "040109",
        "provincia_id": "0401"
    },
    {
        "id": "040110",
        "nombre": "MIRAFLORES",
        "codigo": "040110",
        "provincia_id": "0401"
    },
    {
        "id": "040111",
        "nombre": "MOLLEBAYA",
        "codigo": "040111",
        "provincia_id": "0401"
    },
    {
        "id": "040112",
        "nombre": "PAUCARPATA",
        "codigo": "040112",
        "provincia_id": "0401"
    },
    {
        "id": "040113",
        "nombre": "POCSI",
        "codigo": "040113",
        "provincia_id": "0401"
    },
    {
        "id": "040114",
        "nombre": "POLOBAYA",
        "codigo": "040114",
        "provincia_id": "0401"
    },
    {
        "id": "040115",
        "nombre": "QUEQUEÑA",
        "codigo": "040115",
        "provincia_id": "0401"
    },
    {
        "id": "040116",
        "nombre": "SABANDIA",
        "codigo": "040116",
        "provincia_id": "0401"
    },
    {
        "id": "040117",
        "nombre": "SACHACA",
        "codigo": "040117",
        "provincia_id": "0401"
    },
    {
        "id": "040118",
        "nombre": "SAN JUAN DE SIGUAS",
        "codigo": "040118",
        "provincia_id": "0401"
    },
    {
        "id": "040119",
        "nombre": "SAN JUAN DE TARUCANI",
        "codigo": "040119",
        "provincia_id": "0401"
    },
    {
        "id": "040120",
        "nombre": "SANTA ISABEL DE SIGUAS",
        "codigo": "040120",
        "provincia_id": "0401"
    },
    {
        "id": "040121",
        "nombre": "SANTA RITA DE SIGUAS",
        "codigo": "040121",
        "provincia_id": "0401"
    },
    {
        "id": "040122",
        "nombre": "SOCABAYA",
        "codigo": "040122",
        "provincia_id": "0401"
    },
    {
        "id": "040123",
        "nombre": "TIABAYA",
        "codigo": "040123",
        "provincia_id": "0401"
    },
    {
        "id": "040124",
        "nombre": "UCHUMAYO",
        "codigo": "040124",
        "provincia_id": "0401"
    },
    {
        "id": "040125",
        "nombre": "VITOR",
        "codigo": "040125",
        "provincia_id": "0401"
    },
    {
        "id": "040126",
        "nombre": "YANAHUARA",
        "codigo": "040126",
        "provincia_id": "0401"
    },
    {
        "id": "040127",
        "nombre": "YARABAMBA",
        "codigo": "040127",
        "provincia_id": "0401"
    },
    {
        "id": "040128",
        "nombre": "YURA",
        "codigo": "040128",
        "provincia_id": "0401"
    },
    {
        "id": "040129",
        "nombre": "JOSE LUIS BUSTAMANTE Y RIVERO",
        "codigo": "040129",
        "provincia_id": "0401"
    },
    {
        "id": "040201",
        "nombre": "CAMANA",
        "codigo": "040201",
        "provincia_id": "0402"
    },
    {
        "id": "040202",
        "nombre": "JOSE MARIA QUIMPER",
        "codigo": "040202",
        "provincia_id": "0402"
    },
    {
        "id": "040203",
        "nombre": "MARIANO NICOLAS VALCARCEL",
        "codigo": "040203",
        "provincia_id": "0402"
    },
    {
        "id": "040204",
        "nombre": "MARISCAL CACERES",
        "codigo": "040204",
        "provincia_id": "0402"
    },
    {
        "id": "040205",
        "nombre": "NICOLAS DE PIEROLA",
        "codigo": "040205",
        "provincia_id": "0402"
    },
    {
        "id": "040206",
        "nombre": "OCOÑA",
        "codigo": "040206",
        "provincia_id": "0402"
    },
    {
        "id": "040207",
        "nombre": "QUILCA",
        "codigo": "040207",
        "provincia_id": "0402"
    },
    {
        "id": "040208",
        "nombre": "SAMUEL PASTOR",
        "codigo": "040208",
        "provincia_id": "0402"
    },
    {
        "id": "040301",
        "nombre": "CARAVELI",
        "codigo": "040301",
        "provincia_id": "0403"
    },
    {
        "id": "040302",
        "nombre": "ACARI",
        "codigo": "040302",
        "provincia_id": "0403"
    },
    {
        "id": "040303",
        "nombre": "ATICO",
        "codigo": "040303",
        "provincia_id": "0403"
    },
    {
        "id": "040304",
        "nombre": "ATIQUIPA",
        "codigo": "040304",
        "provincia_id": "0403"
    },
    {
        "id": "040305",
        "nombre": "BELLA UNION",
        "codigo": "040305",
        "provincia_id": "0403"
    },
    {
        "id": "040306",
        "nombre": "CAHUACHO",
        "codigo": "040306",
        "provincia_id": "0403"
    },
    {
        "id": "040307",
        "nombre": "CHALA",
        "codigo": "040307",
        "provincia_id": "0403"
    },
    {
        "id": "040308",
        "nombre": "CHAPARRA",
        "codigo": "040308",
        "provincia_id": "0403"
    },
    {
        "id": "040309",
        "nombre": "HUANUHUANU",
        "codigo": "040309",
        "provincia_id": "0403"
    },
    {
        "id": "040310",
        "nombre": "JAQUI",
        "codigo": "040310",
        "provincia_id": "0403"
    },
    {
        "id": "040311",
        "nombre": "LOMAS",
        "codigo": "040311",
        "provincia_id": "0403"
    },
    {
        "id": "040312",
        "nombre": "QUICACHA",
        "codigo": "040312",
        "provincia_id": "0403"
    },
    {
        "id": "040313",
        "nombre": "YAUCA",
        "codigo": "040313",
        "provincia_id": "0403"
    },
    {
        "id": "040401",
        "nombre": "APLAO",
        "codigo": "040401",
        "provincia_id": "0404"
    },
    {
        "id": "040402",
        "nombre": "ANDAGUA",
        "codigo": "040402",
        "provincia_id": "0404"
    },
    {
        "id": "040403",
        "nombre": "AYO",
        "codigo": "040403",
        "provincia_id": "0404"
    },
    {
        "id": "040404",
        "nombre": "CHACHAS",
        "codigo": "040404",
        "provincia_id": "0404"
    },
    {
        "id": "040405",
        "nombre": "CHILCAYMARCA",
        "codigo": "040405",
        "provincia_id": "0404"
    },
    {
        "id": "040406",
        "nombre": "CHOCO",
        "codigo": "040406",
        "provincia_id": "0404"
    },
    {
        "id": "040407",
        "nombre": "HUANCARQUI",
        "codigo": "040407",
        "provincia_id": "0404"
    },
    {
        "id": "040408",
        "nombre": "MACHAGUAY",
        "codigo": "040408",
        "provincia_id": "0404"
    },
    {
        "id": "040409",
        "nombre": "ORCOPAMPA",
        "codigo": "040409",
        "provincia_id": "0404"
    },
    {
        "id": "040410",
        "nombre": "PAMPACOLCA",
        "codigo": "040410",
        "provincia_id": "0404"
    },
    {
        "id": "040411",
        "nombre": "TIPAN",
        "codigo": "040411",
        "provincia_id": "0404"
    },
    {
        "id": "040412",
        "nombre": "UÑON",
        "codigo": "040412",
        "provincia_id": "0404"
    },
    {
        "id": "040413",
        "nombre": "URACA",
        "codigo": "040413",
        "provincia_id": "0404"
    },
    {
        "id": "040414",
        "nombre": "VIRACO",
        "codigo": "040414",
        "provincia_id": "0404"
    },
    {
        "id": "040501",
        "nombre": "CHIVAY",
        "codigo": "040501",
        "provincia_id": "0405"
    },
    {
        "id": "040502",
        "nombre": "ACHOMA",
        "codigo": "040502",
        "provincia_id": "0405"
    },
    {
        "id": "040503",
        "nombre": "CABANACONDE",
        "codigo": "040503",
        "provincia_id": "0405"
    },
    {
        "id": "040504",
        "nombre": "CALLALLI",
        "codigo": "040504",
        "provincia_id": "0405"
    },
    {
        "id": "040505",
        "nombre": "CAYLLOMA",
        "codigo": "040505",
        "provincia_id": "0405"
    },
    {
        "id": "040506",
        "nombre": "COPORAQUE",
        "codigo": "040506",
        "provincia_id": "0405"
    },
    {
        "id": "040507",
        "nombre": "HUAMBO",
        "codigo": "040507",
        "provincia_id": "0405"
    },
    {
        "id": "040508",
        "nombre": "HUANCA",
        "codigo": "040508",
        "provincia_id": "0405"
    },
    {
        "id": "040509",
        "nombre": "ICHUPAMPA",
        "codigo": "040509",
        "provincia_id": "0405"
    },
    {
        "id": "040510",
        "nombre": "LARI",
        "codigo": "040510",
        "provincia_id": "0405"
    },
    {
        "id": "040511",
        "nombre": "LLUTA",
        "codigo": "040511",
        "provincia_id": "0405"
    },
    {
        "id": "040512",
        "nombre": "MACA",
        "codigo": "040512",
        "provincia_id": "0405"
    },
    {
        "id": "040513",
        "nombre": "MADRIGAL",
        "codigo": "040513",
        "provincia_id": "0405"
    },
    {
        "id": "040514",
        "nombre": "SAN ANTONIO DE CHUCA",
        "codigo": "040514",
        "provincia_id": "0405"
    },
    {
        "id": "040515",
        "nombre": "SIBAYO",
        "codigo": "040515",
        "provincia_id": "0405"
    },
    {
        "id": "040516",
        "nombre": "TAPAY",
        "codigo": "040516",
        "provincia_id": "0405"
    },
    {
        "id": "040517",
        "nombre": "TISCO",
        "codigo": "040517",
        "provincia_id": "0405"
    },
    {
        "id": "040518",
        "nombre": "TUTI",
        "codigo": "040518",
        "provincia_id": "0405"
    },
    {
        "id": "040519",
        "nombre": "YANQUE",
        "codigo": "040519",
        "provincia_id": "0405"
    },
    {
        "id": "040520",
        "nombre": "MAJES",
        "codigo": "040520",
        "provincia_id": "0405"
    },
    {
        "id": "040601",
        "nombre": "CHUQUIBAMBA",
        "codigo": "040601",
        "provincia_id": "0406"
    },
    {
        "id": "040602",
        "nombre": "ANDARAY",
        "codigo": "040602",
        "provincia_id": "0406"
    },
    {
        "id": "040603",
        "nombre": "CAYARANI",
        "codigo": "040603",
        "provincia_id": "0406"
    },
    {
        "id": "040604",
        "nombre": "CHICHAS",
        "codigo": "040604",
        "provincia_id": "0406"
    },
    {
        "id": "040605",
        "nombre": "IRAY",
        "codigo": "040605",
        "provincia_id": "0406"
    },
    {
        "id": "040606",
        "nombre": "RIO GRANDE",
        "codigo": "040606",
        "provincia_id": "0406"
    },
    {
        "id": "040607",
        "nombre": "SALAMANCA",
        "codigo": "040607",
        "provincia_id": "0406"
    },
    {
        "id": "040608",
        "nombre": "YANAQUIHUA",
        "codigo": "040608",
        "provincia_id": "0406"
    },
    {
        "id": "040701",
        "nombre": "MOLLENDO",
        "codigo": "040701",
        "provincia_id": "0407"
    },
    {
        "id": "040702",
        "nombre": "COCACHACRA",
        "codigo": "040702",
        "provincia_id": "0407"
    },
    {
        "id": "040703",
        "nombre": "DEAN VALDIVIA",
        "codigo": "040703",
        "provincia_id": "0407"
    },
    {
        "id": "040704",
        "nombre": "ISLAY",
        "codigo": "040704",
        "provincia_id": "0407"
    },
    {
        "id": "040705",
        "nombre": "MEJIA",
        "codigo": "040705",
        "provincia_id": "0407"
    },
    {
        "id": "040706",
        "nombre": "PUNTA DE BOMBON",
        "codigo": "040706",
        "provincia_id": "0407"
    },
    {
        "id": "040801",
        "nombre": "COTAHUASI",
        "codigo": "040801",
        "provincia_id": "0408"
    },
    {
        "id": "040802",
        "nombre": "ALCA",
        "codigo": "040802",
        "provincia_id": "0408"
    },
    {
        "id": "040803",
        "nombre": "CHARCANA",
        "codigo": "040803",
        "provincia_id": "0408"
    },
    {
        "id": "040804",
        "nombre": "HUAYNACOTAS",
        "codigo": "040804",
        "provincia_id": "0408"
    },
    {
        "id": "040805",
        "nombre": "PAMPAMARCA",
        "codigo": "040805",
        "provincia_id": "0408"
    },
    {
        "id": "040806",
        "nombre": "PUYCA",
        "codigo": "040806",
        "provincia_id": "0408"
    },
    {
        "id": "040807",
        "nombre": "QUECHUALLA",
        "codigo": "040807",
        "provincia_id": "0408"
    },
    {
        "id": "040808",
        "nombre": "SAYLA",
        "codigo": "040808",
        "provincia_id": "0408"
    },
    {
        "id": "040809",
        "nombre": "TAURIA",
        "codigo": "040809",
        "provincia_id": "0408"
    },
    {
        "id": "040810",
        "nombre": "TOMEPAMPA",
        "codigo": "040810",
        "provincia_id": "0408"
    },
    {
        "id": "040811",
        "nombre": "TORO",
        "codigo": "040811",
        "provincia_id": "0408"
    },
    {
        "id": "050101",
        "nombre": "AYACUCHO",
        "codigo": "050101",
        "provincia_id": "0501"
    },
    {
        "id": "050102",
        "nombre": "ACOCRO",
        "codigo": "050102",
        "provincia_id": "0501"
    },
    {
        "id": "050103",
        "nombre": "ACOS VINCHOS",
        "codigo": "050103",
        "provincia_id": "0501"
    },
    {
        "id": "050104",
        "nombre": "CARMEN ALTO",
        "codigo": "050104",
        "provincia_id": "0501"
    },
    {
        "id": "050105",
        "nombre": "CHIARA",
        "codigo": "050105",
        "provincia_id": "0501"
    },
    {
        "id": "050106",
        "nombre": "OCROS",
        "codigo": "050106",
        "provincia_id": "0501"
    },
    {
        "id": "050107",
        "nombre": "PACAYCASA",
        "codigo": "050107",
        "provincia_id": "0501"
    },
    {
        "id": "050108",
        "nombre": "QUINUA",
        "codigo": "050108",
        "provincia_id": "0501"
    },
    {
        "id": "050109",
        "nombre": "SAN JOSE DE TICLLAS",
        "codigo": "050109",
        "provincia_id": "0501"
    },
    {
        "id": "050110",
        "nombre": "SAN JUAN BAUTISTA",
        "codigo": "050110",
        "provincia_id": "0501"
    },
    {
        "id": "050111",
        "nombre": "SANTIAGO DE PISCHA",
        "codigo": "050111",
        "provincia_id": "0501"
    },
    {
        "id": "050112",
        "nombre": "SOCOS",
        "codigo": "050112",
        "provincia_id": "0501"
    },
    {
        "id": "050113",
        "nombre": "TAMBILLO",
        "codigo": "050113",
        "provincia_id": "0501"
    },
    {
        "id": "050114",
        "nombre": "VINCHOS",
        "codigo": "050114",
        "provincia_id": "0501"
    },
    {
        "id": "050115",
        "nombre": "JESUS NAZARENO",
        "codigo": "050115",
        "provincia_id": "0501"
    },
    {
        "id": "050116",
        "nombre": "ANDRES AVELINO CACERES DORREGARAY",
        "codigo": "050116",
        "provincia_id": "0501"
    },
    {
        "id": "050201",
        "nombre": "CANGALLO",
        "codigo": "050201",
        "provincia_id": "0502"
    },
    {
        "id": "050202",
        "nombre": "CHUSCHI",
        "codigo": "050202",
        "provincia_id": "0502"
    },
    {
        "id": "050203",
        "nombre": "LOS MOROCHUCOS",
        "codigo": "050203",
        "provincia_id": "0502"
    },
    {
        "id": "050204",
        "nombre": "MARIA PARADO DE BELLIDO",
        "codigo": "050204",
        "provincia_id": "0502"
    },
    {
        "id": "050205",
        "nombre": "PARAS",
        "codigo": "050205",
        "provincia_id": "0502"
    },
    {
        "id": "050206",
        "nombre": "TOTOS",
        "codigo": "050206",
        "provincia_id": "0502"
    },
    {
        "id": "050301",
        "nombre": "SANCOS",
        "codigo": "050301",
        "provincia_id": "0503"
    },
    {
        "id": "050302",
        "nombre": "CARAPO",
        "codigo": "050302",
        "provincia_id": "0503"
    },
    {
        "id": "050303",
        "nombre": "SACSAMARCA",
        "codigo": "050303",
        "provincia_id": "0503"
    },
    {
        "id": "050304",
        "nombre": "SANTIAGO DE LUCANAMARCA",
        "codigo": "050304",
        "provincia_id": "0503"
    },
    {
        "id": "050401",
        "nombre": "HUANTA",
        "codigo": "050401",
        "provincia_id": "0504"
    },
    {
        "id": "050402",
        "nombre": "AYAHUANCO",
        "codigo": "050402",
        "provincia_id": "0504"
    },
    {
        "id": "050403",
        "nombre": "HUAMANGUILLA",
        "codigo": "050403",
        "provincia_id": "0504"
    },
    {
        "id": "050404",
        "nombre": "IGUAIN",
        "codigo": "050404",
        "provincia_id": "0504"
    },
    {
        "id": "050405",
        "nombre": "LURICOCHA",
        "codigo": "050405",
        "provincia_id": "0504"
    },
    {
        "id": "050406",
        "nombre": "SANTILLANA",
        "codigo": "050406",
        "provincia_id": "0504"
    },
    {
        "id": "050407",
        "nombre": "SIVIA",
        "codigo": "050407",
        "provincia_id": "0504"
    },
    {
        "id": "050408",
        "nombre": "LLOCHEGUA",
        "codigo": "050408",
        "provincia_id": "0504"
    },
    {
        "id": "050409",
        "nombre": "CANAYRE",
        "codigo": "050409",
        "provincia_id": "0504"
    },
    {
        "id": "050410",
        "nombre": "UCHURACCAY",
        "codigo": "050410",
        "provincia_id": "0504"
    },
    {
        "id": "050411",
        "nombre": "PUCACOLPA",
        "codigo": "050411",
        "provincia_id": "0504"
    },
    {
        "id": "050412",
        "nombre": "CHACA",
        "codigo": "050412",
        "provincia_id": "0504"
    },
    {
        "id": "050413",
        "nombre": "PUTIS",
        "codigo": "050413",
        "provincia_id": "0504"
    },
    {
        "id": "050501",
        "nombre": "SAN MIGUEL",
        "codigo": "050501",
        "provincia_id": "0505"
    },
    {
        "id": "050502",
        "nombre": "ANCO",
        "codigo": "050502",
        "provincia_id": "0505"
    },
    {
        "id": "050503",
        "nombre": "AYNA",
        "codigo": "050503",
        "provincia_id": "0505"
    },
    {
        "id": "050504",
        "nombre": "CHILCAS",
        "codigo": "050504",
        "provincia_id": "0505"
    },
    {
        "id": "050505",
        "nombre": "CHUNGUI",
        "codigo": "050505",
        "provincia_id": "0505"
    },
    {
        "id": "050506",
        "nombre": "LUIS CARRANZA",
        "codigo": "050506",
        "provincia_id": "0505"
    },
    {
        "id": "050507",
        "nombre": "SANTA ROSA",
        "codigo": "050507",
        "provincia_id": "0505"
    },
    {
        "id": "050508",
        "nombre": "TAMBO",
        "codigo": "050508",
        "provincia_id": "0505"
    },
    {
        "id": "050509",
        "nombre": "SAMUGARI",
        "codigo": "050509",
        "provincia_id": "0505"
    },
    {
        "id": "050510",
        "nombre": "ANCHIHUAY",
        "codigo": "050510",
        "provincia_id": "0505"
    },
    {
        "id": "050511",
        "nombre": "ORONCCOY",
        "codigo": "050511",
        "provincia_id": "0505"
    },
    {
        "id": "050512",
        "nombre": "UNION PROGRESO",
        "codigo": "050512",
        "provincia_id": "0505"
    },
    {
        "id": "050513",
        "nombre": "RIO MAGDALENA",
        "codigo": "050513",
        "provincia_id": "0505"
    },
    {
        "id": "050514",
        "nombre": "NINABAMBA",
        "codigo": "050514",
        "provincia_id": "0505"
    },
    {
        "id": "050515",
        "nombre": "PATIBAMBA",
        "codigo": "050515",
        "provincia_id": "0505"
    },
    {
        "id": "050601",
        "nombre": "PUQUIO",
        "codigo": "050601",
        "provincia_id": "0506"
    },
    {
        "id": "050602",
        "nombre": "AUCARA",
        "codigo": "050602",
        "provincia_id": "0506"
    },
    {
        "id": "050603",
        "nombre": "CABANA",
        "codigo": "050603",
        "provincia_id": "0506"
    },
    {
        "id": "050604",
        "nombre": "CARMEN SALCEDO",
        "codigo": "050604",
        "provincia_id": "0506"
    },
    {
        "id": "050605",
        "nombre": "CHAVIÑA",
        "codigo": "050605",
        "provincia_id": "0506"
    },
    {
        "id": "050606",
        "nombre": "CHIPAO",
        "codigo": "050606",
        "provincia_id": "0506"
    },
    {
        "id": "050607",
        "nombre": "HUAC-HUAS",
        "codigo": "050607",
        "provincia_id": "0506"
    },
    {
        "id": "050608",
        "nombre": "LARAMATE",
        "codigo": "050608",
        "provincia_id": "0506"
    },
    {
        "id": "050609",
        "nombre": "LEONCIO PRADO",
        "codigo": "050609",
        "provincia_id": "0506"
    },
    {
        "id": "050610",
        "nombre": "LLAUTA",
        "codigo": "050610",
        "provincia_id": "0506"
    },
    {
        "id": "050611",
        "nombre": "LUCANAS",
        "codigo": "050611",
        "provincia_id": "0506"
    },
    {
        "id": "050612",
        "nombre": "OCAÑA",
        "codigo": "050612",
        "provincia_id": "0506"
    },
    {
        "id": "050613",
        "nombre": "OTOCA",
        "codigo": "050613",
        "provincia_id": "0506"
    },
    {
        "id": "050614",
        "nombre": "SAISA",
        "codigo": "050614",
        "provincia_id": "0506"
    },
    {
        "id": "050615",
        "nombre": "SAN CRISTOBAL",
        "codigo": "050615",
        "provincia_id": "0506"
    },
    {
        "id": "050616",
        "nombre": "SAN JUAN",
        "codigo": "050616",
        "provincia_id": "0506"
    },
    {
        "id": "050617",
        "nombre": "SAN PEDRO",
        "codigo": "050617",
        "provincia_id": "0506"
    },
    {
        "id": "050618",
        "nombre": "SAN PEDRO DE PALCO",
        "codigo": "050618",
        "provincia_id": "0506"
    },
    {
        "id": "050619",
        "nombre": "SANCOS",
        "codigo": "050619",
        "provincia_id": "0506"
    },
    {
        "id": "050620",
        "nombre": "SANTA ANA DE HUAYCAHUACHO",
        "codigo": "050620",
        "provincia_id": "0506"
    },
    {
        "id": "050621",
        "nombre": "SANTA LUCIA",
        "codigo": "050621",
        "provincia_id": "0506"
    },
    {
        "id": "050701",
        "nombre": "CORACORA",
        "codigo": "050701",
        "provincia_id": "0507"
    },
    {
        "id": "050702",
        "nombre": "CHUMPI",
        "codigo": "050702",
        "provincia_id": "0507"
    },
    {
        "id": "050703",
        "nombre": "CORONEL CASTAÑEDA",
        "codigo": "050703",
        "provincia_id": "0507"
    },
    {
        "id": "050704",
        "nombre": "PACAPAUSA",
        "codigo": "050704",
        "provincia_id": "0507"
    },
    {
        "id": "050705",
        "nombre": "PULLO",
        "codigo": "050705",
        "provincia_id": "0507"
    },
    {
        "id": "050706",
        "nombre": "PUYUSCA",
        "codigo": "050706",
        "provincia_id": "0507"
    },
    {
        "id": "050707",
        "nombre": "SAN FRANCISCO DE RAVACAYCO",
        "codigo": "050707",
        "provincia_id": "0507"
    },
    {
        "id": "050708",
        "nombre": "UPAHUACHO",
        "codigo": "050708",
        "provincia_id": "0507"
    },
    {
        "id": "050801",
        "nombre": "PAUSA",
        "codigo": "050801",
        "provincia_id": "0508"
    },
    {
        "id": "050802",
        "nombre": "COLTA",
        "codigo": "050802",
        "provincia_id": "0508"
    },
    {
        "id": "050803",
        "nombre": "CORCULLA",
        "codigo": "050803",
        "provincia_id": "0508"
    },
    {
        "id": "050804",
        "nombre": "LAMPA",
        "codigo": "050804",
        "provincia_id": "0508"
    },
    {
        "id": "050805",
        "nombre": "MARCABAMBA",
        "codigo": "050805",
        "provincia_id": "0508"
    },
    {
        "id": "050806",
        "nombre": "OYOLO",
        "codigo": "050806",
        "provincia_id": "0508"
    },
    {
        "id": "050807",
        "nombre": "PARARCA",
        "codigo": "050807",
        "provincia_id": "0508"
    },
    {
        "id": "050808",
        "nombre": "SAN JAVIER DE ALPABAMBA",
        "codigo": "050808",
        "provincia_id": "0508"
    },
    {
        "id": "050809",
        "nombre": "SAN JOSE DE USHUA",
        "codigo": "050809",
        "provincia_id": "0508"
    },
    {
        "id": "050810",
        "nombre": "SARA SARA",
        "codigo": "050810",
        "provincia_id": "0508"
    },
    {
        "id": "050901",
        "nombre": "QUEROBAMBA",
        "codigo": "050901",
        "provincia_id": "0509"
    },
    {
        "id": "050902",
        "nombre": "BELEN",
        "codigo": "050902",
        "provincia_id": "0509"
    },
    {
        "id": "050903",
        "nombre": "CHALCOS",
        "codigo": "050903",
        "provincia_id": "0509"
    },
    {
        "id": "050904",
        "nombre": "CHILCAYOC",
        "codigo": "050904",
        "provincia_id": "0509"
    },
    {
        "id": "050905",
        "nombre": "HUACAÑA",
        "codigo": "050905",
        "provincia_id": "0509"
    },
    {
        "id": "050906",
        "nombre": "MORCOLLA",
        "codigo": "050906",
        "provincia_id": "0509"
    },
    {
        "id": "050907",
        "nombre": "PAICO",
        "codigo": "050907",
        "provincia_id": "0509"
    },
    {
        "id": "050908",
        "nombre": "SAN PEDRO DE LARCAY",
        "codigo": "050908",
        "provincia_id": "0509"
    },
    {
        "id": "050909",
        "nombre": "SAN SALVADOR DE QUIJE",
        "codigo": "050909",
        "provincia_id": "0509"
    },
    {
        "id": "050910",
        "nombre": "SANTIAGO DE PAUCARAY",
        "codigo": "050910",
        "provincia_id": "0509"
    },
    {
        "id": "050911",
        "nombre": "SORAS",
        "codigo": "050911",
        "provincia_id": "0509"
    },
    {
        "id": "051001",
        "nombre": "HUANCAPI",
        "codigo": "051001",
        "provincia_id": "0510"
    },
    {
        "id": "051002",
        "nombre": "ALCAMENCA",
        "codigo": "051002",
        "provincia_id": "0510"
    },
    {
        "id": "051003",
        "nombre": "APONGO",
        "codigo": "051003",
        "provincia_id": "0510"
    },
    {
        "id": "051004",
        "nombre": "ASQUIPATA",
        "codigo": "051004",
        "provincia_id": "0510"
    },
    {
        "id": "051005",
        "nombre": "CANARIA",
        "codigo": "051005",
        "provincia_id": "0510"
    },
    {
        "id": "051006",
        "nombre": "CAYARA",
        "codigo": "051006",
        "provincia_id": "0510"
    },
    {
        "id": "051007",
        "nombre": "COLCA",
        "codigo": "051007",
        "provincia_id": "0510"
    },
    {
        "id": "051008",
        "nombre": "HUAMANQUIQUIA",
        "codigo": "051008",
        "provincia_id": "0510"
    },
    {
        "id": "051009",
        "nombre": "HUANCARAYLLA",
        "codigo": "051009",
        "provincia_id": "0510"
    },
    {
        "id": "051010",
        "nombre": "HUAYA",
        "codigo": "051010",
        "provincia_id": "0510"
    },
    {
        "id": "051011",
        "nombre": "SARHUA",
        "codigo": "051011",
        "provincia_id": "0510"
    },
    {
        "id": "051012",
        "nombre": "VILCANCHOS",
        "codigo": "051012",
        "provincia_id": "0510"
    },
    {
        "id": "051101",
        "nombre": "VILCAS HUAMAN",
        "codigo": "051101",
        "provincia_id": "0511"
    },
    {
        "id": "051102",
        "nombre": "ACCOMARCA",
        "codigo": "051102",
        "provincia_id": "0511"
    },
    {
        "id": "051103",
        "nombre": "CARHUANCA",
        "codigo": "051103",
        "provincia_id": "0511"
    },
    {
        "id": "051104",
        "nombre": "CONCEPCION",
        "codigo": "051104",
        "provincia_id": "0511"
    },
    {
        "id": "051105",
        "nombre": "HUAMBALPA",
        "codigo": "051105",
        "provincia_id": "0511"
    },
    {
        "id": "051106",
        "nombre": "INDEPENDENCIA",
        "codigo": "051106",
        "provincia_id": "0511"
    },
    {
        "id": "051107",
        "nombre": "SAURAMA",
        "codigo": "051107",
        "provincia_id": "0511"
    },
    {
        "id": "051108",
        "nombre": "VISCHONGO",
        "codigo": "051108",
        "provincia_id": "0511"
    },
    {
        "id": "060101",
        "nombre": "CAJAMARCA",
        "codigo": "060101",
        "provincia_id": "0601"
    },
    {
        "id": "060102",
        "nombre": "ASUNCION",
        "codigo": "060102",
        "provincia_id": "0601"
    },
    {
        "id": "060103",
        "nombre": "CHETILLA",
        "codigo": "060103",
        "provincia_id": "0601"
    },
    {
        "id": "060104",
        "nombre": "COSPAN",
        "codigo": "060104",
        "provincia_id": "0601"
    },
    {
        "id": "060105",
        "nombre": "ENCAÑADA",
        "codigo": "060105",
        "provincia_id": "0601"
    },
    {
        "id": "060106",
        "nombre": "JESUS",
        "codigo": "060106",
        "provincia_id": "0601"
    },
    {
        "id": "060107",
        "nombre": "LLACANORA",
        "codigo": "060107",
        "provincia_id": "0601"
    },
    {
        "id": "060108",
        "nombre": "LOS BAÑOS DEL INCA",
        "codigo": "060108",
        "provincia_id": "0601"
    },
    {
        "id": "060109",
        "nombre": "MAGDALENA",
        "codigo": "060109",
        "provincia_id": "0601"
    },
    {
        "id": "060110",
        "nombre": "MATARA",
        "codigo": "060110",
        "provincia_id": "0601"
    },
    {
        "id": "060111",
        "nombre": "NAMORA",
        "codigo": "060111",
        "provincia_id": "0601"
    },
    {
        "id": "060112",
        "nombre": "SAN JUAN",
        "codigo": "060112",
        "provincia_id": "0601"
    },
    {
        "id": "060201",
        "nombre": "CAJABAMBA",
        "codigo": "060201",
        "provincia_id": "0602"
    },
    {
        "id": "060202",
        "nombre": "CACHACHI",
        "codigo": "060202",
        "provincia_id": "0602"
    },
    {
        "id": "060203",
        "nombre": "CONDEBAMBA",
        "codigo": "060203",
        "provincia_id": "0602"
    },
    {
        "id": "060204",
        "nombre": "SITACOCHA",
        "codigo": "060204",
        "provincia_id": "0602"
    },
    {
        "id": "060301",
        "nombre": "CELENDIN",
        "codigo": "060301",
        "provincia_id": "0603"
    },
    {
        "id": "060302",
        "nombre": "CHUMUCH",
        "codigo": "060302",
        "provincia_id": "0603"
    },
    {
        "id": "060303",
        "nombre": "CORTEGANA",
        "codigo": "060303",
        "provincia_id": "0603"
    },
    {
        "id": "060304",
        "nombre": "HUASMIN",
        "codigo": "060304",
        "provincia_id": "0603"
    },
    {
        "id": "060305",
        "nombre": "JORGE CHAVEZ",
        "codigo": "060305",
        "provincia_id": "0603"
    },
    {
        "id": "060306",
        "nombre": "JOSE GALVEZ",
        "codigo": "060306",
        "provincia_id": "0603"
    },
    {
        "id": "060307",
        "nombre": "MIGUEL IGLESIAS",
        "codigo": "060307",
        "provincia_id": "0603"
    },
    {
        "id": "060308",
        "nombre": "OXAMARCA",
        "codigo": "060308",
        "provincia_id": "0603"
    },
    {
        "id": "060309",
        "nombre": "SOROCHUCO",
        "codigo": "060309",
        "provincia_id": "0603"
    },
    {
        "id": "060310",
        "nombre": "SUCRE",
        "codigo": "060310",
        "provincia_id": "0603"
    },
    {
        "id": "060311",
        "nombre": "UTCO",
        "codigo": "060311",
        "provincia_id": "0603"
    },
    {
        "id": "060312",
        "nombre": "LA LIBERTAD DE PALLAN",
        "codigo": "060312",
        "provincia_id": "0603"
    },
    {
        "id": "060401",
        "nombre": "CHOTA",
        "codigo": "060401",
        "provincia_id": "0604"
    },
    {
        "id": "060402",
        "nombre": "ANGUIA",
        "codigo": "060402",
        "provincia_id": "0604"
    },
    {
        "id": "060403",
        "nombre": "CHADIN",
        "codigo": "060403",
        "provincia_id": "0604"
    },
    {
        "id": "060404",
        "nombre": "CHIGUIRIP",
        "codigo": "060404",
        "provincia_id": "0604"
    },
    {
        "id": "060405",
        "nombre": "CHIMBAN",
        "codigo": "060405",
        "provincia_id": "0604"
    },
    {
        "id": "060406",
        "nombre": "CHOROPAMPA",
        "codigo": "060406",
        "provincia_id": "0604"
    },
    {
        "id": "060407",
        "nombre": "COCHABAMBA",
        "codigo": "060407",
        "provincia_id": "0604"
    },
    {
        "id": "060408",
        "nombre": "CONCHAN",
        "codigo": "060408",
        "provincia_id": "0604"
    },
    {
        "id": "060409",
        "nombre": "HUAMBOS",
        "codigo": "060409",
        "provincia_id": "0604"
    },
    {
        "id": "060410",
        "nombre": "LAJAS",
        "codigo": "060410",
        "provincia_id": "0604"
    },
    {
        "id": "060411",
        "nombre": "LLAMA",
        "codigo": "060411",
        "provincia_id": "0604"
    },
    {
        "id": "060412",
        "nombre": "MIRACOSTA",
        "codigo": "060412",
        "provincia_id": "0604"
    },
    {
        "id": "060413",
        "nombre": "PACCHA",
        "codigo": "060413",
        "provincia_id": "0604"
    },
    {
        "id": "060414",
        "nombre": "PION",
        "codigo": "060414",
        "provincia_id": "0604"
    },
    {
        "id": "060415",
        "nombre": "QUEROCOTO",
        "codigo": "060415",
        "provincia_id": "0604"
    },
    {
        "id": "060416",
        "nombre": "SAN JUAN DE LICUPIS",
        "codigo": "060416",
        "provincia_id": "0604"
    },
    {
        "id": "060417",
        "nombre": "TACABAMBA",
        "codigo": "060417",
        "provincia_id": "0604"
    },
    {
        "id": "060418",
        "nombre": "TOCMOCHE",
        "codigo": "060418",
        "provincia_id": "0604"
    },
    {
        "id": "060419",
        "nombre": "CHALAMARCA",
        "codigo": "060419",
        "provincia_id": "0604"
    },
    {
        "id": "060501",
        "nombre": "CONTUMAZA",
        "codigo": "060501",
        "provincia_id": "0605"
    },
    {
        "id": "060502",
        "nombre": "CHILETE",
        "codigo": "060502",
        "provincia_id": "0605"
    },
    {
        "id": "060503",
        "nombre": "CUPISNIQUE",
        "codigo": "060503",
        "provincia_id": "0605"
    },
    {
        "id": "060504",
        "nombre": "GUZMANGO",
        "codigo": "060504",
        "provincia_id": "0605"
    },
    {
        "id": "060505",
        "nombre": "SAN BENITO",
        "codigo": "060505",
        "provincia_id": "0605"
    },
    {
        "id": "060506",
        "nombre": "SANTA CRUZ DE TOLEDO",
        "codigo": "060506",
        "provincia_id": "0605"
    },
    {
        "id": "060507",
        "nombre": "TANTARICA",
        "codigo": "060507",
        "provincia_id": "0605"
    },
    {
        "id": "060508",
        "nombre": "YONAN",
        "codigo": "060508",
        "provincia_id": "0605"
    },
    {
        "id": "060601",
        "nombre": "CUTERVO",
        "codigo": "060601",
        "provincia_id": "0606"
    },
    {
        "id": "060602",
        "nombre": "CALLAYUC",
        "codigo": "060602",
        "provincia_id": "0606"
    },
    {
        "id": "060603",
        "nombre": "CHOROS",
        "codigo": "060603",
        "provincia_id": "0606"
    },
    {
        "id": "060604",
        "nombre": "CUJILLO",
        "codigo": "060604",
        "provincia_id": "0606"
    },
    {
        "id": "060605",
        "nombre": "LA RAMADA",
        "codigo": "060605",
        "provincia_id": "0606"
    },
    {
        "id": "060606",
        "nombre": "PIMPINGOS",
        "codigo": "060606",
        "provincia_id": "0606"
    },
    {
        "id": "060607",
        "nombre": "QUEROCOTILLO",
        "codigo": "060607",
        "provincia_id": "0606"
    },
    {
        "id": "060608",
        "nombre": "SAN ANDRES DE CUTERVO",
        "codigo": "060608",
        "provincia_id": "0606"
    },
    {
        "id": "060609",
        "nombre": "SAN JUAN DE CUTERVO",
        "codigo": "060609",
        "provincia_id": "0606"
    },
    {
        "id": "060610",
        "nombre": "SAN LUIS DE LUCMA",
        "codigo": "060610",
        "provincia_id": "0606"
    },
    {
        "id": "060611",
        "nombre": "SANTA CRUZ",
        "codigo": "060611",
        "provincia_id": "0606"
    },
    {
        "id": "060612",
        "nombre": "SANTO DOMINGO DE LA CAPILLA",
        "codigo": "060612",
        "provincia_id": "0606"
    },
    {
        "id": "060613",
        "nombre": "SANTO TOMAS",
        "codigo": "060613",
        "provincia_id": "0606"
    },
    {
        "id": "060614",
        "nombre": "SOCOTA",
        "codigo": "060614",
        "provincia_id": "0606"
    },
    {
        "id": "060615",
        "nombre": "TORIBIO CASANOVA",
        "codigo": "060615",
        "provincia_id": "0606"
    },
    {
        "id": "060701",
        "nombre": "BAMBAMARCA",
        "codigo": "060701",
        "provincia_id": "0607"
    },
    {
        "id": "060702",
        "nombre": "CHUGUR",
        "codigo": "060702",
        "provincia_id": "0607"
    },
    {
        "id": "060703",
        "nombre": "HUALGAYOC",
        "codigo": "060703",
        "provincia_id": "0607"
    },
    {
        "id": "060801",
        "nombre": "JAEN",
        "codigo": "060801",
        "provincia_id": "0608"
    },
    {
        "id": "060802",
        "nombre": "BELLAVISTA",
        "codigo": "060802",
        "provincia_id": "0608"
    },
    {
        "id": "060803",
        "nombre": "CHONTALI",
        "codigo": "060803",
        "provincia_id": "0608"
    },
    {
        "id": "060804",
        "nombre": "COLASAY",
        "codigo": "060804",
        "provincia_id": "0608"
    },
    {
        "id": "060805",
        "nombre": "HUABAL",
        "codigo": "060805",
        "provincia_id": "0608"
    },
    {
        "id": "060806",
        "nombre": "LAS PIRIAS",
        "codigo": "060806",
        "provincia_id": "0608"
    },
    {
        "id": "060807",
        "nombre": "POMAHUACA",
        "codigo": "060807",
        "provincia_id": "0608"
    },
    {
        "id": "060808",
        "nombre": "PUCARA",
        "codigo": "060808",
        "provincia_id": "0608"
    },
    {
        "id": "060809",
        "nombre": "SALLIQUE",
        "codigo": "060809",
        "provincia_id": "0608"
    },
    {
        "id": "060810",
        "nombre": "SAN FELIPE",
        "codigo": "060810",
        "provincia_id": "0608"
    },
    {
        "id": "060811",
        "nombre": "SAN JOSE DEL ALTO",
        "codigo": "060811",
        "provincia_id": "0608"
    },
    {
        "id": "060812",
        "nombre": "SANTA ROSA",
        "codigo": "060812",
        "provincia_id": "0608"
    },
    {
        "id": "060901",
        "nombre": "SAN IGNACIO",
        "codigo": "060901",
        "provincia_id": "0609"
    },
    {
        "id": "060902",
        "nombre": "CHIRINOS",
        "codigo": "060902",
        "provincia_id": "0609"
    },
    {
        "id": "060903",
        "nombre": "HUARANGO",
        "codigo": "060903",
        "provincia_id": "0609"
    },
    {
        "id": "060904",
        "nombre": "LA COIPA",
        "codigo": "060904",
        "provincia_id": "0609"
    },
    {
        "id": "060905",
        "nombre": "NAMBALLE",
        "codigo": "060905",
        "provincia_id": "0609"
    },
    {
        "id": "060906",
        "nombre": "SAN JOSE DE LOURDES",
        "codigo": "060906",
        "provincia_id": "0609"
    },
    {
        "id": "060907",
        "nombre": "TABACONAS",
        "codigo": "060907",
        "provincia_id": "0609"
    },
    {
        "id": "061001",
        "nombre": "PEDRO GALVEZ",
        "codigo": "061001",
        "provincia_id": "0610"
    },
    {
        "id": "061002",
        "nombre": "CHANCAY",
        "codigo": "061002",
        "provincia_id": "0610"
    },
    {
        "id": "061003",
        "nombre": "EDUARDO VILLANUEVA",
        "codigo": "061003",
        "provincia_id": "0610"
    },
    {
        "id": "061004",
        "nombre": "GREGORIO PITA",
        "codigo": "061004",
        "provincia_id": "0610"
    },
    {
        "id": "061005",
        "nombre": "ICHOCAN",
        "codigo": "061005",
        "provincia_id": "0610"
    },
    {
        "id": "061006",
        "nombre": "JOSE MANUEL QUIROZ",
        "codigo": "061006",
        "provincia_id": "0610"
    },
    {
        "id": "061007",
        "nombre": "JOSE SABOGAL",
        "codigo": "061007",
        "provincia_id": "0610"
    },
    {
        "id": "061101",
        "nombre": "SAN MIGUEL",
        "codigo": "061101",
        "provincia_id": "0611"
    },
    {
        "id": "061102",
        "nombre": "BOLIVAR",
        "codigo": "061102",
        "provincia_id": "0611"
    },
    {
        "id": "061103",
        "nombre": "CALQUIS",
        "codigo": "061103",
        "provincia_id": "0611"
    },
    {
        "id": "061104",
        "nombre": "CATILLUC",
        "codigo": "061104",
        "provincia_id": "0611"
    },
    {
        "id": "061105",
        "nombre": "EL PRADO",
        "codigo": "061105",
        "provincia_id": "0611"
    },
    {
        "id": "061106",
        "nombre": "LA FLORIDA",
        "codigo": "061106",
        "provincia_id": "0611"
    },
    {
        "id": "061107",
        "nombre": "LLAPA",
        "codigo": "061107",
        "provincia_id": "0611"
    },
    {
        "id": "061108",
        "nombre": "NANCHOC",
        "codigo": "061108",
        "provincia_id": "0611"
    },
    {
        "id": "061109",
        "nombre": "NIEPOS",
        "codigo": "061109",
        "provincia_id": "0611"
    },
    {
        "id": "061110",
        "nombre": "SAN GREGORIO",
        "codigo": "061110",
        "provincia_id": "0611"
    },
    {
        "id": "061111",
        "nombre": "SAN SILVESTRE DE COCHAN",
        "codigo": "061111",
        "provincia_id": "0611"
    },
    {
        "id": "061112",
        "nombre": "TONGOD",
        "codigo": "061112",
        "provincia_id": "0611"
    },
    {
        "id": "061113",
        "nombre": "UNION AGUA BLANCA",
        "codigo": "061113",
        "provincia_id": "0611"
    },
    {
        "id": "061201",
        "nombre": "SAN PABLO",
        "codigo": "061201",
        "provincia_id": "0612"
    },
    {
        "id": "061202",
        "nombre": "SAN BERNARDINO",
        "codigo": "061202",
        "provincia_id": "0612"
    },
    {
        "id": "061203",
        "nombre": "SAN LUIS",
        "codigo": "061203",
        "provincia_id": "0612"
    },
    {
        "id": "061204",
        "nombre": "TUMBADEN",
        "codigo": "061204",
        "provincia_id": "0612"
    },
    {
        "id": "061301",
        "nombre": "SANTA CRUZ",
        "codigo": "061301",
        "provincia_id": "0613"
    },
    {
        "id": "061302",
        "nombre": "ANDABAMBA",
        "codigo": "061302",
        "provincia_id": "0613"
    },
    {
        "id": "061303",
        "nombre": "CATACHE",
        "codigo": "061303",
        "provincia_id": "0613"
    },
    {
        "id": "061304",
        "nombre": "CHANCAYBAÑOS",
        "codigo": "061304",
        "provincia_id": "0613"
    },
    {
        "id": "061305",
        "nombre": "LA ESPERANZA",
        "codigo": "061305",
        "provincia_id": "0613"
    },
    {
        "id": "061306",
        "nombre": "NINABAMBA",
        "codigo": "061306",
        "provincia_id": "0613"
    },
    {
        "id": "061307",
        "nombre": "PULAN",
        "codigo": "061307",
        "provincia_id": "0613"
    },
    {
        "id": "061308",
        "nombre": "SAUCEPAMPA",
        "codigo": "061308",
        "provincia_id": "0613"
    },
    {
        "id": "061309",
        "nombre": "SEXI",
        "codigo": "061309",
        "provincia_id": "0613"
    },
    {
        "id": "061310",
        "nombre": "UTICYACU",
        "codigo": "061310",
        "provincia_id": "0613"
    },
    {
        "id": "061311",
        "nombre": "YAUYUCAN",
        "codigo": "061311",
        "provincia_id": "0613"
    },
    {
        "id": "070101",
        "nombre": "CALLAO",
        "codigo": "070101",
        "provincia_id": "0701"
    },
    {
        "id": "070102",
        "nombre": "BELLAVISTA",
        "codigo": "070102",
        "provincia_id": "0701"
    },
    {
        "id": "070103",
        "nombre": "CARMEN DE LA LEGUA REYNOSO",
        "codigo": "070103",
        "provincia_id": "0701"
    },
    {
        "id": "070104",
        "nombre": "LA PERLA",
        "codigo": "070104",
        "provincia_id": "0701"
    },
    {
        "id": "070105",
        "nombre": "LA PUNTA",
        "codigo": "070105",
        "provincia_id": "0701"
    },
    {
        "id": "070106",
        "nombre": "VENTANILLA",
        "codigo": "070106",
        "provincia_id": "0701"
    },
    {
        "id": "070107",
        "nombre": "MI PERU",
        "codigo": "070107",
        "provincia_id": "0701"
    },
    {
        "id": "080101",
        "nombre": "CUSCO",
        "codigo": "080101",
        "provincia_id": "0801"
    },
    {
        "id": "080102",
        "nombre": "CCORCA",
        "codigo": "080102",
        "provincia_id": "0801"
    },
    {
        "id": "080103",
        "nombre": "POROY",
        "codigo": "080103",
        "provincia_id": "0801"
    },
    {
        "id": "080104",
        "nombre": "SAN JERONIMO",
        "codigo": "080104",
        "provincia_id": "0801"
    },
    {
        "id": "080105",
        "nombre": "SAN SEBASTIAN",
        "codigo": "080105",
        "provincia_id": "0801"
    },
    {
        "id": "080106",
        "nombre": "SANTIAGO",
        "codigo": "080106",
        "provincia_id": "0801"
    },
    {
        "id": "080107",
        "nombre": "SAYLLA",
        "codigo": "080107",
        "provincia_id": "0801"
    },
    {
        "id": "080108",
        "nombre": "WANCHAQ",
        "codigo": "080108",
        "provincia_id": "0801"
    },
    {
        "id": "080201",
        "nombre": "ACOMAYO",
        "codigo": "080201",
        "provincia_id": "0802"
    },
    {
        "id": "080202",
        "nombre": "ACOPIA",
        "codigo": "080202",
        "provincia_id": "0802"
    },
    {
        "id": "080203",
        "nombre": "ACOS",
        "codigo": "080203",
        "provincia_id": "0802"
    },
    {
        "id": "080204",
        "nombre": "MOSOC LLACTA",
        "codigo": "080204",
        "provincia_id": "0802"
    },
    {
        "id": "080205",
        "nombre": "POMACANCHI",
        "codigo": "080205",
        "provincia_id": "0802"
    },
    {
        "id": "080206",
        "nombre": "RONDOCAN",
        "codigo": "080206",
        "provincia_id": "0802"
    },
    {
        "id": "080207",
        "nombre": "SANGARARA",
        "codigo": "080207",
        "provincia_id": "0802"
    },
    {
        "id": "080301",
        "nombre": "ANTA",
        "codigo": "080301",
        "provincia_id": "0803"
    },
    {
        "id": "080302",
        "nombre": "ANCAHUASI",
        "codigo": "080302",
        "provincia_id": "0803"
    },
    {
        "id": "080303",
        "nombre": "CACHIMAYO",
        "codigo": "080303",
        "provincia_id": "0803"
    },
    {
        "id": "080304",
        "nombre": "CHINCHAYPUJIO",
        "codigo": "080304",
        "provincia_id": "0803"
    },
    {
        "id": "080305",
        "nombre": "HUAROCONDO",
        "codigo": "080305",
        "provincia_id": "0803"
    },
    {
        "id": "080306",
        "nombre": "LIMATAMBO",
        "codigo": "080306",
        "provincia_id": "0803"
    },
    {
        "id": "080307",
        "nombre": "MOLLEPATA",
        "codigo": "080307",
        "provincia_id": "0803"
    },
    {
        "id": "080308",
        "nombre": "PUCYURA",
        "codigo": "080308",
        "provincia_id": "0803"
    },
    {
        "id": "080309",
        "nombre": "ZURITE",
        "codigo": "080309",
        "provincia_id": "0803"
    },
    {
        "id": "080401",
        "nombre": "CALCA",
        "codigo": "080401",
        "provincia_id": "0804"
    },
    {
        "id": "080402",
        "nombre": "COYA",
        "codigo": "080402",
        "provincia_id": "0804"
    },
    {
        "id": "080403",
        "nombre": "LAMAY",
        "codigo": "080403",
        "provincia_id": "0804"
    },
    {
        "id": "080404",
        "nombre": "LARES",
        "codigo": "080404",
        "provincia_id": "0804"
    },
    {
        "id": "080405",
        "nombre": "PISAC",
        "codigo": "080405",
        "provincia_id": "0804"
    },
    {
        "id": "080406",
        "nombre": "SAN SALVADOR",
        "codigo": "080406",
        "provincia_id": "0804"
    },
    {
        "id": "080407",
        "nombre": "TARAY",
        "codigo": "080407",
        "provincia_id": "0804"
    },
    {
        "id": "080408",
        "nombre": "YANATILE",
        "codigo": "080408",
        "provincia_id": "0804"
    },
    {
        "id": "080501",
        "nombre": "YANAOCA",
        "codigo": "080501",
        "provincia_id": "0805"
    },
    {
        "id": "080502",
        "nombre": "CHECCA",
        "codigo": "080502",
        "provincia_id": "0805"
    },
    {
        "id": "080503",
        "nombre": "KUNTURKANKI",
        "codigo": "080503",
        "provincia_id": "0805"
    },
    {
        "id": "080504",
        "nombre": "LANGUI",
        "codigo": "080504",
        "provincia_id": "0805"
    },
    {
        "id": "080505",
        "nombre": "LAYO",
        "codigo": "080505",
        "provincia_id": "0805"
    },
    {
        "id": "080506",
        "nombre": "PAMPAMARCA",
        "codigo": "080506",
        "provincia_id": "0805"
    },
    {
        "id": "080507",
        "nombre": "QUEHUE",
        "codigo": "080507",
        "provincia_id": "0805"
    },
    {
        "id": "080508",
        "nombre": "TUPAC AMARU",
        "codigo": "080508",
        "provincia_id": "0805"
    },
    {
        "id": "080601",
        "nombre": "SICUANI",
        "codigo": "080601",
        "provincia_id": "0806"
    },
    {
        "id": "080602",
        "nombre": "CHECACUPE",
        "codigo": "080602",
        "provincia_id": "0806"
    },
    {
        "id": "080603",
        "nombre": "COMBAPATA",
        "codigo": "080603",
        "provincia_id": "0806"
    },
    {
        "id": "080604",
        "nombre": "MARANGANI",
        "codigo": "080604",
        "provincia_id": "0806"
    },
    {
        "id": "080605",
        "nombre": "PITUMARCA",
        "codigo": "080605",
        "provincia_id": "0806"
    },
    {
        "id": "080606",
        "nombre": "SAN PABLO",
        "codigo": "080606",
        "provincia_id": "0806"
    },
    {
        "id": "080607",
        "nombre": "SAN PEDRO",
        "codigo": "080607",
        "provincia_id": "0806"
    },
    {
        "id": "080608",
        "nombre": "TINTA",
        "codigo": "080608",
        "provincia_id": "0806"
    },
    {
        "id": "080701",
        "nombre": "SANTO TOMAS",
        "codigo": "080701",
        "provincia_id": "0807"
    },
    {
        "id": "080702",
        "nombre": "CAPACMARCA",
        "codigo": "080702",
        "provincia_id": "0807"
    },
    {
        "id": "080703",
        "nombre": "CHAMACA",
        "codigo": "080703",
        "provincia_id": "0807"
    },
    {
        "id": "080704",
        "nombre": "COLQUEMARCA",
        "codigo": "080704",
        "provincia_id": "0807"
    },
    {
        "id": "080705",
        "nombre": "LIVITACA",
        "codigo": "080705",
        "provincia_id": "0807"
    },
    {
        "id": "080706",
        "nombre": "LLUSCO",
        "codigo": "080706",
        "provincia_id": "0807"
    },
    {
        "id": "080707",
        "nombre": "QUIÑOTA",
        "codigo": "080707",
        "provincia_id": "0807"
    },
    {
        "id": "080708",
        "nombre": "VELILLE",
        "codigo": "080708",
        "provincia_id": "0807"
    },
    {
        "id": "080801",
        "nombre": "ESPINAR",
        "codigo": "080801",
        "provincia_id": "0808"
    },
    {
        "id": "080802",
        "nombre": "CONDOROMA",
        "codigo": "080802",
        "provincia_id": "0808"
    },
    {
        "id": "080803",
        "nombre": "COPORAQUE",
        "codigo": "080803",
        "provincia_id": "0808"
    },
    {
        "id": "080804",
        "nombre": "OCORURO",
        "codigo": "080804",
        "provincia_id": "0808"
    },
    {
        "id": "080805",
        "nombre": "PALLPATA",
        "codigo": "080805",
        "provincia_id": "0808"
    },
    {
        "id": "080806",
        "nombre": "PICHIGUA",
        "codigo": "080806",
        "provincia_id": "0808"
    },
    {
        "id": "080807",
        "nombre": "SUYCKUTAMBO",
        "codigo": "080807",
        "provincia_id": "0808"
    },
    {
        "id": "080808",
        "nombre": "ALTO PICHIGUA",
        "codigo": "080808",
        "provincia_id": "0808"
    },
    {
        "id": "080901",
        "nombre": "SANTA ANA",
        "codigo": "080901",
        "provincia_id": "0809"
    },
    {
        "id": "080902",
        "nombre": "ECHARATE",
        "codigo": "080902",
        "provincia_id": "0809"
    },
    {
        "id": "080903",
        "nombre": "HUAYOPATA",
        "codigo": "080903",
        "provincia_id": "0809"
    },
    {
        "id": "080904",
        "nombre": "MARANURA",
        "codigo": "080904",
        "provincia_id": "0809"
    },
    {
        "id": "080905",
        "nombre": "OCOBAMBA",
        "codigo": "080905",
        "provincia_id": "0809"
    },
    {
        "id": "080906",
        "nombre": "QUELLOUNO",
        "codigo": "080906",
        "provincia_id": "0809"
    },
    {
        "id": "080907",
        "nombre": "QUIMBIRI",
        "codigo": "080907",
        "provincia_id": "0809"
    },
    {
        "id": "080908",
        "nombre": "SANTA TERESA",
        "codigo": "080908",
        "provincia_id": "0809"
    },
    {
        "id": "080909",
        "nombre": "VILCABAMBA",
        "codigo": "080909",
        "provincia_id": "0809"
    },
    {
        "id": "080910",
        "nombre": "PICHARI",
        "codigo": "080910",
        "provincia_id": "0809"
    },
    {
        "id": "080911",
        "nombre": "INKAWASI",
        "codigo": "080911",
        "provincia_id": "0809"
    },
    {
        "id": "080912",
        "nombre": "VILLA VIRGEN",
        "codigo": "080912",
        "provincia_id": "0809"
    },
    {
        "id": "080913",
        "nombre": "VILLA KINTIARINA",
        "codigo": "080913",
        "provincia_id": "0809"
    },
    {
        "id": "080914",
        "nombre": "MEGANTONI",
        "codigo": "080914",
        "provincia_id": "0809"
    },
    {
        "id": "080915",
        "nombre": "KUMPIRUSHIATO",
        "codigo": "080915",
        "provincia_id": "0809"
    },
    {
        "id": "080916",
        "nombre": "CIELO PUNCO",
        "codigo": "080916",
        "provincia_id": "0809"
    },
    {
        "id": "080917",
        "nombre": "MANITEA",
        "codigo": "080917",
        "provincia_id": "0809"
    },
    {
        "id": "080918",
        "nombre": "UNION ASHÁNINKA",
        "codigo": "080918",
        "provincia_id": "0809"
    },
    {
        "id": "081001",
        "nombre": "PARURO",
        "codigo": "081001",
        "provincia_id": "0810"
    },
    {
        "id": "081002",
        "nombre": "ACCHA",
        "codigo": "081002",
        "provincia_id": "0810"
    },
    {
        "id": "081003",
        "nombre": "CCAPI",
        "codigo": "081003",
        "provincia_id": "0810"
    },
    {
        "id": "081004",
        "nombre": "COLCHA",
        "codigo": "081004",
        "provincia_id": "0810"
    },
    {
        "id": "081005",
        "nombre": "HUANOQUITE",
        "codigo": "081005",
        "provincia_id": "0810"
    },
    {
        "id": "081006",
        "nombre": "OMACHA",
        "codigo": "081006",
        "provincia_id": "0810"
    },
    {
        "id": "081007",
        "nombre": "PACCARITAMBO",
        "codigo": "081007",
        "provincia_id": "0810"
    },
    {
        "id": "081008",
        "nombre": "PILLPINTO",
        "codigo": "081008",
        "provincia_id": "0810"
    },
    {
        "id": "081009",
        "nombre": "YAURISQUE",
        "codigo": "081009",
        "provincia_id": "0810"
    },
    {
        "id": "081101",
        "nombre": "PAUCARTAMBO",
        "codigo": "081101",
        "provincia_id": "0811"
    },
    {
        "id": "081102",
        "nombre": "CAICAY",
        "codigo": "081102",
        "provincia_id": "0811"
    },
    {
        "id": "081103",
        "nombre": "CHALLABAMBA",
        "codigo": "081103",
        "provincia_id": "0811"
    },
    {
        "id": "081104",
        "nombre": "COLQUEPATA",
        "codigo": "081104",
        "provincia_id": "0811"
    },
    {
        "id": "081105",
        "nombre": "HUANCARANI",
        "codigo": "081105",
        "provincia_id": "0811"
    },
    {
        "id": "081106",
        "nombre": "KOSÑIPATA",
        "codigo": "081106",
        "provincia_id": "0811"
    },
    {
        "id": "081201",
        "nombre": "URCOS",
        "codigo": "081201",
        "provincia_id": "0812"
    },
    {
        "id": "081202",
        "nombre": "ANDAHUAYLILLAS",
        "codigo": "081202",
        "provincia_id": "0812"
    },
    {
        "id": "081203",
        "nombre": "CAMANTI",
        "codigo": "081203",
        "provincia_id": "0812"
    },
    {
        "id": "081204",
        "nombre": "CCARHUAYO",
        "codigo": "081204",
        "provincia_id": "0812"
    },
    {
        "id": "081205",
        "nombre": "CCATCA",
        "codigo": "081205",
        "provincia_id": "0812"
    },
    {
        "id": "081206",
        "nombre": "CUSIPATA",
        "codigo": "081206",
        "provincia_id": "0812"
    },
    {
        "id": "081207",
        "nombre": "HUARO",
        "codigo": "081207",
        "provincia_id": "0812"
    },
    {
        "id": "081208",
        "nombre": "LUCRE",
        "codigo": "081208",
        "provincia_id": "0812"
    },
    {
        "id": "081209",
        "nombre": "MARCAPATA",
        "codigo": "081209",
        "provincia_id": "0812"
    },
    {
        "id": "081210",
        "nombre": "OCONGATE",
        "codigo": "081210",
        "provincia_id": "0812"
    },
    {
        "id": "081211",
        "nombre": "OROPESA",
        "codigo": "081211",
        "provincia_id": "0812"
    },
    {
        "id": "081212",
        "nombre": "QUIQUIJANA",
        "codigo": "081212",
        "provincia_id": "0812"
    },
    {
        "id": "081301",
        "nombre": "URUBAMBA",
        "codigo": "081301",
        "provincia_id": "0813"
    },
    {
        "id": "081302",
        "nombre": "CHINCHERO",
        "codigo": "081302",
        "provincia_id": "0813"
    },
    {
        "id": "081303",
        "nombre": "HUAYLLABAMBA",
        "codigo": "081303",
        "provincia_id": "0813"
    },
    {
        "id": "081304",
        "nombre": "MACHUPICCHU",
        "codigo": "081304",
        "provincia_id": "0813"
    },
    {
        "id": "081305",
        "nombre": "MARAS",
        "codigo": "081305",
        "provincia_id": "0813"
    },
    {
        "id": "081306",
        "nombre": "OLLANTAYTAMBO",
        "codigo": "081306",
        "provincia_id": "0813"
    },
    {
        "id": "081307",
        "nombre": "YUCAY",
        "codigo": "081307",
        "provincia_id": "0813"
    },
    {
        "id": "090101",
        "nombre": "HUANCAVELICA",
        "codigo": "090101",
        "provincia_id": "0901"
    },
    {
        "id": "090102",
        "nombre": "ACOBAMBILLA",
        "codigo": "090102",
        "provincia_id": "0901"
    },
    {
        "id": "090103",
        "nombre": "ACORIA",
        "codigo": "090103",
        "provincia_id": "0901"
    },
    {
        "id": "090104",
        "nombre": "CONAYCA",
        "codigo": "090104",
        "provincia_id": "0901"
    },
    {
        "id": "090105",
        "nombre": "CUENCA",
        "codigo": "090105",
        "provincia_id": "0901"
    },
    {
        "id": "090106",
        "nombre": "HUACHOCOLPA",
        "codigo": "090106",
        "provincia_id": "0901"
    },
    {
        "id": "090107",
        "nombre": "HUAYLLAHUARA",
        "codigo": "090107",
        "provincia_id": "0901"
    },
    {
        "id": "090108",
        "nombre": "IZCUCHACA",
        "codigo": "090108",
        "provincia_id": "0901"
    },
    {
        "id": "090109",
        "nombre": "LARIA",
        "codigo": "090109",
        "provincia_id": "0901"
    },
    {
        "id": "090110",
        "nombre": "MANTA",
        "codigo": "090110",
        "provincia_id": "0901"
    },
    {
        "id": "090111",
        "nombre": "MARISCAL CACERES",
        "codigo": "090111",
        "provincia_id": "0901"
    },
    {
        "id": "090112",
        "nombre": "MOYA",
        "codigo": "090112",
        "provincia_id": "0901"
    },
    {
        "id": "090113",
        "nombre": "NUEVO OCCORO",
        "codigo": "090113",
        "provincia_id": "0901"
    },
    {
        "id": "090114",
        "nombre": "PALCA",
        "codigo": "090114",
        "provincia_id": "0901"
    },
    {
        "id": "090115",
        "nombre": "PILCHACA",
        "codigo": "090115",
        "provincia_id": "0901"
    },
    {
        "id": "090116",
        "nombre": "VILCA",
        "codigo": "090116",
        "provincia_id": "0901"
    },
    {
        "id": "090117",
        "nombre": "YAULI",
        "codigo": "090117",
        "provincia_id": "0901"
    },
    {
        "id": "090118",
        "nombre": "ASCENSION",
        "codigo": "090118",
        "provincia_id": "0901"
    },
    {
        "id": "090119",
        "nombre": "HUANDO",
        "codigo": "090119",
        "provincia_id": "0901"
    },
    {
        "id": "090201",
        "nombre": "ACOBAMBA",
        "codigo": "090201",
        "provincia_id": "0902"
    },
    {
        "id": "090202",
        "nombre": "ANDABAMBA",
        "codigo": "090202",
        "provincia_id": "0902"
    },
    {
        "id": "090203",
        "nombre": "ANTA",
        "codigo": "090203",
        "provincia_id": "0902"
    },
    {
        "id": "090204",
        "nombre": "CAJA",
        "codigo": "090204",
        "provincia_id": "0902"
    },
    {
        "id": "090205",
        "nombre": "MARCAS",
        "codigo": "090205",
        "provincia_id": "0902"
    },
    {
        "id": "090206",
        "nombre": "PAUCARA",
        "codigo": "090206",
        "provincia_id": "0902"
    },
    {
        "id": "090207",
        "nombre": "POMACOCHA",
        "codigo": "090207",
        "provincia_id": "0902"
    },
    {
        "id": "090208",
        "nombre": "ROSARIO",
        "codigo": "090208",
        "provincia_id": "0902"
    },
    {
        "id": "090301",
        "nombre": "LIRCAY",
        "codigo": "090301",
        "provincia_id": "0903"
    },
    {
        "id": "090302",
        "nombre": "ANCHONGA",
        "codigo": "090302",
        "provincia_id": "0903"
    },
    {
        "id": "090303",
        "nombre": "CALLANMARCA",
        "codigo": "090303",
        "provincia_id": "0903"
    },
    {
        "id": "090304",
        "nombre": "CCOCHACCASA",
        "codigo": "090304",
        "provincia_id": "0903"
    },
    {
        "id": "090305",
        "nombre": "CHINCHO",
        "codigo": "090305",
        "provincia_id": "0903"
    },
    {
        "id": "090306",
        "nombre": "CONGALLA",
        "codigo": "090306",
        "provincia_id": "0903"
    },
    {
        "id": "090307",
        "nombre": "HUANCA-HUANCA",
        "codigo": "090307",
        "provincia_id": "0903"
    },
    {
        "id": "090308",
        "nombre": "HUAYLLAY GRANDE",
        "codigo": "090308",
        "provincia_id": "0903"
    },
    {
        "id": "090309",
        "nombre": "JULCAMARCA",
        "codigo": "090309",
        "provincia_id": "0903"
    },
    {
        "id": "090310",
        "nombre": "SAN ANTONIO DE ANTAPARCO",
        "codigo": "090310",
        "provincia_id": "0903"
    },
    {
        "id": "090311",
        "nombre": "SANTO TOMAS DE PATA",
        "codigo": "090311",
        "provincia_id": "0903"
    },
    {
        "id": "090312",
        "nombre": "SECCLLA",
        "codigo": "090312",
        "provincia_id": "0903"
    },
    {
        "id": "090401",
        "nombre": "CASTROVIRREYNA",
        "codigo": "090401",
        "provincia_id": "0904"
    },
    {
        "id": "090402",
        "nombre": "ARMA",
        "codigo": "090402",
        "provincia_id": "0904"
    },
    {
        "id": "090403",
        "nombre": "AURAHUA",
        "codigo": "090403",
        "provincia_id": "0904"
    },
    {
        "id": "090404",
        "nombre": "CAPILLAS",
        "codigo": "090404",
        "provincia_id": "0904"
    },
    {
        "id": "090405",
        "nombre": "CHUPAMARCA",
        "codigo": "090405",
        "provincia_id": "0904"
    },
    {
        "id": "090406",
        "nombre": "COCAS",
        "codigo": "090406",
        "provincia_id": "0904"
    },
    {
        "id": "090407",
        "nombre": "HUACHOS",
        "codigo": "090407",
        "provincia_id": "0904"
    },
    {
        "id": "090408",
        "nombre": "HUAMATAMBO",
        "codigo": "090408",
        "provincia_id": "0904"
    },
    {
        "id": "090409",
        "nombre": "MOLLEPAMPA",
        "codigo": "090409",
        "provincia_id": "0904"
    },
    {
        "id": "090410",
        "nombre": "SAN JUAN",
        "codigo": "090410",
        "provincia_id": "0904"
    },
    {
        "id": "090411",
        "nombre": "SANTA ANA",
        "codigo": "090411",
        "provincia_id": "0904"
    },
    {
        "id": "090412",
        "nombre": "TANTARA",
        "codigo": "090412",
        "provincia_id": "0904"
    },
    {
        "id": "090413",
        "nombre": "TICRAPO",
        "codigo": "090413",
        "provincia_id": "0904"
    },
    {
        "id": "090501",
        "nombre": "CHURCAMPA",
        "codigo": "090501",
        "provincia_id": "0905"
    },
    {
        "id": "090502",
        "nombre": "ANCO",
        "codigo": "090502",
        "provincia_id": "0905"
    },
    {
        "id": "090503",
        "nombre": "CHINCHIHUASI",
        "codigo": "090503",
        "provincia_id": "0905"
    },
    {
        "id": "090504",
        "nombre": "EL CARMEN",
        "codigo": "090504",
        "provincia_id": "0905"
    },
    {
        "id": "090505",
        "nombre": "LA MERCED",
        "codigo": "090505",
        "provincia_id": "0905"
    },
    {
        "id": "090506",
        "nombre": "LOCROJA",
        "codigo": "090506",
        "provincia_id": "0905"
    },
    {
        "id": "090507",
        "nombre": "PAUCARBAMBA",
        "codigo": "090507",
        "provincia_id": "0905"
    },
    {
        "id": "090508",
        "nombre": "SAN MIGUEL DE MAYOCC",
        "codigo": "090508",
        "provincia_id": "0905"
    },
    {
        "id": "090509",
        "nombre": "SAN PEDRO DE CORIS",
        "codigo": "090509",
        "provincia_id": "0905"
    },
    {
        "id": "090510",
        "nombre": "PACHAMARCA",
        "codigo": "090510",
        "provincia_id": "0905"
    },
    {
        "id": "090511",
        "nombre": "COSME",
        "codigo": "090511",
        "provincia_id": "0905"
    },
    {
        "id": "090601",
        "nombre": "HUAYTARA",
        "codigo": "090601",
        "provincia_id": "0906"
    },
    {
        "id": "090602",
        "nombre": "AYAVI",
        "codigo": "090602",
        "provincia_id": "0906"
    },
    {
        "id": "090603",
        "nombre": "CORDOVA",
        "codigo": "090603",
        "provincia_id": "0906"
    },
    {
        "id": "090604",
        "nombre": "HUAYACUNDO ARMA",
        "codigo": "090604",
        "provincia_id": "0906"
    },
    {
        "id": "090605",
        "nombre": "LARAMARCA",
        "codigo": "090605",
        "provincia_id": "0906"
    },
    {
        "id": "090606",
        "nombre": "OCOYO",
        "codigo": "090606",
        "provincia_id": "0906"
    },
    {
        "id": "090607",
        "nombre": "PILPICHACA",
        "codigo": "090607",
        "provincia_id": "0906"
    },
    {
        "id": "090608",
        "nombre": "QUERCO",
        "codigo": "090608",
        "provincia_id": "0906"
    },
    {
        "id": "090609",
        "nombre": "QUITO-ARMA",
        "codigo": "090609",
        "provincia_id": "0906"
    },
    {
        "id": "090610",
        "nombre": "SAN ANTONIO DE CUSICANCHA",
        "codigo": "090610",
        "provincia_id": "0906"
    },
    {
        "id": "090611",
        "nombre": "SAN FRANCISCO DE SANGAYAICO",
        "codigo": "090611",
        "provincia_id": "0906"
    },
    {
        "id": "090612",
        "nombre": "SAN ISIDRO",
        "codigo": "090612",
        "provincia_id": "0906"
    },
    {
        "id": "090613",
        "nombre": "SANTIAGO DE CHOCORVOS",
        "codigo": "090613",
        "provincia_id": "0906"
    },
    {
        "id": "090614",
        "nombre": "SANTIAGO DE QUIRAHUARA",
        "codigo": "090614",
        "provincia_id": "0906"
    },
    {
        "id": "090615",
        "nombre": "SANTO DOMINGO DE CAPILLAS",
        "codigo": "090615",
        "provincia_id": "0906"
    },
    {
        "id": "090616",
        "nombre": "TAMBO",
        "codigo": "090616",
        "provincia_id": "0906"
    },
    {
        "id": "090701",
        "nombre": "PAMPAS",
        "codigo": "090701",
        "provincia_id": "0907"
    },
    {
        "id": "090702",
        "nombre": "ACOSTAMBO",
        "codigo": "090702",
        "provincia_id": "0907"
    },
    {
        "id": "090703",
        "nombre": "ACRAQUIA",
        "codigo": "090703",
        "provincia_id": "0907"
    },
    {
        "id": "090704",
        "nombre": "AHUAYCHA",
        "codigo": "090704",
        "provincia_id": "0907"
    },
    {
        "id": "090705",
        "nombre": "COLCABAMBA",
        "codigo": "090705",
        "provincia_id": "0907"
    },
    {
        "id": "090706",
        "nombre": "DANIEL HERNANDEZ",
        "codigo": "090706",
        "provincia_id": "0907"
    },
    {
        "id": "090707",
        "nombre": "HUACHOCOLPA",
        "codigo": "090707",
        "provincia_id": "0907"
    },
    {
        "id": "090709",
        "nombre": "HUARIBAMBA",
        "codigo": "090709",
        "provincia_id": "0907"
    },
    {
        "id": "090710",
        "nombre": "ÑAHUIMPUQUIO",
        "codigo": "090710",
        "provincia_id": "0907"
    },
    {
        "id": "090711",
        "nombre": "PAZOS",
        "codigo": "090711",
        "provincia_id": "0907"
    },
    {
        "id": "090713",
        "nombre": "QUISHUAR",
        "codigo": "090713",
        "provincia_id": "0907"
    },
    {
        "id": "090714",
        "nombre": "SALCABAMBA",
        "codigo": "090714",
        "provincia_id": "0907"
    },
    {
        "id": "090715",
        "nombre": "SALCAHUASI",
        "codigo": "090715",
        "provincia_id": "0907"
    },
    {
        "id": "090716",
        "nombre": "SAN MARCOS DE ROCCHAC",
        "codigo": "090716",
        "provincia_id": "0907"
    },
    {
        "id": "090717",
        "nombre": "SURCUBAMBA",
        "codigo": "090717",
        "provincia_id": "0907"
    },
    {
        "id": "090718",
        "nombre": "TINTAY PUNCU",
        "codigo": "090718",
        "provincia_id": "0907"
    },
    {
        "id": "090719",
        "nombre": "QUICHUAS",
        "codigo": "090719",
        "provincia_id": "0907"
    },
    {
        "id": "090720",
        "nombre": "ANDAYMARCA",
        "codigo": "090720",
        "provincia_id": "0907"
    },
    {
        "id": "090721",
        "nombre": "ROBLE",
        "codigo": "090721",
        "provincia_id": "0907"
    },
    {
        "id": "090722",
        "nombre": "PICHOS",
        "codigo": "090722",
        "provincia_id": "0907"
    },
    {
        "id": "090723",
        "nombre": "SANTIAGO DE TUCUMA",
        "codigo": "090723",
        "provincia_id": "0907"
    },
    {
        "id": "090724",
        "nombre": "LAMBRAS",
        "codigo": "090724",
        "provincia_id": "0907"
    },
    {
        "id": "090725",
        "nombre": "COCHABAMBA",
        "codigo": "090725",
        "provincia_id": "0907"
    },
    {
        "id": "100101",
        "nombre": "HUANUCO",
        "codigo": "100101",
        "provincia_id": "1001"
    },
    {
        "id": "100102",
        "nombre": "AMARILIS",
        "codigo": "100102",
        "provincia_id": "1001"
    },
    {
        "id": "100103",
        "nombre": "CHINCHAO",
        "codigo": "100103",
        "provincia_id": "1001"
    },
    {
        "id": "100104",
        "nombre": "CHURUBAMBA",
        "codigo": "100104",
        "provincia_id": "1001"
    },
    {
        "id": "100105",
        "nombre": "MARGOS",
        "codigo": "100105",
        "provincia_id": "1001"
    },
    {
        "id": "100106",
        "nombre": "QUISQUI",
        "codigo": "100106",
        "provincia_id": "1001"
    },
    {
        "id": "100107",
        "nombre": "SAN FRANCISCO DE CAYRAN",
        "codigo": "100107",
        "provincia_id": "1001"
    },
    {
        "id": "100108",
        "nombre": "SAN PEDRO DE CHAULAN",
        "codigo": "100108",
        "provincia_id": "1001"
    },
    {
        "id": "100109",
        "nombre": "SANTA MARIA DEL VALLE",
        "codigo": "100109",
        "provincia_id": "1001"
    },
    {
        "id": "100110",
        "nombre": "YARUMAYO",
        "codigo": "100110",
        "provincia_id": "1001"
    },
    {
        "id": "100111",
        "nombre": "PILLCO MARCA",
        "codigo": "100111",
        "provincia_id": "1001"
    },
    {
        "id": "100112",
        "nombre": "YACUS",
        "codigo": "100112",
        "provincia_id": "1001"
    },
    {
        "id": "100113",
        "nombre": "SAN PABLO DE PILLAO",
        "codigo": "100113",
        "provincia_id": "1001"
    },
    {
        "id": "100201",
        "nombre": "AMBO",
        "codigo": "100201",
        "provincia_id": "1002"
    },
    {
        "id": "100202",
        "nombre": "CAYNA",
        "codigo": "100202",
        "provincia_id": "1002"
    },
    {
        "id": "100203",
        "nombre": "COLPAS",
        "codigo": "100203",
        "provincia_id": "1002"
    },
    {
        "id": "100204",
        "nombre": "CONCHAMARCA",
        "codigo": "100204",
        "provincia_id": "1002"
    },
    {
        "id": "100205",
        "nombre": "HUACAR",
        "codigo": "100205",
        "provincia_id": "1002"
    },
    {
        "id": "100206",
        "nombre": "SAN FRANCISCO",
        "codigo": "100206",
        "provincia_id": "1002"
    },
    {
        "id": "100207",
        "nombre": "SAN RAFAEL",
        "codigo": "100207",
        "provincia_id": "1002"
    },
    {
        "id": "100208",
        "nombre": "TOMAY KICHWA",
        "codigo": "100208",
        "provincia_id": "1002"
    },
    {
        "id": "100301",
        "nombre": "LA UNION",
        "codigo": "100301",
        "provincia_id": "1003"
    },
    {
        "id": "100307",
        "nombre": "CHUQUIS",
        "codigo": "100307",
        "provincia_id": "1003"
    },
    {
        "id": "100311",
        "nombre": "MARIAS",
        "codigo": "100311",
        "provincia_id": "1003"
    },
    {
        "id": "100313",
        "nombre": "PACHAS",
        "codigo": "100313",
        "provincia_id": "1003"
    },
    {
        "id": "100316",
        "nombre": "QUIVILLA",
        "codigo": "100316",
        "provincia_id": "1003"
    },
    {
        "id": "100317",
        "nombre": "RIPAN",
        "codigo": "100317",
        "provincia_id": "1003"
    },
    {
        "id": "100321",
        "nombre": "SHUNQUI",
        "codigo": "100321",
        "provincia_id": "1003"
    },
    {
        "id": "100322",
        "nombre": "SILLAPATA",
        "codigo": "100322",
        "provincia_id": "1003"
    },
    {
        "id": "100323",
        "nombre": "YANAS",
        "codigo": "100323",
        "provincia_id": "1003"
    },
    {
        "id": "100401",
        "nombre": "HUACAYBAMBA",
        "codigo": "100401",
        "provincia_id": "1004"
    },
    {
        "id": "100402",
        "nombre": "CANCHABAMBA",
        "codigo": "100402",
        "provincia_id": "1004"
    },
    {
        "id": "100403",
        "nombre": "COCHABAMBA",
        "codigo": "100403",
        "provincia_id": "1004"
    },
    {
        "id": "100404",
        "nombre": "PINRA",
        "codigo": "100404",
        "provincia_id": "1004"
    },
    {
        "id": "100501",
        "nombre": "LLATA",
        "codigo": "100501",
        "provincia_id": "1005"
    },
    {
        "id": "100502",
        "nombre": "ARANCAY",
        "codigo": "100502",
        "provincia_id": "1005"
    },
    {
        "id": "100503",
        "nombre": "CHAVIN DE PARIARCA",
        "codigo": "100503",
        "provincia_id": "1005"
    },
    {
        "id": "100504",
        "nombre": "JACAS GRANDE",
        "codigo": "100504",
        "provincia_id": "1005"
    },
    {
        "id": "100505",
        "nombre": "JIRCAN",
        "codigo": "100505",
        "provincia_id": "1005"
    },
    {
        "id": "100506",
        "nombre": "MIRAFLORES",
        "codigo": "100506",
        "provincia_id": "1005"
    },
    {
        "id": "100507",
        "nombre": "MONZON",
        "codigo": "100507",
        "provincia_id": "1005"
    },
    {
        "id": "100508",
        "nombre": "PUNCHAO",
        "codigo": "100508",
        "provincia_id": "1005"
    },
    {
        "id": "100509",
        "nombre": "PUÑOS",
        "codigo": "100509",
        "provincia_id": "1005"
    },
    {
        "id": "100510",
        "nombre": "SINGA",
        "codigo": "100510",
        "provincia_id": "1005"
    },
    {
        "id": "100511",
        "nombre": "TANTAMAYO",
        "codigo": "100511",
        "provincia_id": "1005"
    },
    {
        "id": "100601",
        "nombre": "RUPA-RUPA",
        "codigo": "100601",
        "provincia_id": "1006"
    },
    {
        "id": "100602",
        "nombre": "DANIEL ALOMIAS ROBLES",
        "codigo": "100602",
        "provincia_id": "1006"
    },
    {
        "id": "100603",
        "nombre": "HERMILIO VALDIZAN",
        "codigo": "100603",
        "provincia_id": "1006"
    },
    {
        "id": "100604",
        "nombre": "JOSE CRESPO Y CASTILLO",
        "codigo": "100604",
        "provincia_id": "1006"
    },
    {
        "id": "100605",
        "nombre": "LUYANDO",
        "codigo": "100605",
        "provincia_id": "1006"
    },
    {
        "id": "100606",
        "nombre": "MARIANO DAMASO BERAUN",
        "codigo": "100606",
        "provincia_id": "1006"
    },
    {
        "id": "100607",
        "nombre": "PUCAYACU",
        "codigo": "100607",
        "provincia_id": "1006"
    },
    {
        "id": "100608",
        "nombre": "CASTILLO GRANDE",
        "codigo": "100608",
        "provincia_id": "1006"
    },
    {
        "id": "100609",
        "nombre": "PUEBLO NUEVO",
        "codigo": "100609",
        "provincia_id": "1006"
    },
    {
        "id": "100610",
        "nombre": "SANTO DOMINGO DE ANDA",
        "codigo": "100610",
        "provincia_id": "1006"
    },
    {
        "id": "100701",
        "nombre": "HUACRACHUCO",
        "codigo": "100701",
        "provincia_id": "1007"
    },
    {
        "id": "100702",
        "nombre": "CHOLON",
        "codigo": "100702",
        "provincia_id": "1007"
    },
    {
        "id": "100703",
        "nombre": "SAN BUENAVENTURA",
        "codigo": "100703",
        "provincia_id": "1007"
    },
    {
        "id": "100704",
        "nombre": "LA MORADA",
        "codigo": "100704",
        "provincia_id": "1007"
    },
    {
        "id": "100705",
        "nombre": "SANTA ROSA DE ALTO YANAJANCA",
        "codigo": "100705",
        "provincia_id": "1007"
    },
    {
        "id": "100801",
        "nombre": "PANAO",
        "codigo": "100801",
        "provincia_id": "1008"
    },
    {
        "id": "100802",
        "nombre": "CHAGLLA",
        "codigo": "100802",
        "provincia_id": "1008"
    },
    {
        "id": "100803",
        "nombre": "MOLINO",
        "codigo": "100803",
        "provincia_id": "1008"
    },
    {
        "id": "100804",
        "nombre": "UMARI",
        "codigo": "100804",
        "provincia_id": "1008"
    },
    {
        "id": "100901",
        "nombre": "PUERTO INCA",
        "codigo": "100901",
        "provincia_id": "1009"
    },
    {
        "id": "100902",
        "nombre": "CODO DEL POZUZO",
        "codigo": "100902",
        "provincia_id": "1009"
    },
    {
        "id": "100903",
        "nombre": "HONORIA",
        "codigo": "100903",
        "provincia_id": "1009"
    },
    {
        "id": "100904",
        "nombre": "TOURNAVISTA",
        "codigo": "100904",
        "provincia_id": "1009"
    },
    {
        "id": "100905",
        "nombre": "YUYAPICHIS",
        "codigo": "100905",
        "provincia_id": "1009"
    },
    {
        "id": "101001",
        "nombre": "JESUS",
        "codigo": "101001",
        "provincia_id": "1010"
    },
    {
        "id": "101002",
        "nombre": "BAÑOS",
        "codigo": "101002",
        "provincia_id": "1010"
    },
    {
        "id": "101003",
        "nombre": "JIVIA",
        "codigo": "101003",
        "provincia_id": "1010"
    },
    {
        "id": "101004",
        "nombre": "QUEROPALCA",
        "codigo": "101004",
        "provincia_id": "1010"
    },
    {
        "id": "101005",
        "nombre": "RONDOS",
        "codigo": "101005",
        "provincia_id": "1010"
    },
    {
        "id": "101006",
        "nombre": "SAN FRANCISCO DE ASIS",
        "codigo": "101006",
        "provincia_id": "1010"
    },
    {
        "id": "101007",
        "nombre": "SAN MIGUEL DE CAURI",
        "codigo": "101007",
        "provincia_id": "1010"
    },
    {
        "id": "101101",
        "nombre": "CHAVINILLO",
        "codigo": "101101",
        "provincia_id": "1011"
    },
    {
        "id": "101102",
        "nombre": "CAHUAC",
        "codigo": "101102",
        "provincia_id": "1011"
    },
    {
        "id": "101103",
        "nombre": "CHACABAMBA",
        "codigo": "101103",
        "provincia_id": "1011"
    },
    {
        "id": "101104",
        "nombre": "APARICIO POMARES",
        "codigo": "101104",
        "provincia_id": "1011"
    },
    {
        "id": "101105",
        "nombre": "JACAS CHICO",
        "codigo": "101105",
        "provincia_id": "1011"
    },
    {
        "id": "101106",
        "nombre": "OBAS",
        "codigo": "101106",
        "provincia_id": "1011"
    },
    {
        "id": "101107",
        "nombre": "PAMPAMARCA",
        "codigo": "101107",
        "provincia_id": "1011"
    },
    {
        "id": "101108",
        "nombre": "CHORAS",
        "codigo": "101108",
        "provincia_id": "1011"
    },
    {
        "id": "110101",
        "nombre": "ICA",
        "codigo": "110101",
        "provincia_id": "1101"
    },
    {
        "id": "110102",
        "nombre": "LA TINGUIÑA",
        "codigo": "110102",
        "provincia_id": "1101"
    },
    {
        "id": "110103",
        "nombre": "LOS AQUIJES",
        "codigo": "110103",
        "provincia_id": "1101"
    },
    {
        "id": "110104",
        "nombre": "OCUCAJE",
        "codigo": "110104",
        "provincia_id": "1101"
    },
    {
        "id": "110105",
        "nombre": "PACHACUTEC",
        "codigo": "110105",
        "provincia_id": "1101"
    },
    {
        "id": "110106",
        "nombre": "PARCONA",
        "codigo": "110106",
        "provincia_id": "1101"
    },
    {
        "id": "110107",
        "nombre": "PUEBLO NUEVO",
        "codigo": "110107",
        "provincia_id": "1101"
    },
    {
        "id": "110108",
        "nombre": "SALAS",
        "codigo": "110108",
        "provincia_id": "1101"
    },
    {
        "id": "110109",
        "nombre": "SAN JOSE DE LOS MOLINOS",
        "codigo": "110109",
        "provincia_id": "1101"
    },
    {
        "id": "110110",
        "nombre": "SAN JUAN BAUTISTA",
        "codigo": "110110",
        "provincia_id": "1101"
    },
    {
        "id": "110111",
        "nombre": "SANTIAGO",
        "codigo": "110111",
        "provincia_id": "1101"
    },
    {
        "id": "110112",
        "nombre": "SUBTANJALLA",
        "codigo": "110112",
        "provincia_id": "1101"
    },
    {
        "id": "110113",
        "nombre": "TATE",
        "codigo": "110113",
        "provincia_id": "1101"
    },
    {
        "id": "110114",
        "nombre": "YAUCA DEL ROSARIO",
        "codigo": "110114",
        "provincia_id": "1101"
    },
    {
        "id": "110201",
        "nombre": "CHINCHA ALTA",
        "codigo": "110201",
        "provincia_id": "1102"
    },
    {
        "id": "110202",
        "nombre": "ALTO LARAN",
        "codigo": "110202",
        "provincia_id": "1102"
    },
    {
        "id": "110203",
        "nombre": "CHAVIN",
        "codigo": "110203",
        "provincia_id": "1102"
    },
    {
        "id": "110204",
        "nombre": "CHINCHA BAJA",
        "codigo": "110204",
        "provincia_id": "1102"
    },
    {
        "id": "110205",
        "nombre": "EL CARMEN",
        "codigo": "110205",
        "provincia_id": "1102"
    },
    {
        "id": "110206",
        "nombre": "GROCIO PRADO",
        "codigo": "110206",
        "provincia_id": "1102"
    },
    {
        "id": "110207",
        "nombre": "PUEBLO NUEVO",
        "codigo": "110207",
        "provincia_id": "1102"
    },
    {
        "id": "110208",
        "nombre": "SAN JUAN DE YANAC",
        "codigo": "110208",
        "provincia_id": "1102"
    },
    {
        "id": "110209",
        "nombre": "SAN PEDRO DE HUACARPANA",
        "codigo": "110209",
        "provincia_id": "1102"
    },
    {
        "id": "110210",
        "nombre": "SUNAMPE",
        "codigo": "110210",
        "provincia_id": "1102"
    },
    {
        "id": "110211",
        "nombre": "TAMBO DE MORA",
        "codigo": "110211",
        "provincia_id": "1102"
    },
    {
        "id": "110301",
        "nombre": "NAZCA",
        "codigo": "110301",
        "provincia_id": "1103"
    },
    {
        "id": "110302",
        "nombre": "CHANGUILLO",
        "codigo": "110302",
        "provincia_id": "1103"
    },
    {
        "id": "110303",
        "nombre": "EL INGENIO",
        "codigo": "110303",
        "provincia_id": "1103"
    },
    {
        "id": "110304",
        "nombre": "MARCONA",
        "codigo": "110304",
        "provincia_id": "1103"
    },
    {
        "id": "110305",
        "nombre": "VISTA ALEGRE",
        "codigo": "110305",
        "provincia_id": "1103"
    },
    {
        "id": "110401",
        "nombre": "PALPA",
        "codigo": "110401",
        "provincia_id": "1104"
    },
    {
        "id": "110402",
        "nombre": "LLIPATA",
        "codigo": "110402",
        "provincia_id": "1104"
    },
    {
        "id": "110403",
        "nombre": "RIO GRANDE",
        "codigo": "110403",
        "provincia_id": "1104"
    },
    {
        "id": "110404",
        "nombre": "SANTA CRUZ",
        "codigo": "110404",
        "provincia_id": "1104"
    },
    {
        "id": "110405",
        "nombre": "TIBILLO",
        "codigo": "110405",
        "provincia_id": "1104"
    },
    {
        "id": "110501",
        "nombre": "PISCO",
        "codigo": "110501",
        "provincia_id": "1105"
    },
    {
        "id": "110502",
        "nombre": "HUANCANO",
        "codigo": "110502",
        "provincia_id": "1105"
    },
    {
        "id": "110503",
        "nombre": "HUMAY",
        "codigo": "110503",
        "provincia_id": "1105"
    },
    {
        "id": "110504",
        "nombre": "INDEPENDENCIA",
        "codigo": "110504",
        "provincia_id": "1105"
    },
    {
        "id": "110505",
        "nombre": "PARACAS",
        "codigo": "110505",
        "provincia_id": "1105"
    },
    {
        "id": "110506",
        "nombre": "SAN ANDRES",
        "codigo": "110506",
        "provincia_id": "1105"
    },
    {
        "id": "110507",
        "nombre": "SAN CLEMENTE",
        "codigo": "110507",
        "provincia_id": "1105"
    },
    {
        "id": "110508",
        "nombre": "TUPAC AMARU INCA",
        "codigo": "110508",
        "provincia_id": "1105"
    },
    {
        "id": "120101",
        "nombre": "HUANCAYO",
        "codigo": "120101",
        "provincia_id": "1201"
    },
    {
        "id": "120104",
        "nombre": "CARHUACALLANGA",
        "codigo": "120104",
        "provincia_id": "1201"
    },
    {
        "id": "120105",
        "nombre": "CHACAPAMPA",
        "codigo": "120105",
        "provincia_id": "1201"
    },
    {
        "id": "120106",
        "nombre": "CHICCHE",
        "codigo": "120106",
        "provincia_id": "1201"
    },
    {
        "id": "120107",
        "nombre": "CHILCA",
        "codigo": "120107",
        "provincia_id": "1201"
    },
    {
        "id": "120108",
        "nombre": "CHONGOS ALTO",
        "codigo": "120108",
        "provincia_id": "1201"
    },
    {
        "id": "120111",
        "nombre": "CHUPURO",
        "codigo": "120111",
        "provincia_id": "1201"
    },
    {
        "id": "120112",
        "nombre": "COLCA",
        "codigo": "120112",
        "provincia_id": "1201"
    },
    {
        "id": "120113",
        "nombre": "CULLHUAS",
        "codigo": "120113",
        "provincia_id": "1201"
    },
    {
        "id": "120114",
        "nombre": "EL TAMBO",
        "codigo": "120114",
        "provincia_id": "1201"
    },
    {
        "id": "120116",
        "nombre": "HUACRAPUQUIO",
        "codigo": "120116",
        "provincia_id": "1201"
    },
    {
        "id": "120117",
        "nombre": "HUALHUAS",
        "codigo": "120117",
        "provincia_id": "1201"
    },
    {
        "id": "120119",
        "nombre": "HUANCAN",
        "codigo": "120119",
        "provincia_id": "1201"
    },
    {
        "id": "120120",
        "nombre": "HUASICANCHA",
        "codigo": "120120",
        "provincia_id": "1201"
    },
    {
        "id": "120121",
        "nombre": "HUAYUCACHI",
        "codigo": "120121",
        "provincia_id": "1201"
    },
    {
        "id": "120122",
        "nombre": "INGENIO",
        "codigo": "120122",
        "provincia_id": "1201"
    },
    {
        "id": "120124",
        "nombre": "PARIAHUANCA",
        "codigo": "120124",
        "provincia_id": "1201"
    },
    {
        "id": "120125",
        "nombre": "PILCOMAYO",
        "codigo": "120125",
        "provincia_id": "1201"
    },
    {
        "id": "120126",
        "nombre": "PUCARA",
        "codigo": "120126",
        "provincia_id": "1201"
    },
    {
        "id": "120127",
        "nombre": "QUICHUAY",
        "codigo": "120127",
        "provincia_id": "1201"
    },
    {
        "id": "120128",
        "nombre": "QUILCAS",
        "codigo": "120128",
        "provincia_id": "1201"
    },
    {
        "id": "120129",
        "nombre": "SAN AGUSTIN",
        "codigo": "120129",
        "provincia_id": "1201"
    },
    {
        "id": "120130",
        "nombre": "SAN JERONIMO DE TUNAN",
        "codigo": "120130",
        "provincia_id": "1201"
    },
    {
        "id": "120132",
        "nombre": "SAÑO",
        "codigo": "120132",
        "provincia_id": "1201"
    },
    {
        "id": "120133",
        "nombre": "SAPALLANGA",
        "codigo": "120133",
        "provincia_id": "1201"
    },
    {
        "id": "120134",
        "nombre": "SICAYA",
        "codigo": "120134",
        "provincia_id": "1201"
    },
    {
        "id": "120135",
        "nombre": "SANTO DOMINGO DE ACOBAMBA",
        "codigo": "120135",
        "provincia_id": "1201"
    },
    {
        "id": "120136",
        "nombre": "VIQUES",
        "codigo": "120136",
        "provincia_id": "1201"
    },
    {
        "id": "120201",
        "nombre": "CONCEPCION",
        "codigo": "120201",
        "provincia_id": "1202"
    },
    {
        "id": "120202",
        "nombre": "ACO",
        "codigo": "120202",
        "provincia_id": "1202"
    },
    {
        "id": "120203",
        "nombre": "ANDAMARCA",
        "codigo": "120203",
        "provincia_id": "1202"
    },
    {
        "id": "120204",
        "nombre": "CHAMBARA",
        "codigo": "120204",
        "provincia_id": "1202"
    },
    {
        "id": "120205",
        "nombre": "COCHAS",
        "codigo": "120205",
        "provincia_id": "1202"
    },
    {
        "id": "120206",
        "nombre": "COMAS",
        "codigo": "120206",
        "provincia_id": "1202"
    },
    {
        "id": "120207",
        "nombre": "HEROINAS TOLEDO",
        "codigo": "120207",
        "provincia_id": "1202"
    },
    {
        "id": "120208",
        "nombre": "MANZANARES",
        "codigo": "120208",
        "provincia_id": "1202"
    },
    {
        "id": "120209",
        "nombre": "MARISCAL CASTILLA",
        "codigo": "120209",
        "provincia_id": "1202"
    },
    {
        "id": "120210",
        "nombre": "MATAHUASI",
        "codigo": "120210",
        "provincia_id": "1202"
    },
    {
        "id": "120211",
        "nombre": "MITO",
        "codigo": "120211",
        "provincia_id": "1202"
    },
    {
        "id": "120212",
        "nombre": "NUEVE DE JULIO",
        "codigo": "120212",
        "provincia_id": "1202"
    },
    {
        "id": "120213",
        "nombre": "ORCOTUNA",
        "codigo": "120213",
        "provincia_id": "1202"
    },
    {
        "id": "120214",
        "nombre": "SAN JOSE DE QUERO",
        "codigo": "120214",
        "provincia_id": "1202"
    },
    {
        "id": "120215",
        "nombre": "SANTA ROSA DE OCOPA",
        "codigo": "120215",
        "provincia_id": "1202"
    },
    {
        "id": "120301",
        "nombre": "CHANCHAMAYO",
        "codigo": "120301",
        "provincia_id": "1203"
    },
    {
        "id": "120302",
        "nombre": "PERENE",
        "codigo": "120302",
        "provincia_id": "1203"
    },
    {
        "id": "120303",
        "nombre": "PICHANAQUI",
        "codigo": "120303",
        "provincia_id": "1203"
    },
    {
        "id": "120304",
        "nombre": "SAN LUIS DE SHUARO",
        "codigo": "120304",
        "provincia_id": "1203"
    },
    {
        "id": "120305",
        "nombre": "SAN RAMON",
        "codigo": "120305",
        "provincia_id": "1203"
    },
    {
        "id": "120306",
        "nombre": "VITOC",
        "codigo": "120306",
        "provincia_id": "1203"
    },
    {
        "id": "120401",
        "nombre": "JAUJA",
        "codigo": "120401",
        "provincia_id": "1204"
    },
    {
        "id": "120402",
        "nombre": "ACOLLA",
        "codigo": "120402",
        "provincia_id": "1204"
    },
    {
        "id": "120403",
        "nombre": "APATA",
        "codigo": "120403",
        "provincia_id": "1204"
    },
    {
        "id": "120404",
        "nombre": "ATAURA",
        "codigo": "120404",
        "provincia_id": "1204"
    },
    {
        "id": "120405",
        "nombre": "CANCHAYLLO",
        "codigo": "120405",
        "provincia_id": "1204"
    },
    {
        "id": "120406",
        "nombre": "CURICACA",
        "codigo": "120406",
        "provincia_id": "1204"
    },
    {
        "id": "120407",
        "nombre": "EL MANTARO",
        "codigo": "120407",
        "provincia_id": "1204"
    },
    {
        "id": "120408",
        "nombre": "HUAMALI",
        "codigo": "120408",
        "provincia_id": "1204"
    },
    {
        "id": "120409",
        "nombre": "HUARIPAMPA",
        "codigo": "120409",
        "provincia_id": "1204"
    },
    {
        "id": "120410",
        "nombre": "HUERTAS",
        "codigo": "120410",
        "provincia_id": "1204"
    },
    {
        "id": "120411",
        "nombre": "JANJAILLO",
        "codigo": "120411",
        "provincia_id": "1204"
    },
    {
        "id": "120412",
        "nombre": "JULCAN",
        "codigo": "120412",
        "provincia_id": "1204"
    },
    {
        "id": "120413",
        "nombre": "LEONOR ORDOÑEZ",
        "codigo": "120413",
        "provincia_id": "1204"
    },
    {
        "id": "120414",
        "nombre": "LLOCLLAPAMPA",
        "codigo": "120414",
        "provincia_id": "1204"
    },
    {
        "id": "120415",
        "nombre": "MARCO",
        "codigo": "120415",
        "provincia_id": "1204"
    },
    {
        "id": "120416",
        "nombre": "MASMA",
        "codigo": "120416",
        "provincia_id": "1204"
    },
    {
        "id": "120417",
        "nombre": "MASMA CHICCHE",
        "codigo": "120417",
        "provincia_id": "1204"
    },
    {
        "id": "120418",
        "nombre": "MOLINOS",
        "codigo": "120418",
        "provincia_id": "1204"
    },
    {
        "id": "120419",
        "nombre": "MONOBAMBA",
        "codigo": "120419",
        "provincia_id": "1204"
    },
    {
        "id": "120420",
        "nombre": "MUQUI",
        "codigo": "120420",
        "provincia_id": "1204"
    },
    {
        "id": "120421",
        "nombre": "MUQUIYAUYO",
        "codigo": "120421",
        "provincia_id": "1204"
    },
    {
        "id": "120422",
        "nombre": "PACA",
        "codigo": "120422",
        "provincia_id": "1204"
    },
    {
        "id": "120423",
        "nombre": "PACCHA",
        "codigo": "120423",
        "provincia_id": "1204"
    },
    {
        "id": "120424",
        "nombre": "PANCAN",
        "codigo": "120424",
        "provincia_id": "1204"
    },
    {
        "id": "120425",
        "nombre": "PARCO",
        "codigo": "120425",
        "provincia_id": "1204"
    },
    {
        "id": "120426",
        "nombre": "POMACANCHA",
        "codigo": "120426",
        "provincia_id": "1204"
    },
    {
        "id": "120427",
        "nombre": "RICRAN",
        "codigo": "120427",
        "provincia_id": "1204"
    },
    {
        "id": "120428",
        "nombre": "SAN LORENZO",
        "codigo": "120428",
        "provincia_id": "1204"
    },
    {
        "id": "120429",
        "nombre": "SAN PEDRO DE CHUNAN",
        "codigo": "120429",
        "provincia_id": "1204"
    },
    {
        "id": "120430",
        "nombre": "SAUSA",
        "codigo": "120430",
        "provincia_id": "1204"
    },
    {
        "id": "120431",
        "nombre": "SINCOS",
        "codigo": "120431",
        "provincia_id": "1204"
    },
    {
        "id": "120432",
        "nombre": "TUNAN MARCA",
        "codigo": "120432",
        "provincia_id": "1204"
    },
    {
        "id": "120433",
        "nombre": "YAULI",
        "codigo": "120433",
        "provincia_id": "1204"
    },
    {
        "id": "120434",
        "nombre": "YAUYOS",
        "codigo": "120434",
        "provincia_id": "1204"
    },
    {
        "id": "120501",
        "nombre": "JUNIN",
        "codigo": "120501",
        "provincia_id": "1205"
    },
    {
        "id": "120502",
        "nombre": "CARHUAMAYO",
        "codigo": "120502",
        "provincia_id": "1205"
    },
    {
        "id": "120503",
        "nombre": "ONDORES",
        "codigo": "120503",
        "provincia_id": "1205"
    },
    {
        "id": "120504",
        "nombre": "ULCUMAYO",
        "codigo": "120504",
        "provincia_id": "1205"
    },
    {
        "id": "120601",
        "nombre": "SATIPO",
        "codigo": "120601",
        "provincia_id": "1206"
    },
    {
        "id": "120602",
        "nombre": "COVIRIALI",
        "codigo": "120602",
        "provincia_id": "1206"
    },
    {
        "id": "120603",
        "nombre": "LLAYLLA",
        "codigo": "120603",
        "provincia_id": "1206"
    },
    {
        "id": "120604",
        "nombre": "MAZAMARI",
        "codigo": "120604",
        "provincia_id": "1206"
    },
    {
        "id": "120605",
        "nombre": "PAMPA HERMOSA",
        "codigo": "120605",
        "provincia_id": "1206"
    },
    {
        "id": "120606",
        "nombre": "PANGOA",
        "codigo": "120606",
        "provincia_id": "1206"
    },
    {
        "id": "120607",
        "nombre": "RIO NEGRO",
        "codigo": "120607",
        "provincia_id": "1206"
    },
    {
        "id": "120608",
        "nombre": "RIO TAMBO",
        "codigo": "120608",
        "provincia_id": "1206"
    },
    {
        "id": "120609",
        "nombre": "VIZCATAN DEL ENE",
        "codigo": "120609",
        "provincia_id": "1206"
    },
    {
        "id": "120701",
        "nombre": "TARMA",
        "codigo": "120701",
        "provincia_id": "1207"
    },
    {
        "id": "120702",
        "nombre": "ACOBAMBA",
        "codigo": "120702",
        "provincia_id": "1207"
    },
    {
        "id": "120703",
        "nombre": "HUARICOLCA",
        "codigo": "120703",
        "provincia_id": "1207"
    },
    {
        "id": "120704",
        "nombre": "HUASAHUASI",
        "codigo": "120704",
        "provincia_id": "1207"
    },
    {
        "id": "120705",
        "nombre": "LA UNION",
        "codigo": "120705",
        "provincia_id": "1207"
    },
    {
        "id": "120706",
        "nombre": "PALCA",
        "codigo": "120706",
        "provincia_id": "1207"
    },
    {
        "id": "120707",
        "nombre": "PALCAMAYO",
        "codigo": "120707",
        "provincia_id": "1207"
    },
    {
        "id": "120708",
        "nombre": "SAN PEDRO DE CAJAS",
        "codigo": "120708",
        "provincia_id": "1207"
    },
    {
        "id": "120709",
        "nombre": "TAPO",
        "codigo": "120709",
        "provincia_id": "1207"
    },
    {
        "id": "120801",
        "nombre": "LA OROYA",
        "codigo": "120801",
        "provincia_id": "1208"
    },
    {
        "id": "120802",
        "nombre": "CHACAPALPA",
        "codigo": "120802",
        "provincia_id": "1208"
    },
    {
        "id": "120803",
        "nombre": "HUAY-HUAY",
        "codigo": "120803",
        "provincia_id": "1208"
    },
    {
        "id": "120804",
        "nombre": "MARCAPOMACOCHA",
        "codigo": "120804",
        "provincia_id": "1208"
    },
    {
        "id": "120805",
        "nombre": "MOROCOCHA",
        "codigo": "120805",
        "provincia_id": "1208"
    },
    {
        "id": "120806",
        "nombre": "PACCHA",
        "codigo": "120806",
        "provincia_id": "1208"
    },
    {
        "id": "120807",
        "nombre": "SANTA BARBARA DE CARHUACAYAN",
        "codigo": "120807",
        "provincia_id": "1208"
    },
    {
        "id": "120808",
        "nombre": "SANTA ROSA DE SACCO",
        "codigo": "120808",
        "provincia_id": "1208"
    },
    {
        "id": "120809",
        "nombre": "SUITUCANCHA",
        "codigo": "120809",
        "provincia_id": "1208"
    },
    {
        "id": "120810",
        "nombre": "YAULI",
        "codigo": "120810",
        "provincia_id": "1208"
    },
    {
        "id": "120901",
        "nombre": "CHUPACA",
        "codigo": "120901",
        "provincia_id": "1209"
    },
    {
        "id": "120902",
        "nombre": "AHUAC",
        "codigo": "120902",
        "provincia_id": "1209"
    },
    {
        "id": "120903",
        "nombre": "CHONGOS BAJO",
        "codigo": "120903",
        "provincia_id": "1209"
    },
    {
        "id": "120904",
        "nombre": "HUACHAC",
        "codigo": "120904",
        "provincia_id": "1209"
    },
    {
        "id": "120905",
        "nombre": "HUAMANCACA CHICO",
        "codigo": "120905",
        "provincia_id": "1209"
    },
    {
        "id": "120906",
        "nombre": "SAN JUAN DE YSCOS",
        "codigo": "120906",
        "provincia_id": "1209"
    },
    {
        "id": "120907",
        "nombre": "SAN JUAN DE JARPA",
        "codigo": "120907",
        "provincia_id": "1209"
    },
    {
        "id": "120908",
        "nombre": "TRES DE DICIEMBRE",
        "codigo": "120908",
        "provincia_id": "1209"
    },
    {
        "id": "120909",
        "nombre": "YANACANCHA",
        "codigo": "120909",
        "provincia_id": "1209"
    },
    {
        "id": "130101",
        "nombre": "TRUJILLO",
        "codigo": "130101",
        "provincia_id": "1301"
    },
    {
        "id": "130102",
        "nombre": "EL PORVENIR",
        "codigo": "130102",
        "provincia_id": "1301"
    },
    {
        "id": "130103",
        "nombre": "FLORENCIA DE MORA",
        "codigo": "130103",
        "provincia_id": "1301"
    },
    {
        "id": "130104",
        "nombre": "HUANCHACO",
        "codigo": "130104",
        "provincia_id": "1301"
    },
    {
        "id": "130105",
        "nombre": "LA ESPERANZA",
        "codigo": "130105",
        "provincia_id": "1301"
    },
    {
        "id": "130106",
        "nombre": "LAREDO",
        "codigo": "130106",
        "provincia_id": "1301"
    },
    {
        "id": "130107",
        "nombre": "MOCHE",
        "codigo": "130107",
        "provincia_id": "1301"
    },
    {
        "id": "130108",
        "nombre": "POROTO",
        "codigo": "130108",
        "provincia_id": "1301"
    },
    {
        "id": "130109",
        "nombre": "SALAVERRY",
        "codigo": "130109",
        "provincia_id": "1301"
    },
    {
        "id": "130110",
        "nombre": "SIMBAL",
        "codigo": "130110",
        "provincia_id": "1301"
    },
    {
        "id": "130111",
        "nombre": "VICTOR LARCO HERRERA",
        "codigo": "130111",
        "provincia_id": "1301"
    },
    {
        "id": "130201",
        "nombre": "ASCOPE",
        "codigo": "130201",
        "provincia_id": "1302"
    },
    {
        "id": "130202",
        "nombre": "CHICAMA",
        "codigo": "130202",
        "provincia_id": "1302"
    },
    {
        "id": "130203",
        "nombre": "CHOCOPE",
        "codigo": "130203",
        "provincia_id": "1302"
    },
    {
        "id": "130204",
        "nombre": "MAGDALENA DE CAO",
        "codigo": "130204",
        "provincia_id": "1302"
    },
    {
        "id": "130205",
        "nombre": "PAIJAN",
        "codigo": "130205",
        "provincia_id": "1302"
    },
    {
        "id": "130206",
        "nombre": "RAZURI",
        "codigo": "130206",
        "provincia_id": "1302"
    },
    {
        "id": "130207",
        "nombre": "SANTIAGO DE CAO",
        "codigo": "130207",
        "provincia_id": "1302"
    },
    {
        "id": "130208",
        "nombre": "CASA GRANDE",
        "codigo": "130208",
        "provincia_id": "1302"
    },
    {
        "id": "130301",
        "nombre": "BOLIVAR",
        "codigo": "130301",
        "provincia_id": "1303"
    },
    {
        "id": "130302",
        "nombre": "BAMBAMARCA",
        "codigo": "130302",
        "provincia_id": "1303"
    },
    {
        "id": "130303",
        "nombre": "CONDORMARCA",
        "codigo": "130303",
        "provincia_id": "1303"
    },
    {
        "id": "130304",
        "nombre": "LONGOTEA",
        "codigo": "130304",
        "provincia_id": "1303"
    },
    {
        "id": "130305",
        "nombre": "UCHUMARCA",
        "codigo": "130305",
        "provincia_id": "1303"
    },
    {
        "id": "130306",
        "nombre": "UCUNCHA",
        "codigo": "130306",
        "provincia_id": "1303"
    },
    {
        "id": "130401",
        "nombre": "CHEPEN",
        "codigo": "130401",
        "provincia_id": "1304"
    },
    {
        "id": "130402",
        "nombre": "PACANGA",
        "codigo": "130402",
        "provincia_id": "1304"
    },
    {
        "id": "130403",
        "nombre": "PUEBLO NUEVO",
        "codigo": "130403",
        "provincia_id": "1304"
    },
    {
        "id": "130501",
        "nombre": "JULCAN",
        "codigo": "130501",
        "provincia_id": "1305"
    },
    {
        "id": "130502",
        "nombre": "CALAMARCA",
        "codigo": "130502",
        "provincia_id": "1305"
    },
    {
        "id": "130503",
        "nombre": "CARABAMBA",
        "codigo": "130503",
        "provincia_id": "1305"
    },
    {
        "id": "130504",
        "nombre": "HUASO",
        "codigo": "130504",
        "provincia_id": "1305"
    },
    {
        "id": "130601",
        "nombre": "OTUZCO",
        "codigo": "130601",
        "provincia_id": "1306"
    },
    {
        "id": "130602",
        "nombre": "AGALLPAMPA",
        "codigo": "130602",
        "provincia_id": "1306"
    },
    {
        "id": "130604",
        "nombre": "CHARAT",
        "codigo": "130604",
        "provincia_id": "1306"
    },
    {
        "id": "130605",
        "nombre": "HUARANCHAL",
        "codigo": "130605",
        "provincia_id": "1306"
    },
    {
        "id": "130606",
        "nombre": "LA CUESTA",
        "codigo": "130606",
        "provincia_id": "1306"
    },
    {
        "id": "130608",
        "nombre": "MACHE",
        "codigo": "130608",
        "provincia_id": "1306"
    },
    {
        "id": "130610",
        "nombre": "PARANDAY",
        "codigo": "130610",
        "provincia_id": "1306"
    },
    {
        "id": "130611",
        "nombre": "SALPO",
        "codigo": "130611",
        "provincia_id": "1306"
    },
    {
        "id": "130613",
        "nombre": "SINSICAP",
        "codigo": "130613",
        "provincia_id": "1306"
    },
    {
        "id": "130614",
        "nombre": "USQUIL",
        "codigo": "130614",
        "provincia_id": "1306"
    },
    {
        "id": "130701",
        "nombre": "SAN PEDRO DE LLOC",
        "codigo": "130701",
        "provincia_id": "1307"
    },
    {
        "id": "130702",
        "nombre": "GUADALUPE",
        "codigo": "130702",
        "provincia_id": "1307"
    },
    {
        "id": "130703",
        "nombre": "JEQUETEPEQUE",
        "codigo": "130703",
        "provincia_id": "1307"
    },
    {
        "id": "130704",
        "nombre": "PACASMAYO",
        "codigo": "130704",
        "provincia_id": "1307"
    },
    {
        "id": "130705",
        "nombre": "SAN JOSE",
        "codigo": "130705",
        "provincia_id": "1307"
    },
    {
        "id": "130801",
        "nombre": "TAYABAMBA",
        "codigo": "130801",
        "provincia_id": "1308"
    },
    {
        "id": "130802",
        "nombre": "BULDIBUYO",
        "codigo": "130802",
        "provincia_id": "1308"
    },
    {
        "id": "130803",
        "nombre": "CHILLIA",
        "codigo": "130803",
        "provincia_id": "1308"
    },
    {
        "id": "130804",
        "nombre": "HUANCASPATA",
        "codigo": "130804",
        "provincia_id": "1308"
    },
    {
        "id": "130805",
        "nombre": "HUAYLILLAS",
        "codigo": "130805",
        "provincia_id": "1308"
    },
    {
        "id": "130806",
        "nombre": "HUAYO",
        "codigo": "130806",
        "provincia_id": "1308"
    },
    {
        "id": "130807",
        "nombre": "ONGON",
        "codigo": "130807",
        "provincia_id": "1308"
    },
    {
        "id": "130808",
        "nombre": "PARCOY",
        "codigo": "130808",
        "provincia_id": "1308"
    },
    {
        "id": "130809",
        "nombre": "PATAZ",
        "codigo": "130809",
        "provincia_id": "1308"
    },
    {
        "id": "130810",
        "nombre": "PIAS",
        "codigo": "130810",
        "provincia_id": "1308"
    },
    {
        "id": "130811",
        "nombre": "SANTIAGO DE CHALLAS",
        "codigo": "130811",
        "provincia_id": "1308"
    },
    {
        "id": "130812",
        "nombre": "TAURIJA",
        "codigo": "130812",
        "provincia_id": "1308"
    },
    {
        "id": "130813",
        "nombre": "URPAY",
        "codigo": "130813",
        "provincia_id": "1308"
    },
    {
        "id": "130901",
        "nombre": "HUAMACHUCO",
        "codigo": "130901",
        "provincia_id": "1309"
    },
    {
        "id": "130902",
        "nombre": "CHUGAY",
        "codigo": "130902",
        "provincia_id": "1309"
    },
    {
        "id": "130903",
        "nombre": "COCHORCO",
        "codigo": "130903",
        "provincia_id": "1309"
    },
    {
        "id": "130904",
        "nombre": "CURGOS",
        "codigo": "130904",
        "provincia_id": "1309"
    },
    {
        "id": "130905",
        "nombre": "MARCABAL",
        "codigo": "130905",
        "provincia_id": "1309"
    },
    {
        "id": "130906",
        "nombre": "SANAGORAN",
        "codigo": "130906",
        "provincia_id": "1309"
    },
    {
        "id": "130907",
        "nombre": "SARIN",
        "codigo": "130907",
        "provincia_id": "1309"
    },
    {
        "id": "130908",
        "nombre": "SARTIMBAMBA",
        "codigo": "130908",
        "provincia_id": "1309"
    },
    {
        "id": "131001",
        "nombre": "SANTIAGO DE CHUCO",
        "codigo": "131001",
        "provincia_id": "1310"
    },
    {
        "id": "131002",
        "nombre": "ANGASMARCA",
        "codigo": "131002",
        "provincia_id": "1310"
    },
    {
        "id": "131003",
        "nombre": "CACHICADAN",
        "codigo": "131003",
        "provincia_id": "1310"
    },
    {
        "id": "131004",
        "nombre": "MOLLEBAMBA",
        "codigo": "131004",
        "provincia_id": "1310"
    },
    {
        "id": "131005",
        "nombre": "MOLLEPATA",
        "codigo": "131005",
        "provincia_id": "1310"
    },
    {
        "id": "131006",
        "nombre": "QUIRUVILCA",
        "codigo": "131006",
        "provincia_id": "1310"
    },
    {
        "id": "131007",
        "nombre": "SANTA CRUZ DE CHUCA",
        "codigo": "131007",
        "provincia_id": "1310"
    },
    {
        "id": "131008",
        "nombre": "SITABAMBA",
        "codigo": "131008",
        "provincia_id": "1310"
    },
    {
        "id": "131101",
        "nombre": "CASCAS",
        "codigo": "131101",
        "provincia_id": "1311"
    },
    {
        "id": "131102",
        "nombre": "LUCMA",
        "codigo": "131102",
        "provincia_id": "1311"
    },
    {
        "id": "131103",
        "nombre": "MARMOT",
        "codigo": "131103",
        "provincia_id": "1311"
    },
    {
        "id": "131104",
        "nombre": "SAYAPULLO",
        "codigo": "131104",
        "provincia_id": "1311"
    },
    {
        "id": "131201",
        "nombre": "VIRU",
        "codigo": "131201",
        "provincia_id": "1312"
    },
    {
        "id": "131202",
        "nombre": "CHAO",
        "codigo": "131202",
        "provincia_id": "1312"
    },
    {
        "id": "131203",
        "nombre": "GUADALUPITO",
        "codigo": "131203",
        "provincia_id": "1312"
    },
    {
        "id": "140101",
        "nombre": "CHICLAYO",
        "codigo": "140101",
        "provincia_id": "1401"
    },
    {
        "id": "140102",
        "nombre": "CHONGOYAPE",
        "codigo": "140102",
        "provincia_id": "1401"
    },
    {
        "id": "140103",
        "nombre": "ETEN",
        "codigo": "140103",
        "provincia_id": "1401"
    },
    {
        "id": "140104",
        "nombre": "ETEN PUERTO",
        "codigo": "140104",
        "provincia_id": "1401"
    },
    {
        "id": "140105",
        "nombre": "JOSE LEONARDO ORTIZ",
        "codigo": "140105",
        "provincia_id": "1401"
    },
    {
        "id": "140106",
        "nombre": "LA VICTORIA",
        "codigo": "140106",
        "provincia_id": "1401"
    },
    {
        "id": "140107",
        "nombre": "LAGUNAS",
        "codigo": "140107",
        "provincia_id": "1401"
    },
    {
        "id": "140108",
        "nombre": "MONSEFU",
        "codigo": "140108",
        "provincia_id": "1401"
    },
    {
        "id": "140109",
        "nombre": "NUEVA ARICA",
        "codigo": "140109",
        "provincia_id": "1401"
    },
    {
        "id": "140110",
        "nombre": "OYOTUN",
        "codigo": "140110",
        "provincia_id": "1401"
    },
    {
        "id": "140111",
        "nombre": "PICSI",
        "codigo": "140111",
        "provincia_id": "1401"
    },
    {
        "id": "140112",
        "nombre": "PIMENTEL",
        "codigo": "140112",
        "provincia_id": "1401"
    },
    {
        "id": "140113",
        "nombre": "REQUE",
        "codigo": "140113",
        "provincia_id": "1401"
    },
    {
        "id": "140114",
        "nombre": "SANTA ROSA",
        "codigo": "140114",
        "provincia_id": "1401"
    },
    {
        "id": "140115",
        "nombre": "SAÑA",
        "codigo": "140115",
        "provincia_id": "1401"
    },
    {
        "id": "140116",
        "nombre": "CAYALTI",
        "codigo": "140116",
        "provincia_id": "1401"
    },
    {
        "id": "140117",
        "nombre": "PATAPO",
        "codigo": "140117",
        "provincia_id": "1401"
    },
    {
        "id": "140118",
        "nombre": "POMALCA",
        "codigo": "140118",
        "provincia_id": "1401"
    },
    {
        "id": "140119",
        "nombre": "PUCALA",
        "codigo": "140119",
        "provincia_id": "1401"
    },
    {
        "id": "140120",
        "nombre": "TUMAN",
        "codigo": "140120",
        "provincia_id": "1401"
    },
    {
        "id": "140201",
        "nombre": "FERREÑAFE",
        "codigo": "140201",
        "provincia_id": "1402"
    },
    {
        "id": "140202",
        "nombre": "CAÑARIS",
        "codigo": "140202",
        "provincia_id": "1402"
    },
    {
        "id": "140203",
        "nombre": "INCAHUASI",
        "codigo": "140203",
        "provincia_id": "1402"
    },
    {
        "id": "140204",
        "nombre": "MANUEL ANTONIO MESONES MURO",
        "codigo": "140204",
        "provincia_id": "1402"
    },
    {
        "id": "140205",
        "nombre": "PITIPO",
        "codigo": "140205",
        "provincia_id": "1402"
    },
    {
        "id": "140206",
        "nombre": "PUEBLO NUEVO",
        "codigo": "140206",
        "provincia_id": "1402"
    },
    {
        "id": "140301",
        "nombre": "LAMBAYEQUE",
        "codigo": "140301",
        "provincia_id": "1403"
    },
    {
        "id": "140302",
        "nombre": "CHOCHOPE",
        "codigo": "140302",
        "provincia_id": "1403"
    },
    {
        "id": "140303",
        "nombre": "ILLIMO",
        "codigo": "140303",
        "provincia_id": "1403"
    },
    {
        "id": "140304",
        "nombre": "JAYANCA",
        "codigo": "140304",
        "provincia_id": "1403"
    },
    {
        "id": "140305",
        "nombre": "MOCHUMI",
        "codigo": "140305",
        "provincia_id": "1403"
    },
    {
        "id": "140306",
        "nombre": "MORROPE",
        "codigo": "140306",
        "provincia_id": "1403"
    },
    {
        "id": "140307",
        "nombre": "MOTUPE",
        "codigo": "140307",
        "provincia_id": "1403"
    },
    {
        "id": "140308",
        "nombre": "OLMOS",
        "codigo": "140308",
        "provincia_id": "1403"
    },
    {
        "id": "140309",
        "nombre": "PACORA",
        "codigo": "140309",
        "provincia_id": "1403"
    },
    {
        "id": "140310",
        "nombre": "SALAS",
        "codigo": "140310",
        "provincia_id": "1403"
    },
    {
        "id": "140311",
        "nombre": "SAN JOSE",
        "codigo": "140311",
        "provincia_id": "1403"
    },
    {
        "id": "140312",
        "nombre": "TUCUME",
        "codigo": "140312",
        "provincia_id": "1403"
    },
    {
        "id": "150101",
        "nombre": "LIMA",
        "codigo": "150101",
        "provincia_id": "1501"
    },
    {
        "id": "150102",
        "nombre": "ANCON",
        "codigo": "150102",
        "provincia_id": "1501"
    },
    {
        "id": "150103",
        "nombre": "ATE",
        "codigo": "150103",
        "provincia_id": "1501"
    },
    {
        "id": "150104",
        "nombre": "BARRANCO",
        "codigo": "150104",
        "provincia_id": "1501"
    },
    {
        "id": "150105",
        "nombre": "BREÑA",
        "codigo": "150105",
        "provincia_id": "1501"
    },
    {
        "id": "150106",
        "nombre": "CARABAYLLO",
        "codigo": "150106",
        "provincia_id": "1501"
    },
    {
        "id": "150107",
        "nombre": "CHACLACAYO",
        "codigo": "150107",
        "provincia_id": "1501"
    },
    {
        "id": "150108",
        "nombre": "CHORRILLOS",
        "codigo": "150108",
        "provincia_id": "1501"
    },
    {
        "id": "150109",
        "nombre": "CIENEGUILLA",
        "codigo": "150109",
        "provincia_id": "1501"
    },
    {
        "id": "150110",
        "nombre": "COMAS",
        "codigo": "150110",
        "provincia_id": "1501"
    },
    {
        "id": "150111",
        "nombre": "EL AGUSTINO",
        "codigo": "150111",
        "provincia_id": "1501"
    },
    {
        "id": "150112",
        "nombre": "INDEPENDENCIA",
        "codigo": "150112",
        "provincia_id": "1501"
    },
    {
        "id": "150113",
        "nombre": "JESUS MARIA",
        "codigo": "150113",
        "provincia_id": "1501"
    },
    {
        "id": "150114",
        "nombre": "LA MOLINA",
        "codigo": "150114",
        "provincia_id": "1501"
    },
    {
        "id": "150115",
        "nombre": "LA VICTORIA",
        "codigo": "150115",
        "provincia_id": "1501"
    },
    {
        "id": "150116",
        "nombre": "LINCE",
        "codigo": "150116",
        "provincia_id": "1501"
    },
    {
        "id": "150117",
        "nombre": "LOS OLIVOS",
        "codigo": "150117",
        "provincia_id": "1501"
    },
    {
        "id": "150118",
        "nombre": "LURIGANCHO",
        "codigo": "150118",
        "provincia_id": "1501"
    },
    {
        "id": "150119",
        "nombre": "LURIN",
        "codigo": "150119",
        "provincia_id": "1501"
    },
    {
        "id": "150120",
        "nombre": "MAGDALENA DEL MAR",
        "codigo": "150120",
        "provincia_id": "1501"
    },
    {
        "id": "150121",
        "nombre": "PUEBLO LIBRE",
        "codigo": "150121",
        "provincia_id": "1501"
    },
    {
        "id": "150122",
        "nombre": "MIRAFLORES",
        "codigo": "150122",
        "provincia_id": "1501"
    },
    {
        "id": "150123",
        "nombre": "PACHACAMAC",
        "codigo": "150123",
        "provincia_id": "1501"
    },
    {
        "id": "150124",
        "nombre": "PUCUSANA",
        "codigo": "150124",
        "provincia_id": "1501"
    },
    {
        "id": "150125",
        "nombre": "PUENTE PIEDRA",
        "codigo": "150125",
        "provincia_id": "1501"
    },
    {
        "id": "150126",
        "nombre": "PUNTA HERMOSA",
        "codigo": "150126",
        "provincia_id": "1501"
    },
    {
        "id": "150127",
        "nombre": "PUNTA NEGRA",
        "codigo": "150127",
        "provincia_id": "1501"
    },
    {
        "id": "150128",
        "nombre": "RIMAC",
        "codigo": "150128",
        "provincia_id": "1501"
    },
    {
        "id": "150129",
        "nombre": "SAN BARTOLO",
        "codigo": "150129",
        "provincia_id": "1501"
    },
    {
        "id": "150130",
        "nombre": "SAN BORJA",
        "codigo": "150130",
        "provincia_id": "1501"
    },
    {
        "id": "150131",
        "nombre": "SAN ISIDRO",
        "codigo": "150131",
        "provincia_id": "1501"
    },
    {
        "id": "150132",
        "nombre": "SAN JUAN DE LURIGANCHO",
        "codigo": "150132",
        "provincia_id": "1501"
    },
    {
        "id": "150133",
        "nombre": "SAN JUAN DE MIRAFLORES",
        "codigo": "150133",
        "provincia_id": "1501"
    },
    {
        "id": "150134",
        "nombre": "SAN LUIS",
        "codigo": "150134",
        "provincia_id": "1501"
    },
    {
        "id": "150135",
        "nombre": "SAN MARTIN DE PORRES",
        "codigo": "150135",
        "provincia_id": "1501"
    },
    {
        "id": "150136",
        "nombre": "SAN MIGUEL",
        "codigo": "150136",
        "provincia_id": "1501"
    },
    {
        "id": "150137",
        "nombre": "SANTA ANITA",
        "codigo": "150137",
        "provincia_id": "1501"
    },
    {
        "id": "150138",
        "nombre": "SANTA MARIA DEL MAR",
        "codigo": "150138",
        "provincia_id": "1501"
    },
    {
        "id": "150139",
        "nombre": "SANTA ROSA",
        "codigo": "150139",
        "provincia_id": "1501"
    },
    {
        "id": "150140",
        "nombre": "SANTIAGO DE SURCO",
        "codigo": "150140",
        "provincia_id": "1501"
    },
    {
        "id": "150141",
        "nombre": "SURQUILLO",
        "codigo": "150141",
        "provincia_id": "1501"
    },
    {
        "id": "150142",
        "nombre": "VILLA EL SALVADOR",
        "codigo": "150142",
        "provincia_id": "1501"
    },
    {
        "id": "150143",
        "nombre": "VILLA MARIA DEL TRIUNFO",
        "codigo": "150143",
        "provincia_id": "1501"
    },
    {
        "id": "150144",
        "nombre": "SANTA MARIA DE HUACHIPA",
        "codigo": "150144",
        "provincia_id": "1501"
    },
    {
        "id": "150201",
        "nombre": "BARRANCA",
        "codigo": "150201",
        "provincia_id": "1502"
    },
    {
        "id": "150202",
        "nombre": "PARAMONGA",
        "codigo": "150202",
        "provincia_id": "1502"
    },
    {
        "id": "150203",
        "nombre": "PATIVILCA",
        "codigo": "150203",
        "provincia_id": "1502"
    },
    {
        "id": "150204",
        "nombre": "SUPE",
        "codigo": "150204",
        "provincia_id": "1502"
    },
    {
        "id": "150205",
        "nombre": "SUPE PUERTO",
        "codigo": "150205",
        "provincia_id": "1502"
    },
    {
        "id": "150301",
        "nombre": "CAJATAMBO",
        "codigo": "150301",
        "provincia_id": "1503"
    },
    {
        "id": "150302",
        "nombre": "COPA",
        "codigo": "150302",
        "provincia_id": "1503"
    },
    {
        "id": "150303",
        "nombre": "GORGOR",
        "codigo": "150303",
        "provincia_id": "1503"
    },
    {
        "id": "150304",
        "nombre": "HUANCAPON",
        "codigo": "150304",
        "provincia_id": "1503"
    },
    {
        "id": "150305",
        "nombre": "MANAS",
        "codigo": "150305",
        "provincia_id": "1503"
    },
    {
        "id": "150401",
        "nombre": "CANTA",
        "codigo": "150401",
        "provincia_id": "1504"
    },
    {
        "id": "150402",
        "nombre": "ARAHUAY",
        "codigo": "150402",
        "provincia_id": "1504"
    },
    {
        "id": "150403",
        "nombre": "HUAMANTANGA",
        "codigo": "150403",
        "provincia_id": "1504"
    },
    {
        "id": "150404",
        "nombre": "HUAROS",
        "codigo": "150404",
        "provincia_id": "1504"
    },
    {
        "id": "150405",
        "nombre": "LACHAQUI",
        "codigo": "150405",
        "provincia_id": "1504"
    },
    {
        "id": "150406",
        "nombre": "SAN BUENAVENTURA",
        "codigo": "150406",
        "provincia_id": "1504"
    },
    {
        "id": "150407",
        "nombre": "SANTA ROSA DE QUIVES",
        "codigo": "150407",
        "provincia_id": "1504"
    },
    {
        "id": "150501",
        "nombre": "SAN VICENTE DE CAÑETE",
        "codigo": "150501",
        "provincia_id": "1505"
    },
    {
        "id": "150502",
        "nombre": "ASIA",
        "codigo": "150502",
        "provincia_id": "1505"
    },
    {
        "id": "150503",
        "nombre": "CALANGO",
        "codigo": "150503",
        "provincia_id": "1505"
    },
    {
        "id": "150504",
        "nombre": "CERRO AZUL",
        "codigo": "150504",
        "provincia_id": "1505"
    },
    {
        "id": "150505",
        "nombre": "CHILCA",
        "codigo": "150505",
        "provincia_id": "1505"
    },
    {
        "id": "150506",
        "nombre": "COAYLLO",
        "codigo": "150506",
        "provincia_id": "1505"
    },
    {
        "id": "150507",
        "nombre": "IMPERIAL",
        "codigo": "150507",
        "provincia_id": "1505"
    },
    {
        "id": "150508",
        "nombre": "LUNAHUANA",
        "codigo": "150508",
        "provincia_id": "1505"
    },
    {
        "id": "150509",
        "nombre": "MALA",
        "codigo": "150509",
        "provincia_id": "1505"
    },
    {
        "id": "150510",
        "nombre": "NUEVO IMPERIAL",
        "codigo": "150510",
        "provincia_id": "1505"
    },
    {
        "id": "150511",
        "nombre": "PACARAN",
        "codigo": "150511",
        "provincia_id": "1505"
    },
    {
        "id": "150512",
        "nombre": "QUILMANA",
        "codigo": "150512",
        "provincia_id": "1505"
    },
    {
        "id": "150513",
        "nombre": "SAN ANTONIO",
        "codigo": "150513",
        "provincia_id": "1505"
    },
    {
        "id": "150514",
        "nombre": "SAN LUIS",
        "codigo": "150514",
        "provincia_id": "1505"
    },
    {
        "id": "150515",
        "nombre": "SANTA CRUZ DE FLORES",
        "codigo": "150515",
        "provincia_id": "1505"
    },
    {
        "id": "150516",
        "nombre": "ZUÑIGA",
        "codigo": "150516",
        "provincia_id": "1505"
    },
    {
        "id": "150601",
        "nombre": "HUARAL",
        "codigo": "150601",
        "provincia_id": "1506"
    },
    {
        "id": "150602",
        "nombre": "ATAVILLOS ALTO",
        "codigo": "150602",
        "provincia_id": "1506"
    },
    {
        "id": "150603",
        "nombre": "ATAVILLOS BAJO",
        "codigo": "150603",
        "provincia_id": "1506"
    },
    {
        "id": "150604",
        "nombre": "AUCALLAMA",
        "codigo": "150604",
        "provincia_id": "1506"
    },
    {
        "id": "150605",
        "nombre": "CHANCAY",
        "codigo": "150605",
        "provincia_id": "1506"
    },
    {
        "id": "150606",
        "nombre": "IHUARI",
        "codigo": "150606",
        "provincia_id": "1506"
    },
    {
        "id": "150607",
        "nombre": "LAMPIAN",
        "codigo": "150607",
        "provincia_id": "1506"
    },
    {
        "id": "150608",
        "nombre": "PACARAOS",
        "codigo": "150608",
        "provincia_id": "1506"
    },
    {
        "id": "150609",
        "nombre": "SAN MIGUEL DE ACOS",
        "codigo": "150609",
        "provincia_id": "1506"
    },
    {
        "id": "150610",
        "nombre": "SANTA CRUZ DE ANDAMARCA",
        "codigo": "150610",
        "provincia_id": "1506"
    },
    {
        "id": "150611",
        "nombre": "SUMBILCA",
        "codigo": "150611",
        "provincia_id": "1506"
    },
    {
        "id": "150612",
        "nombre": "VEINTISIETE DE NOVIEMBRE",
        "codigo": "150612",
        "provincia_id": "1506"
    },
    {
        "id": "150701",
        "nombre": "MATUCANA",
        "codigo": "150701",
        "provincia_id": "1507"
    },
    {
        "id": "150702",
        "nombre": "ANTIOQUIA",
        "codigo": "150702",
        "provincia_id": "1507"
    },
    {
        "id": "150703",
        "nombre": "CALLAHUANCA",
        "codigo": "150703",
        "provincia_id": "1507"
    },
    {
        "id": "150704",
        "nombre": "CARAMPOMA",
        "codigo": "150704",
        "provincia_id": "1507"
    },
    {
        "id": "150705",
        "nombre": "CHICLA",
        "codigo": "150705",
        "provincia_id": "1507"
    },
    {
        "id": "150706",
        "nombre": "CUENCA",
        "codigo": "150706",
        "provincia_id": "1507"
    },
    {
        "id": "150707",
        "nombre": "HUACHUPAMPA",
        "codigo": "150707",
        "provincia_id": "1507"
    },
    {
        "id": "150708",
        "nombre": "HUANZA",
        "codigo": "150708",
        "provincia_id": "1507"
    },
    {
        "id": "150709",
        "nombre": "HUAROCHIRI",
        "codigo": "150709",
        "provincia_id": "1507"
    },
    {
        "id": "150710",
        "nombre": "LAHUAYTAMBO",
        "codigo": "150710",
        "provincia_id": "1507"
    },
    {
        "id": "150711",
        "nombre": "LANGA",
        "codigo": "150711",
        "provincia_id": "1507"
    },
    {
        "id": "150712",
        "nombre": "LARAOS",
        "codigo": "150712",
        "provincia_id": "1507"
    },
    {
        "id": "150713",
        "nombre": "MARIATANA",
        "codigo": "150713",
        "provincia_id": "1507"
    },
    {
        "id": "150714",
        "nombre": "RICARDO PALMA",
        "codigo": "150714",
        "provincia_id": "1507"
    },
    {
        "id": "150715",
        "nombre": "SAN ANDRES DE TUPICOCHA",
        "codigo": "150715",
        "provincia_id": "1507"
    },
    {
        "id": "150716",
        "nombre": "SAN ANTONIO",
        "codigo": "150716",
        "provincia_id": "1507"
    },
    {
        "id": "150717",
        "nombre": "SAN BARTOLOME",
        "codigo": "150717",
        "provincia_id": "1507"
    },
    {
        "id": "150718",
        "nombre": "SAN DAMIAN",
        "codigo": "150718",
        "provincia_id": "1507"
    },
    {
        "id": "150719",
        "nombre": "SAN JUAN DE IRIS",
        "codigo": "150719",
        "provincia_id": "1507"
    },
    {
        "id": "150720",
        "nombre": "SAN JUAN DE TANTARANCHE",
        "codigo": "150720",
        "provincia_id": "1507"
    },
    {
        "id": "150721",
        "nombre": "SAN LORENZO DE QUINTI",
        "codigo": "150721",
        "provincia_id": "1507"
    },
    {
        "id": "150722",
        "nombre": "SAN MATEO",
        "codigo": "150722",
        "provincia_id": "1507"
    },
    {
        "id": "150723",
        "nombre": "SAN MATEO DE OTAO",
        "codigo": "150723",
        "provincia_id": "1507"
    },
    {
        "id": "150724",
        "nombre": "SAN PEDRO DE CASTA",
        "codigo": "150724",
        "provincia_id": "1507"
    },
    {
        "id": "150725",
        "nombre": "SAN PEDRO DE HUANCAYRE",
        "codigo": "150725",
        "provincia_id": "1507"
    },
    {
        "id": "150726",
        "nombre": "SANGALLAYA",
        "codigo": "150726",
        "provincia_id": "1507"
    },
    {
        "id": "150727",
        "nombre": "SANTA CRUZ DE COCACHACRA",
        "codigo": "150727",
        "provincia_id": "1507"
    },
    {
        "id": "150728",
        "nombre": "SANTA EULALIA",
        "codigo": "150728",
        "provincia_id": "1507"
    },
    {
        "id": "150729",
        "nombre": "SANTIAGO DE ANCHUCAYA",
        "codigo": "150729",
        "provincia_id": "1507"
    },
    {
        "id": "150730",
        "nombre": "SANTIAGO DE TUNA",
        "codigo": "150730",
        "provincia_id": "1507"
    },
    {
        "id": "150731",
        "nombre": "SANTO DOMINGO DE LOS OLLEROS",
        "codigo": "150731",
        "provincia_id": "1507"
    },
    {
        "id": "150732",
        "nombre": "SURCO",
        "codigo": "150732",
        "provincia_id": "1507"
    },
    {
        "id": "150801",
        "nombre": "HUACHO",
        "codigo": "150801",
        "provincia_id": "1508"
    },
    {
        "id": "150802",
        "nombre": "AMBAR",
        "codigo": "150802",
        "provincia_id": "1508"
    },
    {
        "id": "150803",
        "nombre": "CALETA DE CARQUIN",
        "codigo": "150803",
        "provincia_id": "1508"
    },
    {
        "id": "150804",
        "nombre": "CHECRAS",
        "codigo": "150804",
        "provincia_id": "1508"
    },
    {
        "id": "150805",
        "nombre": "HUALMAY",
        "codigo": "150805",
        "provincia_id": "1508"
    },
    {
        "id": "150806",
        "nombre": "HUAURA",
        "codigo": "150806",
        "provincia_id": "1508"
    },
    {
        "id": "150807",
        "nombre": "LEONCIO PRADO",
        "codigo": "150807",
        "provincia_id": "1508"
    },
    {
        "id": "150808",
        "nombre": "PACCHO",
        "codigo": "150808",
        "provincia_id": "1508"
    },
    {
        "id": "150809",
        "nombre": "SANTA LEONOR",
        "codigo": "150809",
        "provincia_id": "1508"
    },
    {
        "id": "150810",
        "nombre": "SANTA MARIA",
        "codigo": "150810",
        "provincia_id": "1508"
    },
    {
        "id": "150811",
        "nombre": "SAYAN",
        "codigo": "150811",
        "provincia_id": "1508"
    },
    {
        "id": "150812",
        "nombre": "VEGUETA",
        "codigo": "150812",
        "provincia_id": "1508"
    },
    {
        "id": "150901",
        "nombre": "OYON",
        "codigo": "150901",
        "provincia_id": "1509"
    },
    {
        "id": "150902",
        "nombre": "ANDAJES",
        "codigo": "150902",
        "provincia_id": "1509"
    },
    {
        "id": "150903",
        "nombre": "CAUJUL",
        "codigo": "150903",
        "provincia_id": "1509"
    },
    {
        "id": "150904",
        "nombre": "COCHAMARCA",
        "codigo": "150904",
        "provincia_id": "1509"
    },
    {
        "id": "150905",
        "nombre": "NAVAN",
        "codigo": "150905",
        "provincia_id": "1509"
    },
    {
        "id": "150906",
        "nombre": "PACHANGARA",
        "codigo": "150906",
        "provincia_id": "1509"
    },
    {
        "id": "151001",
        "nombre": "YAUYOS",
        "codigo": "151001",
        "provincia_id": "1510"
    },
    {
        "id": "151002",
        "nombre": "ALIS",
        "codigo": "151002",
        "provincia_id": "1510"
    },
    {
        "id": "151003",
        "nombre": "AYAUCA",
        "codigo": "151003",
        "provincia_id": "1510"
    },
    {
        "id": "151004",
        "nombre": "AYAVIRI",
        "codigo": "151004",
        "provincia_id": "1510"
    },
    {
        "id": "151005",
        "nombre": "AZANGARO",
        "codigo": "151005",
        "provincia_id": "1510"
    },
    {
        "id": "151006",
        "nombre": "CACRA",
        "codigo": "151006",
        "provincia_id": "1510"
    },
    {
        "id": "151007",
        "nombre": "CARANIA",
        "codigo": "151007",
        "provincia_id": "1510"
    },
    {
        "id": "151008",
        "nombre": "CATAHUASI",
        "codigo": "151008",
        "provincia_id": "1510"
    },
    {
        "id": "151009",
        "nombre": "CHOCOS",
        "codigo": "151009",
        "provincia_id": "1510"
    },
    {
        "id": "151010",
        "nombre": "COCHAS",
        "codigo": "151010",
        "provincia_id": "1510"
    },
    {
        "id": "151011",
        "nombre": "COLONIA",
        "codigo": "151011",
        "provincia_id": "1510"
    },
    {
        "id": "151012",
        "nombre": "HONGOS",
        "codigo": "151012",
        "provincia_id": "1510"
    },
    {
        "id": "151013",
        "nombre": "HUAMPARA",
        "codigo": "151013",
        "provincia_id": "1510"
    },
    {
        "id": "151014",
        "nombre": "HUANCAYA",
        "codigo": "151014",
        "provincia_id": "1510"
    },
    {
        "id": "151015",
        "nombre": "HUANGASCAR",
        "codigo": "151015",
        "provincia_id": "1510"
    },
    {
        "id": "151016",
        "nombre": "HUANTAN",
        "codigo": "151016",
        "provincia_id": "1510"
    },
    {
        "id": "151017",
        "nombre": "HUAÑEC",
        "codigo": "151017",
        "provincia_id": "1510"
    },
    {
        "id": "151018",
        "nombre": "LARAOS",
        "codigo": "151018",
        "provincia_id": "1510"
    },
    {
        "id": "151019",
        "nombre": "LINCHA",
        "codigo": "151019",
        "provincia_id": "1510"
    },
    {
        "id": "151020",
        "nombre": "MADEAN",
        "codigo": "151020",
        "provincia_id": "1510"
    },
    {
        "id": "151021",
        "nombre": "MIRAFLORES",
        "codigo": "151021",
        "provincia_id": "1510"
    },
    {
        "id": "151022",
        "nombre": "OMAS",
        "codigo": "151022",
        "provincia_id": "1510"
    },
    {
        "id": "151023",
        "nombre": "PUTINZA",
        "codigo": "151023",
        "provincia_id": "1510"
    },
    {
        "id": "151024",
        "nombre": "QUINCHES",
        "codigo": "151024",
        "provincia_id": "1510"
    },
    {
        "id": "151025",
        "nombre": "QUINOCAY",
        "codigo": "151025",
        "provincia_id": "1510"
    },
    {
        "id": "151026",
        "nombre": "SAN JOAQUIN",
        "codigo": "151026",
        "provincia_id": "1510"
    },
    {
        "id": "151027",
        "nombre": "SAN PEDRO DE PILAS",
        "codigo": "151027",
        "provincia_id": "1510"
    },
    {
        "id": "151028",
        "nombre": "TANTA",
        "codigo": "151028",
        "provincia_id": "1510"
    },
    {
        "id": "151029",
        "nombre": "TAURIPAMPA",
        "codigo": "151029",
        "provincia_id": "1510"
    },
    {
        "id": "151030",
        "nombre": "TOMAS",
        "codigo": "151030",
        "provincia_id": "1510"
    },
    {
        "id": "151031",
        "nombre": "TUPE",
        "codigo": "151031",
        "provincia_id": "1510"
    },
    {
        "id": "151032",
        "nombre": "VIÑAC",
        "codigo": "151032",
        "provincia_id": "1510"
    },
    {
        "id": "151033",
        "nombre": "VITIS",
        "codigo": "151033",
        "provincia_id": "1510"
    },
    {
        "id": "160101",
        "nombre": "IQUITOS",
        "codigo": "160101",
        "provincia_id": "1601"
    },
    {
        "id": "160102",
        "nombre": "ALTO NANAY",
        "codigo": "160102",
        "provincia_id": "1601"
    },
    {
        "id": "160103",
        "nombre": "FERNANDO LORES",
        "codigo": "160103",
        "provincia_id": "1601"
    },
    {
        "id": "160104",
        "nombre": "INDIANA",
        "codigo": "160104",
        "provincia_id": "1601"
    },
    {
        "id": "160105",
        "nombre": "LAS AMAZONAS",
        "codigo": "160105",
        "provincia_id": "1601"
    },
    {
        "id": "160106",
        "nombre": "MAZAN",
        "codigo": "160106",
        "provincia_id": "1601"
    },
    {
        "id": "160107",
        "nombre": "NAPO",
        "codigo": "160107",
        "provincia_id": "1601"
    },
    {
        "id": "160108",
        "nombre": "PUNCHANA",
        "codigo": "160108",
        "provincia_id": "1601"
    },
    {
        "id": "160109",
        "nombre": "PUTUMAYO",
        "codigo": "160109",
        "provincia_id": "1601"
    },
    {
        "id": "160110",
        "nombre": "TORRES CAUSANA",
        "codigo": "160110",
        "provincia_id": "1601"
    },
    {
        "id": "160112",
        "nombre": "BELEN",
        "codigo": "160112",
        "provincia_id": "1601"
    },
    {
        "id": "160113",
        "nombre": "SAN JUAN BAUTISTA",
        "codigo": "160113",
        "provincia_id": "1601"
    },
    {
        "id": "160114",
        "nombre": "TENIENTE MANUEL CLAVERO",
        "codigo": "160114",
        "provincia_id": "1601"
    },
    {
        "id": "160201",
        "nombre": "YURIMAGUAS",
        "codigo": "160201",
        "provincia_id": "1602"
    },
    {
        "id": "160202",
        "nombre": "BALSAPUERTO",
        "codigo": "160202",
        "provincia_id": "1602"
    },
    {
        "id": "160205",
        "nombre": "JEBEROS",
        "codigo": "160205",
        "provincia_id": "1602"
    },
    {
        "id": "160206",
        "nombre": "LAGUNAS",
        "codigo": "160206",
        "provincia_id": "1602"
    },
    {
        "id": "160210",
        "nombre": "SANTA CRUZ",
        "codigo": "160210",
        "provincia_id": "1602"
    },
    {
        "id": "160211",
        "nombre": "TENIENTE CESAR LOPEZ ROJAS",
        "codigo": "160211",
        "provincia_id": "1602"
    },
    {
        "id": "160301",
        "nombre": "NAUTA",
        "codigo": "160301",
        "provincia_id": "1603"
    },
    {
        "id": "160302",
        "nombre": "PARINARI",
        "codigo": "160302",
        "provincia_id": "1603"
    },
    {
        "id": "160303",
        "nombre": "TIGRE",
        "codigo": "160303",
        "provincia_id": "1603"
    },
    {
        "id": "160304",
        "nombre": "TROMPETEROS",
        "codigo": "160304",
        "provincia_id": "1603"
    },
    {
        "id": "160305",
        "nombre": "URARINAS",
        "codigo": "160305",
        "provincia_id": "1603"
    },
    {
        "id": "160401",
        "nombre": "RAMON CASTILLA",
        "codigo": "160401",
        "provincia_id": "1604"
    },
    {
        "id": "160402",
        "nombre": "PEBAS",
        "codigo": "160402",
        "provincia_id": "1604"
    },
    {
        "id": "160403",
        "nombre": "YAVARI",
        "codigo": "160403",
        "provincia_id": "1604"
    },
    {
        "id": "160404",
        "nombre": "SAN PABLO",
        "codigo": "160404",
        "provincia_id": "1604"
    },
    {
        "id": "160501",
        "nombre": "REQUENA",
        "codigo": "160501",
        "provincia_id": "1605"
    },
    {
        "id": "160502",
        "nombre": "ALTO TAPICHE",
        "codigo": "160502",
        "provincia_id": "1605"
    },
    {
        "id": "160503",
        "nombre": "CAPELO",
        "codigo": "160503",
        "provincia_id": "1605"
    },
    {
        "id": "160504",
        "nombre": "EMILIO SAN MARTIN",
        "codigo": "160504",
        "provincia_id": "1605"
    },
    {
        "id": "160505",
        "nombre": "MAQUIA",
        "codigo": "160505",
        "provincia_id": "1605"
    },
    {
        "id": "160506",
        "nombre": "PUINAHUA",
        "codigo": "160506",
        "provincia_id": "1605"
    },
    {
        "id": "160507",
        "nombre": "SAQUENA",
        "codigo": "160507",
        "provincia_id": "1605"
    },
    {
        "id": "160508",
        "nombre": "SOPLIN",
        "codigo": "160508",
        "provincia_id": "1605"
    },
    {
        "id": "160509",
        "nombre": "TAPICHE",
        "codigo": "160509",
        "provincia_id": "1605"
    },
    {
        "id": "160510",
        "nombre": "JENARO HERRERA",
        "codigo": "160510",
        "provincia_id": "1605"
    },
    {
        "id": "160511",
        "nombre": "YAQUERANA",
        "codigo": "160511",
        "provincia_id": "1605"
    },
    {
        "id": "160601",
        "nombre": "CONTAMANA",
        "codigo": "160601",
        "provincia_id": "1606"
    },
    {
        "id": "160602",
        "nombre": "INAHUAYA",
        "codigo": "160602",
        "provincia_id": "1606"
    },
    {
        "id": "160603",
        "nombre": "PADRE MARQUEZ",
        "codigo": "160603",
        "provincia_id": "1606"
    },
    {
        "id": "160604",
        "nombre": "PAMPA HERMOSA",
        "codigo": "160604",
        "provincia_id": "1606"
    },
    {
        "id": "160605",
        "nombre": "SARAYACU",
        "codigo": "160605",
        "provincia_id": "1606"
    },
    {
        "id": "160606",
        "nombre": "VARGAS GUERRA",
        "codigo": "160606",
        "provincia_id": "1606"
    },
    {
        "id": "160701",
        "nombre": "BARRANCA",
        "codigo": "160701",
        "provincia_id": "1607"
    },
    {
        "id": "160702",
        "nombre": "CAHUAPANAS",
        "codigo": "160702",
        "provincia_id": "1607"
    },
    {
        "id": "160703",
        "nombre": "MANSERICHE",
        "codigo": "160703",
        "provincia_id": "1607"
    },
    {
        "id": "160704",
        "nombre": "MORONA",
        "codigo": "160704",
        "provincia_id": "1607"
    },
    {
        "id": "160705",
        "nombre": "PASTAZA",
        "codigo": "160705",
        "provincia_id": "1607"
    },
    {
        "id": "160706",
        "nombre": "ANDOAS",
        "codigo": "160706",
        "provincia_id": "1607"
    },
    {
        "id": "160801",
        "nombre": "PUTUMAYO",
        "codigo": "160801",
        "provincia_id": "1608"
    },
    {
        "id": "160802",
        "nombre": "ROSA PANDURO",
        "codigo": "160802",
        "provincia_id": "1608"
    },
    {
        "id": "160803",
        "nombre": "TENIENTE MANUEL CLAVERO",
        "codigo": "160803",
        "provincia_id": "1608"
    },
    {
        "id": "160804",
        "nombre": "YAGUAS",
        "codigo": "160804",
        "provincia_id": "1608"
    },
    {
        "id": "170101",
        "nombre": "TAMBOPATA",
        "codigo": "170101",
        "provincia_id": "1701"
    },
    {
        "id": "170102",
        "nombre": "INAMBARI",
        "codigo": "170102",
        "provincia_id": "1701"
    },
    {
        "id": "170103",
        "nombre": "LAS PIEDRAS",
        "codigo": "170103",
        "provincia_id": "1701"
    },
    {
        "id": "170104",
        "nombre": "LABERINTO",
        "codigo": "170104",
        "provincia_id": "1701"
    },
    {
        "id": "170201",
        "nombre": "MANU",
        "codigo": "170201",
        "provincia_id": "1702"
    },
    {
        "id": "170202",
        "nombre": "FITZCARRALD",
        "codigo": "170202",
        "provincia_id": "1702"
    },
    {
        "id": "170203",
        "nombre": "MADRE DE DIOS",
        "codigo": "170203",
        "provincia_id": "1702"
    },
    {
        "id": "170204",
        "nombre": "HUEPETUHE",
        "codigo": "170204",
        "provincia_id": "1702"
    },
    {
        "id": "170301",
        "nombre": "IÑAPARI",
        "codigo": "170301",
        "provincia_id": "1703"
    },
    {
        "id": "170302",
        "nombre": "IBERIA",
        "codigo": "170302",
        "provincia_id": "1703"
    },
    {
        "id": "170303",
        "nombre": "TAHUAMANU",
        "codigo": "170303",
        "provincia_id": "1703"
    },
    {
        "id": "180101",
        "nombre": "MOQUEGUA",
        "codigo": "180101",
        "provincia_id": "1801"
    },
    {
        "id": "180102",
        "nombre": "CARUMAS",
        "codigo": "180102",
        "provincia_id": "1801"
    },
    {
        "id": "180103",
        "nombre": "CUCHUMBAYA",
        "codigo": "180103",
        "provincia_id": "1801"
    },
    {
        "id": "180104",
        "nombre": "SAMEGUA",
        "codigo": "180104",
        "provincia_id": "1801"
    },
    {
        "id": "180105",
        "nombre": "SAN CRISTOBAL",
        "codigo": "180105",
        "provincia_id": "1801"
    },
    {
        "id": "180106",
        "nombre": "TORATA",
        "codigo": "180106",
        "provincia_id": "1801"
    },
    {
        "id": "180201",
        "nombre": "OMATE",
        "codigo": "180201",
        "provincia_id": "1802"
    },
    {
        "id": "180202",
        "nombre": "CHOJATA",
        "codigo": "180202",
        "provincia_id": "1802"
    },
    {
        "id": "180203",
        "nombre": "COALAQUE",
        "codigo": "180203",
        "provincia_id": "1802"
    },
    {
        "id": "180204",
        "nombre": "ICHUÑA",
        "codigo": "180204",
        "provincia_id": "1802"
    },
    {
        "id": "180205",
        "nombre": "LA CAPILLA",
        "codigo": "180205",
        "provincia_id": "1802"
    },
    {
        "id": "180206",
        "nombre": "LLOQUE",
        "codigo": "180206",
        "provincia_id": "1802"
    },
    {
        "id": "180207",
        "nombre": "MATALAQUE",
        "codigo": "180207",
        "provincia_id": "1802"
    },
    {
        "id": "180208",
        "nombre": "PUQUINA",
        "codigo": "180208",
        "provincia_id": "1802"
    },
    {
        "id": "180209",
        "nombre": "QUINISTAQUILLAS",
        "codigo": "180209",
        "provincia_id": "1802"
    },
    {
        "id": "180210",
        "nombre": "UBINAS",
        "codigo": "180210",
        "provincia_id": "1802"
    },
    {
        "id": "180211",
        "nombre": "YUNGA",
        "codigo": "180211",
        "provincia_id": "1802"
    },
    {
        "id": "180301",
        "nombre": "ILO",
        "codigo": "180301",
        "provincia_id": "1803"
    },
    {
        "id": "180302",
        "nombre": "EL ALGARROBAL",
        "codigo": "180302",
        "provincia_id": "1803"
    },
    {
        "id": "180303",
        "nombre": "PACOCHA",
        "codigo": "180303",
        "provincia_id": "1803"
    },
    {
        "id": "190101",
        "nombre": "CHAUPIMARCA",
        "codigo": "190101",
        "provincia_id": "1901"
    },
    {
        "id": "190102",
        "nombre": "HUACHON",
        "codigo": "190102",
        "provincia_id": "1901"
    },
    {
        "id": "190103",
        "nombre": "HUARIACA",
        "codigo": "190103",
        "provincia_id": "1901"
    },
    {
        "id": "190104",
        "nombre": "HUAYLLAY",
        "codigo": "190104",
        "provincia_id": "1901"
    },
    {
        "id": "190105",
        "nombre": "NINACACA",
        "codigo": "190105",
        "provincia_id": "1901"
    },
    {
        "id": "190106",
        "nombre": "PALLANCHACRA",
        "codigo": "190106",
        "provincia_id": "1901"
    },
    {
        "id": "190107",
        "nombre": "PAUCARTAMBO",
        "codigo": "190107",
        "provincia_id": "1901"
    },
    {
        "id": "190108",
        "nombre": "SAN FRANCISCO DE ASIS DE YARUSYACAN",
        "codigo": "190108",
        "provincia_id": "1901"
    },
    {
        "id": "190109",
        "nombre": "SIMON BOLIVAR",
        "codigo": "190109",
        "provincia_id": "1901"
    },
    {
        "id": "190110",
        "nombre": "TICLACAYAN",
        "codigo": "190110",
        "provincia_id": "1901"
    },
    {
        "id": "190111",
        "nombre": "TINYAHUARCO",
        "codigo": "190111",
        "provincia_id": "1901"
    },
    {
        "id": "190112",
        "nombre": "VICCO",
        "codigo": "190112",
        "provincia_id": "1901"
    },
    {
        "id": "190113",
        "nombre": "YANACANCHA",
        "codigo": "190113",
        "provincia_id": "1901"
    },
    {
        "id": "190201",
        "nombre": "YANAHUANCA",
        "codigo": "190201",
        "provincia_id": "1902"
    },
    {
        "id": "190202",
        "nombre": "CHACAYAN",
        "codigo": "190202",
        "provincia_id": "1902"
    },
    {
        "id": "190203",
        "nombre": "GOYLLARISQUIZGA",
        "codigo": "190203",
        "provincia_id": "1902"
    },
    {
        "id": "190204",
        "nombre": "PAUCAR",
        "codigo": "190204",
        "provincia_id": "1902"
    },
    {
        "id": "190205",
        "nombre": "SAN PEDRO DE PILLAO",
        "codigo": "190205",
        "provincia_id": "1902"
    },
    {
        "id": "190206",
        "nombre": "SANTA ANA DE TUSI",
        "codigo": "190206",
        "provincia_id": "1902"
    },
    {
        "id": "190207",
        "nombre": "TAPUC",
        "codigo": "190207",
        "provincia_id": "1902"
    },
    {
        "id": "190208",
        "nombre": "VILCABAMBA",
        "codigo": "190208",
        "provincia_id": "1902"
    },
    {
        "id": "190301",
        "nombre": "OXAPAMPA",
        "codigo": "190301",
        "provincia_id": "1903"
    },
    {
        "id": "190302",
        "nombre": "CHONTABAMBA",
        "codigo": "190302",
        "provincia_id": "1903"
    },
    {
        "id": "190303",
        "nombre": "HUANCABAMBA",
        "codigo": "190303",
        "provincia_id": "1903"
    },
    {
        "id": "190304",
        "nombre": "PALCAZU",
        "codigo": "190304",
        "provincia_id": "1903"
    },
    {
        "id": "190305",
        "nombre": "POZUZO",
        "codigo": "190305",
        "provincia_id": "1903"
    },
    {
        "id": "190306",
        "nombre": "PUERTO BERMUDEZ",
        "codigo": "190306",
        "provincia_id": "1903"
    },
    {
        "id": "190307",
        "nombre": "VILLA RICA",
        "codigo": "190307",
        "provincia_id": "1903"
    },
    {
        "id": "190308",
        "nombre": "CONSTITUCION",
        "codigo": "190308",
        "provincia_id": "1903"
    },
    {
        "id": "200101",
        "nombre": "PIURA",
        "codigo": "200101",
        "provincia_id": "2001"
    },
    {
        "id": "200104",
        "nombre": "CASTILLA",
        "codigo": "200104",
        "provincia_id": "2001"
    },
    {
        "id": "200105",
        "nombre": "CATACAOS",
        "codigo": "200105",
        "provincia_id": "2001"
    },
    {
        "id": "200107",
        "nombre": "CURA MORI",
        "codigo": "200107",
        "provincia_id": "2001"
    },
    {
        "id": "200108",
        "nombre": "EL TALLAN",
        "codigo": "200108",
        "provincia_id": "2001"
    },
    {
        "id": "200109",
        "nombre": "LA ARENA",
        "codigo": "200109",
        "provincia_id": "2001"
    },
    {
        "id": "200110",
        "nombre": "LA UNION",
        "codigo": "200110",
        "provincia_id": "2001"
    },
    {
        "id": "200111",
        "nombre": "LAS LOMAS",
        "codigo": "200111",
        "provincia_id": "2001"
    },
    {
        "id": "200114",
        "nombre": "TAMBO GRANDE",
        "codigo": "200114",
        "provincia_id": "2001"
    },
    {
        "id": "200115",
        "nombre": "VEINTISEIS DE OCTUBRE",
        "codigo": "200115",
        "provincia_id": "2001"
    },
    {
        "id": "200201",
        "nombre": "AYABACA",
        "codigo": "200201",
        "provincia_id": "2002"
    },
    {
        "id": "200202",
        "nombre": "FRIAS",
        "codigo": "200202",
        "provincia_id": "2002"
    },
    {
        "id": "200203",
        "nombre": "JILILI",
        "codigo": "200203",
        "provincia_id": "2002"
    },
    {
        "id": "200204",
        "nombre": "LAGUNAS",
        "codigo": "200204",
        "provincia_id": "2002"
    },
    {
        "id": "200205",
        "nombre": "MONTERO",
        "codigo": "200205",
        "provincia_id": "2002"
    },
    {
        "id": "200206",
        "nombre": "PACAIPAMPA",
        "codigo": "200206",
        "provincia_id": "2002"
    },
    {
        "id": "200207",
        "nombre": "PAIMAS",
        "codigo": "200207",
        "provincia_id": "2002"
    },
    {
        "id": "200208",
        "nombre": "SAPILLICA",
        "codigo": "200208",
        "provincia_id": "2002"
    },
    {
        "id": "200209",
        "nombre": "SICCHEZ",
        "codigo": "200209",
        "provincia_id": "2002"
    },
    {
        "id": "200210",
        "nombre": "SUYO",
        "codigo": "200210",
        "provincia_id": "2002"
    },
    {
        "id": "200301",
        "nombre": "HUANCABAMBA",
        "codigo": "200301",
        "provincia_id": "2003"
    },
    {
        "id": "200302",
        "nombre": "CANCHAQUE",
        "codigo": "200302",
        "provincia_id": "2003"
    },
    {
        "id": "200303",
        "nombre": "EL CARMEN DE LA FRONTERA",
        "codigo": "200303",
        "provincia_id": "2003"
    },
    {
        "id": "200304",
        "nombre": "HUARMACA",
        "codigo": "200304",
        "provincia_id": "2003"
    },
    {
        "id": "200305",
        "nombre": "LALAQUIZ",
        "codigo": "200305",
        "provincia_id": "2003"
    },
    {
        "id": "200306",
        "nombre": "SAN MIGUEL DE EL FAIQUE",
        "codigo": "200306",
        "provincia_id": "2003"
    },
    {
        "id": "200307",
        "nombre": "SONDOR",
        "codigo": "200307",
        "provincia_id": "2003"
    },
    {
        "id": "200308",
        "nombre": "SONDORILLO",
        "codigo": "200308",
        "provincia_id": "2003"
    },
    {
        "id": "200401",
        "nombre": "CHULUCANAS",
        "codigo": "200401",
        "provincia_id": "2004"
    },
    {
        "id": "200402",
        "nombre": "BUENOS AIRES",
        "codigo": "200402",
        "provincia_id": "2004"
    },
    {
        "id": "200403",
        "nombre": "CHALACO",
        "codigo": "200403",
        "provincia_id": "2004"
    },
    {
        "id": "200404",
        "nombre": "LA MATANZA",
        "codigo": "200404",
        "provincia_id": "2004"
    },
    {
        "id": "200405",
        "nombre": "MORROPON",
        "codigo": "200405",
        "provincia_id": "2004"
    },
    {
        "id": "200406",
        "nombre": "SALITRAL",
        "codigo": "200406",
        "provincia_id": "2004"
    },
    {
        "id": "200407",
        "nombre": "SAN JUAN DE BIGOTE",
        "codigo": "200407",
        "provincia_id": "2004"
    },
    {
        "id": "200408",
        "nombre": "SANTA CATALINA DE MOSSA",
        "codigo": "200408",
        "provincia_id": "2004"
    },
    {
        "id": "200409",
        "nombre": "SANTO DOMINGO",
        "codigo": "200409",
        "provincia_id": "2004"
    },
    {
        "id": "200410",
        "nombre": "YAMANGO",
        "codigo": "200410",
        "provincia_id": "2004"
    },
    {
        "id": "200501",
        "nombre": "PAITA",
        "codigo": "200501",
        "provincia_id": "2005"
    },
    {
        "id": "200502",
        "nombre": "AMOTAPE",
        "codigo": "200502",
        "provincia_id": "2005"
    },
    {
        "id": "200503",
        "nombre": "ARENAL",
        "codigo": "200503",
        "provincia_id": "2005"
    },
    {
        "id": "200504",
        "nombre": "COLAN",
        "codigo": "200504",
        "provincia_id": "2005"
    },
    {
        "id": "200505",
        "nombre": "LA HUACA",
        "codigo": "200505",
        "provincia_id": "2005"
    },
    {
        "id": "200506",
        "nombre": "TAMARINDO",
        "codigo": "200506",
        "provincia_id": "2005"
    },
    {
        "id": "200507",
        "nombre": "VICHAYAL",
        "codigo": "200507",
        "provincia_id": "2005"
    },
    {
        "id": "200601",
        "nombre": "SULLANA",
        "codigo": "200601",
        "provincia_id": "2006"
    },
    {
        "id": "200602",
        "nombre": "BELLAVISTA",
        "codigo": "200602",
        "provincia_id": "2006"
    },
    {
        "id": "200603",
        "nombre": "IGNACIO ESCUDERO",
        "codigo": "200603",
        "provincia_id": "2006"
    },
    {
        "id": "200604",
        "nombre": "LANCONES",
        "codigo": "200604",
        "provincia_id": "2006"
    },
    {
        "id": "200605",
        "nombre": "MARCAVELICA",
        "codigo": "200605",
        "provincia_id": "2006"
    },
    {
        "id": "200606",
        "nombre": "MIGUEL CHECA",
        "codigo": "200606",
        "provincia_id": "2006"
    },
    {
        "id": "200607",
        "nombre": "QUERECOTILLO",
        "codigo": "200607",
        "provincia_id": "2006"
    },
    {
        "id": "200608",
        "nombre": "SALITRAL",
        "codigo": "200608",
        "provincia_id": "2006"
    },
    {
        "id": "200701",
        "nombre": "PARIÑAS",
        "codigo": "200701",
        "provincia_id": "2007"
    },
    {
        "id": "200702",
        "nombre": "EL ALTO",
        "codigo": "200702",
        "provincia_id": "2007"
    },
    {
        "id": "200703",
        "nombre": "LA BREA",
        "codigo": "200703",
        "provincia_id": "2007"
    },
    {
        "id": "200704",
        "nombre": "LOBITOS",
        "codigo": "200704",
        "provincia_id": "2007"
    },
    {
        "id": "200705",
        "nombre": "LOS ORGANOS",
        "codigo": "200705",
        "provincia_id": "2007"
    },
    {
        "id": "200706",
        "nombre": "MANCORA",
        "codigo": "200706",
        "provincia_id": "2007"
    },
    {
        "id": "200801",
        "nombre": "SECHURA",
        "codigo": "200801",
        "provincia_id": "2008"
    },
    {
        "id": "200802",
        "nombre": "BELLAVISTA DE LA UNION",
        "codigo": "200802",
        "provincia_id": "2008"
    },
    {
        "id": "200803",
        "nombre": "BERNAL",
        "codigo": "200803",
        "provincia_id": "2008"
    },
    {
        "id": "200804",
        "nombre": "CRISTO NOS VALGA",
        "codigo": "200804",
        "provincia_id": "2008"
    },
    {
        "id": "200805",
        "nombre": "VICE",
        "codigo": "200805",
        "provincia_id": "2008"
    },
    {
        "id": "200806",
        "nombre": "RINCONADA LLICUAR",
        "codigo": "200806",
        "provincia_id": "2008"
    },
    {
        "id": "210101",
        "nombre": "PUNO",
        "codigo": "210101",
        "provincia_id": "2101"
    },
    {
        "id": "210102",
        "nombre": "ACORA",
        "codigo": "210102",
        "provincia_id": "2101"
    },
    {
        "id": "210103",
        "nombre": "AMANTANI",
        "codigo": "210103",
        "provincia_id": "2101"
    },
    {
        "id": "210104",
        "nombre": "ATUNCOLLA",
        "codigo": "210104",
        "provincia_id": "2101"
    },
    {
        "id": "210105",
        "nombre": "CAPACHICA",
        "codigo": "210105",
        "provincia_id": "2101"
    },
    {
        "id": "210106",
        "nombre": "CHUCUITO",
        "codigo": "210106",
        "provincia_id": "2101"
    },
    {
        "id": "210107",
        "nombre": "COATA",
        "codigo": "210107",
        "provincia_id": "2101"
    },
    {
        "id": "210108",
        "nombre": "HUATA",
        "codigo": "210108",
        "provincia_id": "2101"
    },
    {
        "id": "210109",
        "nombre": "MAÑAZO",
        "codigo": "210109",
        "provincia_id": "2101"
    },
    {
        "id": "210110",
        "nombre": "PAUCARCOLLA",
        "codigo": "210110",
        "provincia_id": "2101"
    },
    {
        "id": "210111",
        "nombre": "PICHACANI",
        "codigo": "210111",
        "provincia_id": "2101"
    },
    {
        "id": "210112",
        "nombre": "PLATERIA",
        "codigo": "210112",
        "provincia_id": "2101"
    },
    {
        "id": "210113",
        "nombre": "SAN ANTONIO",
        "codigo": "210113",
        "provincia_id": "2101"
    },
    {
        "id": "210114",
        "nombre": "TIQUILLACA",
        "codigo": "210114",
        "provincia_id": "2101"
    },
    {
        "id": "210115",
        "nombre": "VILQUE",
        "codigo": "210115",
        "provincia_id": "2101"
    },
    {
        "id": "210201",
        "nombre": "AZANGARO",
        "codigo": "210201",
        "provincia_id": "2102"
    },
    {
        "id": "210202",
        "nombre": "ACHAYA",
        "codigo": "210202",
        "provincia_id": "2102"
    },
    {
        "id": "210203",
        "nombre": "ARAPA",
        "codigo": "210203",
        "provincia_id": "2102"
    },
    {
        "id": "210204",
        "nombre": "ASILLO",
        "codigo": "210204",
        "provincia_id": "2102"
    },
    {
        "id": "210205",
        "nombre": "CAMINACA",
        "codigo": "210205",
        "provincia_id": "2102"
    },
    {
        "id": "210206",
        "nombre": "CHUPA",
        "codigo": "210206",
        "provincia_id": "2102"
    },
    {
        "id": "210207",
        "nombre": "JOSE DOMINGO CHOQUEHUANCA",
        "codigo": "210207",
        "provincia_id": "2102"
    },
    {
        "id": "210208",
        "nombre": "MUÑANI",
        "codigo": "210208",
        "provincia_id": "2102"
    },
    {
        "id": "210209",
        "nombre": "POTONI",
        "codigo": "210209",
        "provincia_id": "2102"
    },
    {
        "id": "210210",
        "nombre": "SAMAN",
        "codigo": "210210",
        "provincia_id": "2102"
    },
    {
        "id": "210211",
        "nombre": "SAN ANTON",
        "codigo": "210211",
        "provincia_id": "2102"
    },
    {
        "id": "210212",
        "nombre": "SAN JOSE",
        "codigo": "210212",
        "provincia_id": "2102"
    },
    {
        "id": "210213",
        "nombre": "SAN JUAN DE SALINAS",
        "codigo": "210213",
        "provincia_id": "2102"
    },
    {
        "id": "210214",
        "nombre": "SANTIAGO DE PUPUJA",
        "codigo": "210214",
        "provincia_id": "2102"
    },
    {
        "id": "210215",
        "nombre": "TIRAPATA",
        "codigo": "210215",
        "provincia_id": "2102"
    },
    {
        "id": "210301",
        "nombre": "MACUSANI",
        "codigo": "210301",
        "provincia_id": "2103"
    },
    {
        "id": "210302",
        "nombre": "AJOYANI",
        "codigo": "210302",
        "provincia_id": "2103"
    },
    {
        "id": "210303",
        "nombre": "AYAPATA",
        "codigo": "210303",
        "provincia_id": "2103"
    },
    {
        "id": "210304",
        "nombre": "COASA",
        "codigo": "210304",
        "provincia_id": "2103"
    },
    {
        "id": "210305",
        "nombre": "CORANI",
        "codigo": "210305",
        "provincia_id": "2103"
    },
    {
        "id": "210306",
        "nombre": "CRUCERO",
        "codigo": "210306",
        "provincia_id": "2103"
    },
    {
        "id": "210307",
        "nombre": "ITUATA",
        "codigo": "210307",
        "provincia_id": "2103"
    },
    {
        "id": "210308",
        "nombre": "OLLACHEA",
        "codigo": "210308",
        "provincia_id": "2103"
    },
    {
        "id": "210309",
        "nombre": "SAN GABAN",
        "codigo": "210309",
        "provincia_id": "2103"
    },
    {
        "id": "210310",
        "nombre": "USICAYOS",
        "codigo": "210310",
        "provincia_id": "2103"
    },
    {
        "id": "210401",
        "nombre": "JULI",
        "codigo": "210401",
        "provincia_id": "2104"
    },
    {
        "id": "210402",
        "nombre": "DESAGUADERO",
        "codigo": "210402",
        "provincia_id": "2104"
    },
    {
        "id": "210403",
        "nombre": "HUACULLANI",
        "codigo": "210403",
        "provincia_id": "2104"
    },
    {
        "id": "210404",
        "nombre": "KELLUYO",
        "codigo": "210404",
        "provincia_id": "2104"
    },
    {
        "id": "210405",
        "nombre": "PISACOMA",
        "codigo": "210405",
        "provincia_id": "2104"
    },
    {
        "id": "210406",
        "nombre": "POMATA",
        "codigo": "210406",
        "provincia_id": "2104"
    },
    {
        "id": "210407",
        "nombre": "ZEPITA",
        "codigo": "210407",
        "provincia_id": "2104"
    },
    {
        "id": "210501",
        "nombre": "ILAVE",
        "codigo": "210501",
        "provincia_id": "2105"
    },
    {
        "id": "210502",
        "nombre": "CAPAZO",
        "codigo": "210502",
        "provincia_id": "2105"
    },
    {
        "id": "210503",
        "nombre": "PILCUYO",
        "codigo": "210503",
        "provincia_id": "2105"
    },
    {
        "id": "210504",
        "nombre": "SANTA ROSA",
        "codigo": "210504",
        "provincia_id": "2105"
    },
    {
        "id": "210505",
        "nombre": "CONDURIRI",
        "codigo": "210505",
        "provincia_id": "2105"
    },
    {
        "id": "210601",
        "nombre": "HUANCANE",
        "codigo": "210601",
        "provincia_id": "2106"
    },
    {
        "id": "210602",
        "nombre": "COJATA",
        "codigo": "210602",
        "provincia_id": "2106"
    },
    {
        "id": "210603",
        "nombre": "HUATASANI",
        "codigo": "210603",
        "provincia_id": "2106"
    },
    {
        "id": "210604",
        "nombre": "INCHUPALLA",
        "codigo": "210604",
        "provincia_id": "2106"
    },
    {
        "id": "210605",
        "nombre": "PUSI",
        "codigo": "210605",
        "provincia_id": "2106"
    },
    {
        "id": "210606",
        "nombre": "ROSASPATA",
        "codigo": "210606",
        "provincia_id": "2106"
    },
    {
        "id": "210607",
        "nombre": "TARACO",
        "codigo": "210607",
        "provincia_id": "2106"
    },
    {
        "id": "210608",
        "nombre": "VILQUE CHICO",
        "codigo": "210608",
        "provincia_id": "2106"
    },
    {
        "id": "210701",
        "nombre": "LAMPA",
        "codigo": "210701",
        "provincia_id": "2107"
    },
    {
        "id": "210702",
        "nombre": "CABANILLA",
        "codigo": "210702",
        "provincia_id": "2107"
    },
    {
        "id": "210703",
        "nombre": "CALAPUJA",
        "codigo": "210703",
        "provincia_id": "2107"
    },
    {
        "id": "210704",
        "nombre": "NICASIO",
        "codigo": "210704",
        "provincia_id": "2107"
    },
    {
        "id": "210705",
        "nombre": "OCUVIRI",
        "codigo": "210705",
        "provincia_id": "2107"
    },
    {
        "id": "210706",
        "nombre": "PALCA",
        "codigo": "210706",
        "provincia_id": "2107"
    },
    {
        "id": "210707",
        "nombre": "PARATIA",
        "codigo": "210707",
        "provincia_id": "2107"
    },
    {
        "id": "210708",
        "nombre": "PUCARA",
        "codigo": "210708",
        "provincia_id": "2107"
    },
    {
        "id": "210709",
        "nombre": "SANTA LUCIA",
        "codigo": "210709",
        "provincia_id": "2107"
    },
    {
        "id": "210710",
        "nombre": "VILAVILA",
        "codigo": "210710",
        "provincia_id": "2107"
    },
    {
        "id": "210801",
        "nombre": "AYAVIRI",
        "codigo": "210801",
        "provincia_id": "2108"
    },
    {
        "id": "210802",
        "nombre": "ANTAUTA",
        "codigo": "210802",
        "provincia_id": "2108"
    },
    {
        "id": "210803",
        "nombre": "CUPI",
        "codigo": "210803",
        "provincia_id": "2108"
    },
    {
        "id": "210804",
        "nombre": "LLALLI",
        "codigo": "210804",
        "provincia_id": "2108"
    },
    {
        "id": "210805",
        "nombre": "MACARI",
        "codigo": "210805",
        "provincia_id": "2108"
    },
    {
        "id": "210806",
        "nombre": "NUÑOA",
        "codigo": "210806",
        "provincia_id": "2108"
    },
    {
        "id": "210807",
        "nombre": "ORURILLO",
        "codigo": "210807",
        "provincia_id": "2108"
    },
    {
        "id": "210808",
        "nombre": "SANTA ROSA",
        "codigo": "210808",
        "provincia_id": "2108"
    },
    {
        "id": "210809",
        "nombre": "UMACHIRI",
        "codigo": "210809",
        "provincia_id": "2108"
    },
    {
        "id": "210901",
        "nombre": "MOHO",
        "codigo": "210901",
        "provincia_id": "2109"
    },
    {
        "id": "210902",
        "nombre": "CONIMA",
        "codigo": "210902",
        "provincia_id": "2109"
    },
    {
        "id": "210903",
        "nombre": "HUAYRAPATA",
        "codigo": "210903",
        "provincia_id": "2109"
    },
    {
        "id": "210904",
        "nombre": "TILALI",
        "codigo": "210904",
        "provincia_id": "2109"
    },
    {
        "id": "211001",
        "nombre": "PUTINA",
        "codigo": "211001",
        "provincia_id": "2110"
    },
    {
        "id": "211002",
        "nombre": "ANANEA",
        "codigo": "211002",
        "provincia_id": "2110"
    },
    {
        "id": "211003",
        "nombre": "PEDRO VILCA APAZA",
        "codigo": "211003",
        "provincia_id": "2110"
    },
    {
        "id": "211004",
        "nombre": "QUILCAPUNCU",
        "codigo": "211004",
        "provincia_id": "2110"
    },
    {
        "id": "211005",
        "nombre": "SINA",
        "codigo": "211005",
        "provincia_id": "2110"
    },
    {
        "id": "211101",
        "nombre": "JULIACA",
        "codigo": "211101",
        "provincia_id": "2111"
    },
    {
        "id": "211102",
        "nombre": "CABANA",
        "codigo": "211102",
        "provincia_id": "2111"
    },
    {
        "id": "211103",
        "nombre": "CABANILLAS",
        "codigo": "211103",
        "provincia_id": "2111"
    },
    {
        "id": "211104",
        "nombre": "CARACOTO",
        "codigo": "211104",
        "provincia_id": "2111"
    },
    {
        "id": "211105",
        "nombre": "SAN MIGUEL",
        "codigo": "211105",
        "provincia_id": "2111"
    },
    {
        "id": "211201",
        "nombre": "SANDIA",
        "codigo": "211201",
        "provincia_id": "2112"
    },
    {
        "id": "211202",
        "nombre": "CUYOCUYO",
        "codigo": "211202",
        "provincia_id": "2112"
    },
    {
        "id": "211203",
        "nombre": "LIMBANI",
        "codigo": "211203",
        "provincia_id": "2112"
    },
    {
        "id": "211204",
        "nombre": "PATAMBUCO",
        "codigo": "211204",
        "provincia_id": "2112"
    },
    {
        "id": "211205",
        "nombre": "PHARA",
        "codigo": "211205",
        "provincia_id": "2112"
    },
    {
        "id": "211206",
        "nombre": "QUIACA",
        "codigo": "211206",
        "provincia_id": "2112"
    },
    {
        "id": "211207",
        "nombre": "SAN JUAN DEL ORO",
        "codigo": "211207",
        "provincia_id": "2112"
    },
    {
        "id": "211208",
        "nombre": "YANAHUAYA",
        "codigo": "211208",
        "provincia_id": "2112"
    },
    {
        "id": "211209",
        "nombre": "ALTO INAMBARI",
        "codigo": "211209",
        "provincia_id": "2112"
    },
    {
        "id": "211210",
        "nombre": "SAN PEDRO DE PUTINA PUNCO",
        "codigo": "211210",
        "provincia_id": "2112"
    },
    {
        "id": "211301",
        "nombre": "YUNGUYO",
        "codigo": "211301",
        "provincia_id": "2113"
    },
    {
        "id": "211302",
        "nombre": "ANAPIA",
        "codigo": "211302",
        "provincia_id": "2113"
    },
    {
        "id": "211303",
        "nombre": "COPANI",
        "codigo": "211303",
        "provincia_id": "2113"
    },
    {
        "id": "211304",
        "nombre": "CUTURAPI",
        "codigo": "211304",
        "provincia_id": "2113"
    },
    {
        "id": "211305",
        "nombre": "OLLARAYA",
        "codigo": "211305",
        "provincia_id": "2113"
    },
    {
        "id": "211306",
        "nombre": "TINICACHI",
        "codigo": "211306",
        "provincia_id": "2113"
    },
    {
        "id": "211307",
        "nombre": "UNICACHI",
        "codigo": "211307",
        "provincia_id": "2113"
    },
    {
        "id": "220101",
        "nombre": "MOYOBAMBA",
        "codigo": "220101",
        "provincia_id": "2201"
    },
    {
        "id": "220102",
        "nombre": "CALZADA",
        "codigo": "220102",
        "provincia_id": "2201"
    },
    {
        "id": "220103",
        "nombre": "HABANA",
        "codigo": "220103",
        "provincia_id": "2201"
    },
    {
        "id": "220104",
        "nombre": "JEPELACIO",
        "codigo": "220104",
        "provincia_id": "2201"
    },
    {
        "id": "220105",
        "nombre": "SORITOR",
        "codigo": "220105",
        "provincia_id": "2201"
    },
    {
        "id": "220106",
        "nombre": "YANTALO",
        "codigo": "220106",
        "provincia_id": "2201"
    },
    {
        "id": "220201",
        "nombre": "BELLAVISTA",
        "codigo": "220201",
        "provincia_id": "2202"
    },
    {
        "id": "220202",
        "nombre": "ALTO BIAVO",
        "codigo": "220202",
        "provincia_id": "2202"
    },
    {
        "id": "220203",
        "nombre": "BAJO BIAVO",
        "codigo": "220203",
        "provincia_id": "2202"
    },
    {
        "id": "220204",
        "nombre": "HUALLAGA",
        "codigo": "220204",
        "provincia_id": "2202"
    },
    {
        "id": "220205",
        "nombre": "SAN PABLO",
        "codigo": "220205",
        "provincia_id": "2202"
    },
    {
        "id": "220206",
        "nombre": "SAN RAFAEL",
        "codigo": "220206",
        "provincia_id": "2202"
    },
    {
        "id": "220301",
        "nombre": "SAN JOSE DE SISA",
        "codigo": "220301",
        "provincia_id": "2203"
    },
    {
        "id": "220302",
        "nombre": "AGUA BLANCA",
        "codigo": "220302",
        "provincia_id": "2203"
    },
    {
        "id": "220303",
        "nombre": "SAN MARTIN",
        "codigo": "220303",
        "provincia_id": "2203"
    },
    {
        "id": "220304",
        "nombre": "SANTA ROSA",
        "codigo": "220304",
        "provincia_id": "2203"
    },
    {
        "id": "220305",
        "nombre": "SHATOJA",
        "codigo": "220305",
        "provincia_id": "2203"
    },
    {
        "id": "220401",
        "nombre": "SAPOSOA",
        "codigo": "220401",
        "provincia_id": "2204"
    },
    {
        "id": "220402",
        "nombre": "ALTO SAPOSOA",
        "codigo": "220402",
        "provincia_id": "2204"
    },
    {
        "id": "220403",
        "nombre": "EL ESLABON",
        "codigo": "220403",
        "provincia_id": "2204"
    },
    {
        "id": "220404",
        "nombre": "PISCOYACU",
        "codigo": "220404",
        "provincia_id": "2204"
    },
    {
        "id": "220405",
        "nombre": "SACANCHE",
        "codigo": "220405",
        "provincia_id": "2204"
    },
    {
        "id": "220406",
        "nombre": "TINGO DE SAPOSOA",
        "codigo": "220406",
        "provincia_id": "2204"
    },
    {
        "id": "220501",
        "nombre": "LAMAS",
        "codigo": "220501",
        "provincia_id": "2205"
    },
    {
        "id": "220502",
        "nombre": "ALONSO DE ALVARADO",
        "codigo": "220502",
        "provincia_id": "2205"
    },
    {
        "id": "220503",
        "nombre": "BARRANQUITA",
        "codigo": "220503",
        "provincia_id": "2205"
    },
    {
        "id": "220504",
        "nombre": "CAYNARACHI",
        "codigo": "220504",
        "provincia_id": "2205"
    },
    {
        "id": "220505",
        "nombre": "CUÑUMBUQUI",
        "codigo": "220505",
        "provincia_id": "2205"
    },
    {
        "id": "220506",
        "nombre": "PINTO RECODO",
        "codigo": "220506",
        "provincia_id": "2205"
    },
    {
        "id": "220507",
        "nombre": "RUMISAPA",
        "codigo": "220507",
        "provincia_id": "2205"
    },
    {
        "id": "220508",
        "nombre": "SAN ROQUE DE CUMBAZA",
        "codigo": "220508",
        "provincia_id": "2205"
    },
    {
        "id": "220509",
        "nombre": "SHANAO",
        "codigo": "220509",
        "provincia_id": "2205"
    },
    {
        "id": "220510",
        "nombre": "TABALOSOS",
        "codigo": "220510",
        "provincia_id": "2205"
    },
    {
        "id": "220511",
        "nombre": "ZAPATERO",
        "codigo": "220511",
        "provincia_id": "2205"
    },
    {
        "id": "220601",
        "nombre": "JUANJUI",
        "codigo": "220601",
        "provincia_id": "2206"
    },
    {
        "id": "220602",
        "nombre": "CAMPANILLA",
        "codigo": "220602",
        "provincia_id": "2206"
    },
    {
        "id": "220603",
        "nombre": "HUICUNGO",
        "codigo": "220603",
        "provincia_id": "2206"
    },
    {
        "id": "220604",
        "nombre": "PACHIZA",
        "codigo": "220604",
        "provincia_id": "2206"
    },
    {
        "id": "220605",
        "nombre": "PAJARILLO",
        "codigo": "220605",
        "provincia_id": "2206"
    },
    {
        "id": "220701",
        "nombre": "PICOTA",
        "codigo": "220701",
        "provincia_id": "2207"
    },
    {
        "id": "220702",
        "nombre": "BUENOS AIRES",
        "codigo": "220702",
        "provincia_id": "2207"
    },
    {
        "id": "220703",
        "nombre": "CASPISAPA",
        "codigo": "220703",
        "provincia_id": "2207"
    },
    {
        "id": "220704",
        "nombre": "PILLUANA",
        "codigo": "220704",
        "provincia_id": "2207"
    },
    {
        "id": "220705",
        "nombre": "PUCACACA",
        "codigo": "220705",
        "provincia_id": "2207"
    },
    {
        "id": "220706",
        "nombre": "SAN CRISTOBAL",
        "codigo": "220706",
        "provincia_id": "2207"
    },
    {
        "id": "220707",
        "nombre": "SAN HILARION",
        "codigo": "220707",
        "provincia_id": "2207"
    },
    {
        "id": "220708",
        "nombre": "SHAMBOYACU",
        "codigo": "220708",
        "provincia_id": "2207"
    },
    {
        "id": "220709",
        "nombre": "TINGO DE PONASA",
        "codigo": "220709",
        "provincia_id": "2207"
    },
    {
        "id": "220710",
        "nombre": "TRES UNIDOS",
        "codigo": "220710",
        "provincia_id": "2207"
    },
    {
        "id": "220801",
        "nombre": "RIOJA",
        "codigo": "220801",
        "provincia_id": "2208"
    },
    {
        "id": "220802",
        "nombre": "AWAJUN",
        "codigo": "220802",
        "provincia_id": "2208"
    },
    {
        "id": "220803",
        "nombre": "ELIAS SOPLIN VARGAS",
        "codigo": "220803",
        "provincia_id": "2208"
    },
    {
        "id": "220804",
        "nombre": "NUEVA CAJAMARCA",
        "codigo": "220804",
        "provincia_id": "2208"
    },
    {
        "id": "220805",
        "nombre": "PARDO MIGUEL",
        "codigo": "220805",
        "provincia_id": "2208"
    },
    {
        "id": "220806",
        "nombre": "POSIC",
        "codigo": "220806",
        "provincia_id": "2208"
    },
    {
        "id": "220807",
        "nombre": "SAN FERNANDO",
        "codigo": "220807",
        "provincia_id": "2208"
    },
    {
        "id": "220808",
        "nombre": "YORONGOS",
        "codigo": "220808",
        "provincia_id": "2208"
    },
    {
        "id": "220809",
        "nombre": "YURACYACU",
        "codigo": "220809",
        "provincia_id": "2208"
    },
    {
        "id": "220901",
        "nombre": "TARAPOTO",
        "codigo": "220901",
        "provincia_id": "2209"
    },
    {
        "id": "220902",
        "nombre": "ALBERTO LEVEAU",
        "codigo": "220902",
        "provincia_id": "2209"
    },
    {
        "id": "220903",
        "nombre": "CACATACHI",
        "codigo": "220903",
        "provincia_id": "2209"
    },
    {
        "id": "220904",
        "nombre": "CHAZUTA",
        "codigo": "220904",
        "provincia_id": "2209"
    },
    {
        "id": "220905",
        "nombre": "CHIPURANA",
        "codigo": "220905",
        "provincia_id": "2209"
    },
    {
        "id": "220906",
        "nombre": "EL PORVENIR",
        "codigo": "220906",
        "provincia_id": "2209"
    },
    {
        "id": "220907",
        "nombre": "HUIMBAYOC",
        "codigo": "220907",
        "provincia_id": "2209"
    },
    {
        "id": "220908",
        "nombre": "JUAN GUERRA",
        "codigo": "220908",
        "provincia_id": "2209"
    },
    {
        "id": "220909",
        "nombre": "LA BANDA DE SHILCAYO",
        "codigo": "220909",
        "provincia_id": "2209"
    },
    {
        "id": "220910",
        "nombre": "MORALES",
        "codigo": "220910",
        "provincia_id": "2209"
    },
    {
        "id": "220911",
        "nombre": "PAPAPLAYA",
        "codigo": "220911",
        "provincia_id": "2209"
    },
    {
        "id": "220912",
        "nombre": "SAN ANTONIO",
        "codigo": "220912",
        "provincia_id": "2209"
    },
    {
        "id": "220913",
        "nombre": "SAUCE",
        "codigo": "220913",
        "provincia_id": "2209"
    },
    {
        "id": "220914",
        "nombre": "SHAPAJA",
        "codigo": "220914",
        "provincia_id": "2209"
    },
    {
        "id": "221001",
        "nombre": "TOCACHE",
        "codigo": "221001",
        "provincia_id": "2210"
    },
    {
        "id": "221002",
        "nombre": "NUEVO PROGRESO",
        "codigo": "221002",
        "provincia_id": "2210"
    },
    {
        "id": "221003",
        "nombre": "POLVORA",
        "codigo": "221003",
        "provincia_id": "2210"
    },
    {
        "id": "221004",
        "nombre": "SHUNTE",
        "codigo": "221004",
        "provincia_id": "2210"
    },
    {
        "id": "221005",
        "nombre": "UCHIZA",
        "codigo": "221005",
        "provincia_id": "2210"
    },
    {
        "id": "221006",
        "nombre": "SANTA LUCIA",
        "codigo": "221006",
        "provincia_id": "2210"
    },
    {
        "id": "230101",
        "nombre": "TACNA",
        "codigo": "230101",
        "provincia_id": "2301"
    },
    {
        "id": "230102",
        "nombre": "ALTO DE LA ALIANZA",
        "codigo": "230102",
        "provincia_id": "2301"
    },
    {
        "id": "230103",
        "nombre": "CALANA",
        "codigo": "230103",
        "provincia_id": "2301"
    },
    {
        "id": "230104",
        "nombre": "CIUDAD NUEVA",
        "codigo": "230104",
        "provincia_id": "2301"
    },
    {
        "id": "230105",
        "nombre": "INCLAN",
        "codigo": "230105",
        "provincia_id": "2301"
    },
    {
        "id": "230106",
        "nombre": "PACHIA",
        "codigo": "230106",
        "provincia_id": "2301"
    },
    {
        "id": "230107",
        "nombre": "PALCA",
        "codigo": "230107",
        "provincia_id": "2301"
    },
    {
        "id": "230108",
        "nombre": "POCOLLAY",
        "codigo": "230108",
        "provincia_id": "2301"
    },
    {
        "id": "230109",
        "nombre": "SAMA",
        "codigo": "230109",
        "provincia_id": "2301"
    },
    {
        "id": "230110",
        "nombre": "CORONEL GREGORIO ALBARRACIN LANCHIPA",
        "codigo": "230110",
        "provincia_id": "2301"
    },
    {
        "id": "230111",
        "nombre": "LA YARADA LOS PALOS",
        "codigo": "230111",
        "provincia_id": "2301"
    },
    {
        "id": "230201",
        "nombre": "CANDARAVE",
        "codigo": "230201",
        "provincia_id": "2302"
    },
    {
        "id": "230202",
        "nombre": "CAIRANI",
        "codigo": "230202",
        "provincia_id": "2302"
    },
    {
        "id": "230203",
        "nombre": "CAMILACA",
        "codigo": "230203",
        "provincia_id": "2302"
    },
    {
        "id": "230204",
        "nombre": "CURIBAYA",
        "codigo": "230204",
        "provincia_id": "2302"
    },
    {
        "id": "230205",
        "nombre": "HUANUARA",
        "codigo": "230205",
        "provincia_id": "2302"
    },
    {
        "id": "230206",
        "nombre": "QUILAHUANI",
        "codigo": "230206",
        "provincia_id": "2302"
    },
    {
        "id": "230301",
        "nombre": "LOCUMBA",
        "codigo": "230301",
        "provincia_id": "2303"
    },
    {
        "id": "230302",
        "nombre": "ILABAYA",
        "codigo": "230302",
        "provincia_id": "2303"
    },
    {
        "id": "230303",
        "nombre": "ITE",
        "codigo": "230303",
        "provincia_id": "2303"
    },
    {
        "id": "230401",
        "nombre": "TARATA",
        "codigo": "230401",
        "provincia_id": "2304"
    },
    {
        "id": "230402",
        "nombre": "HEROES ALBARRACIN CHUCATAMANI",
        "codigo": "230402",
        "provincia_id": "2304"
    },
    {
        "id": "230403",
        "nombre": "ESTIQUE",
        "codigo": "230403",
        "provincia_id": "2304"
    },
    {
        "id": "230404",
        "nombre": "ESTIQUE-PAMPA",
        "codigo": "230404",
        "provincia_id": "2304"
    },
    {
        "id": "230405",
        "nombre": "SITAJARA",
        "codigo": "230405",
        "provincia_id": "2304"
    },
    {
        "id": "230406",
        "nombre": "SUSAPAYA",
        "codigo": "230406",
        "provincia_id": "2304"
    },
    {
        "id": "230407",
        "nombre": "TARUCACHI",
        "codigo": "230407",
        "provincia_id": "2304"
    },
    {
        "id": "230408",
        "nombre": "TICACO",
        "codigo": "230408",
        "provincia_id": "2304"
    },
    {
        "id": "240101",
        "nombre": "TUMBES",
        "codigo": "240101",
        "provincia_id": "2401"
    },
    {
        "id": "240102",
        "nombre": "CORRALES",
        "codigo": "240102",
        "provincia_id": "2401"
    },
    {
        "id": "240103",
        "nombre": "LA CRUZ",
        "codigo": "240103",
        "provincia_id": "2401"
    },
    {
        "id": "240104",
        "nombre": "PAMPAS DE HOSPITAL",
        "codigo": "240104",
        "provincia_id": "2401"
    },
    {
        "id": "240105",
        "nombre": "SAN JACINTO",
        "codigo": "240105",
        "provincia_id": "2401"
    },
    {
        "id": "240106",
        "nombre": "SAN JUAN DE LA VIRGEN",
        "codigo": "240106",
        "provincia_id": "2401"
    },
    {
        "id": "240201",
        "nombre": "ZORRITOS",
        "codigo": "240201",
        "provincia_id": "2402"
    },
    {
        "id": "240202",
        "nombre": "CASITAS",
        "codigo": "240202",
        "provincia_id": "2402"
    },
    {
        "id": "240203",
        "nombre": "CANOAS DE PUNTA SAL",
        "codigo": "240203",
        "provincia_id": "2402"
    },
    {
        "id": "240301",
        "nombre": "ZARUMILLA",
        "codigo": "240301",
        "provincia_id": "2403"
    },
    {
        "id": "240302",
        "nombre": "AGUAS VERDES",
        "codigo": "240302",
        "provincia_id": "2403"
    },
    {
        "id": "240303",
        "nombre": "MATAPALO",
        "codigo": "240303",
        "provincia_id": "2403"
    },
    {
        "id": "240304",
        "nombre": "PAPAYAL",
        "codigo": "240304",
        "provincia_id": "2403"
    },
    {
        "id": "250101",
        "nombre": "CALLERIA",
        "codigo": "250101",
        "provincia_id": "2501"
    },
    {
        "id": "250102",
        "nombre": "CAMPOVERDE",
        "codigo": "250102",
        "provincia_id": "2501"
    },
    {
        "id": "250103",
        "nombre": "IPARIA",
        "codigo": "250103",
        "provincia_id": "2501"
    },
    {
        "id": "250104",
        "nombre": "MASISEA",
        "codigo": "250104",
        "provincia_id": "2501"
    },
    {
        "id": "250105",
        "nombre": "YARINACOCHA",
        "codigo": "250105",
        "provincia_id": "2501"
    },
    {
        "id": "250106",
        "nombre": "NUEVA REQUENA",
        "codigo": "250106",
        "provincia_id": "2501"
    },
    {
        "id": "250107",
        "nombre": "MANANTAY",
        "codigo": "250107",
        "provincia_id": "2501"
    },
    {
        "id": "250201",
        "nombre": "RAYMONDI",
        "codigo": "250201",
        "provincia_id": "2502"
    },
    {
        "id": "250202",
        "nombre": "SEPAHUA",
        "codigo": "250202",
        "provincia_id": "2502"
    },
    {
        "id": "250203",
        "nombre": "TAHUANIA",
        "codigo": "250203",
        "provincia_id": "2502"
    },
    {
        "id": "250204",
        "nombre": "YURUA",
        "codigo": "250204",
        "provincia_id": "2502"
    },
    {
        "id": "250301",
        "nombre": "PADRE ABAD",
        "codigo": "250301",
        "provincia_id": "2503"
    },
    {
        "id": "250302",
        "nombre": "IRAZOLA",
        "codigo": "250302",
        "provincia_id": "2503"
    },
    {
        "id": "250303",
        "nombre": "CURIMANA",
        "codigo": "250303",
        "provincia_id": "2503"
    },
    {
        "id": "250304",
        "nombre": "NESHUYA",
        "codigo": "250304",
        "provincia_id": "2503"
    },
    {
        "id": "250305",
        "nombre": "ALEXANDER VON HUMBOLDT",
        "codigo": "250305",
        "provincia_id": "2503"
    },
    {
        "id": "250306",
        "nombre": "HUIPOCA",
        "codigo": "250306",
        "provincia_id": "2503"
    },
    {
        "id": "250307",
        "nombre": "BOQUERON",
        "codigo": "250307",
        "provincia_id": "2503"
    },
    {
        "id": "250401",
        "nombre": "PURUS",
        "codigo": "250401",
        "provincia_id": "2504"
    }
];

// ========================================
// FUNCIONES HELPER
// ========================================

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

/**
 * Obtener el nombre completo de una ubicación (Distrito, Provincia, Departamento)
 */
export function getNombreCompletoUbicacion(
    departamentoId?: string,
    provinciaId?: string,
    distritoId?: string
): string {
    const partes: string[] = [];

    if (distritoId) {
        const distrito = getDistritoById(distritoId);
        if (distrito) partes.push(distrito.nombre);
    }

    if (provinciaId) {
        const provincia = getProvinciaById(provinciaId);
        if (provincia) partes.push(provincia.nombre);
    }

    if (departamentoId) {
        const departamento = getDepartamentoById(departamentoId);
        if (departamento) partes.push(departamento.nombre);
    }

    return partes.join(', ');
}
