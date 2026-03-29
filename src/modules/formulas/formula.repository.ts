import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Formula, CreateFormulaDTO } from "./types";

export class FormulaRepository {
  async findByTratamiento(tratamientoId: number): Promise<Formula[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("formulas")
      .select(`
        formulaid, fecha,
        tratamientoid,
        detallesformulas(
          detalleid,
          presentacion,
          posologia,
          periodouse,
          periodicidaduso,
          medicamentos!medicamentoid(
            medicamentoid, nombre, prescripcion, unidades, descripcion
          )
        )
      `)
      .eq("tratamientoid", tratamientoId)
      .order("fecha", { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map((f: Record<string, any>) => ({
      formulaId:     f.formulaid,
      tratamientoId: f.tratamientoid,
      fecha:         f.fecha,
      detalles: (f.detallesformulas || []).map((d: Record<string, any>) => ({
        detalleId:       d.detalleid as number,
        presentacion:    d.presentacion as string,
        posologia:       d.posologia as string,
        periodoUso:      d.periodouse as string,
        periodicidadUso: d.periodicidaduso as string,
        medicamento: {
          medicamentoId: (d.medicamentos as Record<string, unknown>).medicamentoid,
          nombre:        (d.medicamentos as Record<string, unknown>).nombre,
          prescripcion:  (d.medicamentos as Record<string, unknown>).prescripcion,
          unidades:      (d.medicamentos as Record<string, unknown>).unidades,
          descripcion:   (d.medicamentos as Record<string, unknown>).descripcion,
          cantidad:      0,
        },
      })),
    }));
  }

  async createConDetalles(dto: CreateFormulaDTO): Promise<Formula> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = await createServerSupabaseClient() as any;

    const { data: formula, error: fErr } = await supabase
      .from("formulas")
      .insert({
        tratamientoid: dto.tratamientoId,
        fecha:         dto.fecha,
      })
      .select("formulaid")
      .single();

    if (fErr) throw new Error(fErr.message);

    if (dto.detalles && dto.detalles.length > 0) {
      const detallesInsert = dto.detalles.map((d) => ({
        formulaid:       formula!.formulaid,
        medicamentoid:   d.medicamentoId,
        presentacion:    d.presentacion,
        posologia:       d.posologia,
        periodouse:      d.periodoUso,
        periodicidaduso: d.periodicidadUso,
      }));

      const { error: dErr } = await supabase
        .from("detallesformulas")
        .insert(detallesInsert);

      if (dErr) throw new Error(`Error en detalles formula: ${dErr.message}`);
    }

    const formulas = await this.findByTratamiento(dto.tratamientoId);
    return formulas.find((f) => f.formulaId === formula!.formulaid)!;
  }
}