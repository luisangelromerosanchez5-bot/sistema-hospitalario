import { createServerSupabaseClient } from "@/lib/supabase/server";
import { MedicoForm } from "./_components/MedicoForm";

async function getData() {
  const supabase = await createServerSupabaseClient();
  const [medicosRes, espRes, hospRes] = await Promise.all([
    supabase.from("medicos").select("*, especialidades!especialidadid(nombre), hospitales!hospitalid(nombre)").order("nombre"),
    supabase.from("especialidades").select("especialidadid, nombre"),
    supabase.from("hospitales").select("hospitalid, nombre"),
  ]);
  return { medicos: medicosRes.data || [], especialidades: espRes.data || [], hospitales: hospRes.data || [] };
}

export default async function MedicosPage() {
  const { medicos, especialidades, hospitales } = await getData();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Médicos</h1>
      <MedicoForm especialidades={especialidades as any} hospitales={hospitales as any} />
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">ID</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Nombre</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Especialidad</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Hospital</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {medicos.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No hay médicos registrados</td></tr>
            ) : (
              (medicos as any[]).map((m) => (
                <tr key={m.medicoid} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">#{m.medicoid}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{m.nombre} {m.apellido}</td>
                  <td className="px-4 py-3 text-gray-600">{m.especialidades?.nombre}</td>
                  <td className="px-4 py-3 text-gray-600">{m.hospitales?.nombre}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
