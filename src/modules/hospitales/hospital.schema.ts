import { z } from "zod";

export const CreateHospitalSchema = z.object({
  nombre:    z.string({ error: "El nombre es requerido" }).min(2, "Minimo 2 caracteres"),
  direccion: z.string({ error: "La direccion es requerida" }).min(5, "Minimo 5 caracteres"),
  nit:       z.string({ error: "El NIT es requerido" }).min(5, "NIT invalido"),
  telefono:  z.string({ error: "El telefono es requerido" }).min(7, "Telefono invalido"),
});

export const UpdateHospitalSchema = CreateHospitalSchema.partial();

export type CreateHospitalInput = z.infer<typeof CreateHospitalSchema>;
export type UpdateHospitalInput = z.infer<typeof UpdateHospitalSchema>;
