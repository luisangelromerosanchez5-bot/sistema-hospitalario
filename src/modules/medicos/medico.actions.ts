"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { z } from "zod";

const Schema = z.object({
  nombre:            z.string().min(2, "Minimo 2 caracteres"),
  apellido:          z.string().min(2, "Minimo 2 caracteres"),
  telefono:          z.string().min(7, "Telefono invalido"),
  correoelectronico: z.string().email("Correo invalido"),
  especialidadid:    z.coerce.number().positive("Seleccione especialidad"),
  hospitalid:        z.coerce.number().positive("Seleccione hospital"),
});

export async function createMedicoAction(_prev: unknown, formData: FormData) {
  const validation = Schema.safeParse(Object.fromEntries(formData));
  if (!validation.success) {
    return { success: false, message: "Errores en el formulario" };
  }
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("medicos").insert(validation.data);
  if (error) return { success: false, message: error.message };
  revalidatePath("/medicos");
  return { success: true, message: "Medico registrado" };
}
