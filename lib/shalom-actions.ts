"use server";

export interface ShalomAgency {
    id: string;
    nombre: string;
    direccion: string;
    departamento?: string;
    provincia?: string;
    distrito?: string;
    codigo?: string;
    lugar_over?: string;
}

const SHALOM_API_URL = process.env.SHALOM_API_URL || "https://shalom-api.lat/api/agencia-minimal";
const SHALOM_API_KEY = process.env.SHALOM_API_KEY || "sk-mcho6t74e9yek275qsjqn";

export async function getShalomAgencies(query?: string): Promise<{ data: ShalomAgency[]; error?: string }> {
    try {
        const url = new URL(SHALOM_API_URL);
        if (query) {
            url.searchParams.append("q", query);
        }

        console.log(`[SHALOM] Iniciando fetch a: ${url.toString()}`);
        console.log(`[SHALOM] API KEY detectable: ${SHALOM_API_KEY ? 'SÍ' : 'NO'}`);

        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${SHALOM_API_KEY}`,
                "x-api-key": SHALOM_API_KEY || "",
            },
            next: { revalidate: 3600 }
        });

        console.log(`[SHALOM] Status: ${response.status}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[SHALOM] Error (${response.status}):`, errorText);
            throw new Error(`Servicio de Shalom: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Normalización del formato de respuesta de Shalom
        let rawAgencies: any[] = [];
        if (Array.isArray(data)) {
            rawAgencies = data;
        } else if (data && typeof data === 'object') {
            rawAgencies = data.resultados || data.data || data.results || data.agencias || data.items || [];
        }

        // Mapeo a nuestra interfaz para asegurar consistencia
        const agencies: ShalomAgency[] = rawAgencies.map((agency: any) => {
            // Intentar extraer el distrito del nombre si no viene explícitamente
            let distrito = agency.distrito || agency.ubigeo_distrito || "";
            if (!distrito && agency.nombre && agency.nombre.includes("/")) {
                const parts = agency.nombre.split("/").map((p: string) => p.trim());
                if (parts.length >= 3) {
                    distrito = parts[2]; // El tercer componente suele ser el distrito
                }
            }

            return {
                id: String(agency.ter_id || agency.id || agency.uid || ""),
                nombre: agency.nombre || agency.lugar_over || "Agencia sin nombre",
                direccion: agency.direccion || "",
                departamento: agency.departamento || "",
                provincia: agency.provincia || "",
                distrito: distrito,
                codigo: agency.codigo || String(agency.ter_id || ""),
                lugar_over: agency.lugar_over || "",
            };
        });

        console.log(`[SHALOM] Agencias encontradas: ${agencies.length}`);

        return { data: agencies };
    } catch (error: any) {
        console.error("Error detallado al conectar con Shalom:", {
            message: error.message,
            stack: error.stack,
            cause: error.cause
        });

        // Mensaje amigable para el error de red o DNS
        if (error.message?.includes("fetch failed") || error.code === 'ENOTFOUND') {
            return {
                data: [],
                error: `Error de conexión con Shalom (${error.message}). Verifique la URL de la API o la conexión a internet de su servidor.`
            };
        }

        return { data: [], error: error.message || "Error al obtener agencias de Shalom" };
    }
}
