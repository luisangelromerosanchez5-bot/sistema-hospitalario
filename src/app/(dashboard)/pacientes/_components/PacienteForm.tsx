"use client";

import { useActionState, useState } from "react";
import { createPacienteAction } from "@/modules/pacientes/paciente.actions";

export function PacienteForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createPacienteAction, null);

  return (
    <>
      <button onClick={() => setOpen(!open)}
        className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
        + Nuevo Paciente
      </button>
      {open && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          {state && !state.success && <p className="text-red-600 text-sm mb-3">{state.message}</p>}
          {state?.success && <p className="text-green-600 text-sm mb-3">{state.message}</p>}
          <form action={formAction} className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input name="nombre" type="text" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input name="apellido" type="text" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input name="telefono" type="text" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
              <input name="correoelectronico" type="email" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Nacimiento</label>
              <input name="fechanacimiento" type="date" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
              <select name="sexo" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900">
                <option value="">Seleccione...</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input name="direccion" type="text" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
            </div>
            <div className="col-span-2 flex gap-2 pt-1">
              <button type="submit" disabled={isPending}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium">
                {isPending ? "Guardando..." : "Guardar"}
              </button>
              <button type="button" onClick={() => setOpen(false)}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 text-sm">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
