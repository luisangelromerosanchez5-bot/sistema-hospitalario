"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { z } from "zod";

const Schema = z.object({
  nombre:            z.string().min(2, "Minimo 2 caracteres"),
  apellido:          z.string().min(2, "Minimo 2 caracteres"),
  telefono:          z.string().min(7, "Telefono invalido"),
  correoelectronico: z.string().email("Correo invalido"),
  fechanacimiento:   z.string().min(1, "Fecha requerida"),
  sexo:              z.enum(["M", "F"]),
  direccion:         z.string().min(5, "Direccion requerida"),
});

export async function createPacienteAction(_prev: unknown, formData: FormData) {
  const validation = Schema.safeParse(Object.fromEntries(formData));
  if (!validation.success) {
    return { success: false, message: "Errores en el formulario" };
  }
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("pacientes").insert(validation.data);
  if (error) return { success: false, message: error.message };
  revalidatePath("/pacientes");
  return { success: true, message: "Paciente registrado" };
}
