"use client";

import { useActionState } from "react";
import { createVisitaAction } from "@/modules/visitas/visita.actions";
import Link from "next/link";

export default function NuevaVisitaPage() {
  const [state, formAction, isPending] = useActionState(createVisitaAction, null);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/visitas" className="text-gray-500 hover:text-gray-700">← Volver</Link>
        <h1 className="text-2xl font-bold text-gray-900">Nueva Visita</h1>
      </div>

      {state && !state.success && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {state.message}
        </div>
      )}

      <form action={formAction} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Paciente</label>
            <input name="pacienteId" type="number" required min="1"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Médico</label>
            <input name="medicoId" type="number" required min="1"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input name="fecha" type="date" required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
            <input name="hora" type="time" required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico</label>
          <textarea name="diagnostico" rows={3} placeholder="Mínimo 10 caracteres"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>

        <h3 className="font-medium text-gray-800 border-t pt-4">Signos Vitales (opcional)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Frec. Cardíaca</label>
            <input name="frecuenciaCardiaca" type="number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Presión Arterial (ej: 120/80)</label>
            <input name="presionArterial" type="text" placeholder="120/80"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Frec. Respiratoria</label>
            <input name="frecuenciaRespiratoria" type="number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Temperatura (°C)</label>
            <input name="temperatura" type="number" step="0.1"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Saturación O₂ (%)</label>
            <input name="saturacionOxigeno" type="number" step="0.01"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>

        <button type="submit" disabled={isPending}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium">
          {isPending ? "Guardando..." : "Guardar Visita"}
        </button>
      </form>
    </div>
  );
}
