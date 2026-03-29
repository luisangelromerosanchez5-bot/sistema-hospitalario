import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";

async function getVisitas() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("visitas")
    .select(`visitaid, fecha, hora, pacientes!pacienteid(nombre, apellido), medicos!medicoid(nombre, apellido)`)
    .order("fecha", { ascending: false })
    .limit(50);
  if (error) throw new Error(error.message);
  return data || [];
}

export default async function VisitasPage() {
  const visitas = await getVisitas();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Visitas</h1>
        <Link href="/visitas/nueva" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + Nueva Visita
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">ID</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Paciente</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Médico</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Fecha</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Hora</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visitas.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No hay visitas registradas</td></tr>
            ) : (
              (visitas as any[]).map((v) => (
                <tr key={v.visitaid} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">#{v.visitaid}</td>
                  <td className="px-4 py-3 font-medium">{v.pacientes?.nombre} {v.pacientes?.apellido}</td>
                  <td className="px-4 py-3 text-gray-600">Dr. {v.medicos?.nombre} {v.medicos?.apellido}</td>
                  <td className="px-4 py-3 text-gray-600">{v.fecha}</td>
                  <td className="px-4 py-3 text-gray-600">{v.hora}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
