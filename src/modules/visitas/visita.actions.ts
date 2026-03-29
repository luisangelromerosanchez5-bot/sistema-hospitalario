"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { VisitaRepository } from "@/modules/visitas/visita.repository";

const CreateVisitaSchema = z.object({
  pacienteId:             z.coerce.number().positive("Seleccione un paciente"),
  medicoId:               z.coerce.number().positive("Seleccione un medico"),
  fecha:                  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha invalida"),
  hora:                   z.string().regex(/^\d{2}:\d{2}$/, "Hora invalida"),
  motivoId:               z.string().optional().transform(v => v && v !== "" ? Number(v) : undefined),
  diagnostico:            z.string().optional().transform(v => v === "" ? undefined : v),
  frecuenciaCardiaca:     z.string().optional().transform(v => v && v !== "" ? Number(v) : undefined),
  presionArterial:        z.string().optional().transform(v => v === "" ? undefined : v),
  frecuenciaRespiratoria: z.string().optional().transform(v => v && v !== "" ? Number(v) : undefined),
  temperatura:            z.string().optional().transform(v => v && v !== "" ? Number(v) : undefined),
  saturacionOxigeno:      z.string().optional().transform(v => v && v !== "" ? Number(v) : undefined),
});

export async function createVisitaAction(_prevState: unknown, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validation = CreateVisitaSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Por favor verifica los campos requeridos",
    };
  }

  const d = validation.data;
  const repo = new VisitaRepository();

  const visitaDTO = {
    pacienteId:  d.pacienteId,
    medicoId:    d.medicoId,
    fecha:       d.fecha,
    hora:        d.hora,
    motivoId:    d.motivoId,
    diagnostico: d.diagnostico,
    signosVitales: d.frecuenciaCardiaca ? {
      frecuenciaCardiaca:     d.frecuenciaCardiaca,
      presionArterial:        d.presionArterial ?? "",
      frecuenciaRespiratoria: d.frecuenciaRespiratoria ?? 0,
      temperatura:            d.temperatura ?? 0,
      saturacionOxigeno:      d.saturacionOxigeno ?? 0,
    } : undefined,
  };

  try {
    await repo.createCompleta(visitaDTO);
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Error al crear visita" };
  }

  revalidatePath("/visitas");
  redirect("/visitas");
}
