import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { VisitaCompleta, CreateVisitaCompletaDTO } from "./types";

const VISITA_COMPLETA_SELECT = `
  visitaid, fecha, hora, pacienteid, medicoid,
  pacientes!pacienteid(pacienteid, nombre, apellido, telefono, correoelectronico),
  medicos!medicoid(medicoid, nombre, apellido, telefono,
    especialidades!especialidadid(nombre),
    hospitales!hospitalid(nombre)
  ),
  detallesvisitas(detallevisitaid, diagnostico, motivosvisitas!motivoid(descripcion)),
  signosvitales(signovitalid, frecuenciacardiaca, presionarterial, frecuenciarespiratoria, temperatura, saturacionoxigeno)
`;

export class VisitaRepository {
  async findByPaciente(pacienteId: number): Promise<VisitaCompleta[]> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("visitas")
      .select(VISITA_COMPLETA_SELECT)
      .eq("pacienteid", pacienteId)
      .order("fecha", { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []) as unknown as VisitaCompleta[];
  }

  async findById(id: number): Promise<VisitaCompleta | null> {
    const supabase = await createServerSupabaseClient() as any;
    const { data, error } = await supabase
      .from("visitas")
      .select(VISITA_COMPLETA_SELECT)
      .eq("visitaid", id)
      .single();
    if (error || !data) return null;
    return data as unknown as VisitaCompleta;
  }

  async createCompleta(dto: CreateVisitaCompletaDTO): Promise<VisitaCompleta> {
    const supabase = await createServerSupabaseClient() as any;

    const { data: visita, error: visitaError } = await supabase
      .from("visitas")
      .insert({ pacienteid: dto.pacienteId, medicoid: dto.medicoId, fecha: dto.fecha, hora: dto.hora })
      .select("visitaid")
      .single();

    if (visitaError) throw new Error(`Error creando visita: ${visitaError.message}`);
    const visitaId = visita!.visitaid;

    if (dto.motivoId && dto.diagnostico) {
      await supabase.from("detallesvisitas").insert({
        visitaid: visitaId, motivoid: dto.motivoId, diagnostico: dto.diagnostico,
      });
    }

    if (dto.signosVitales) {
      const sv = dto.signosVitales;
      await supabase.from("signosvitales").insert({
        visitaid: visitaId,
        frecuenciacardiaca: sv.frecuenciaCardiaca,
        presionarterial: sv.presionArterial,
        frecuenciarespiratoria: sv.frecuenciaRespiratoria,
        temperatura: sv.temperatura,
        saturacionoxigeno: sv.saturacionOxigeno,
      });
    }

    const visitaCompleta = await this.findById(visitaId);
    if (!visitaCompleta) throw new Error("Error al recuperar la visita recien creada");
    return visitaCompleta;
  }
}
