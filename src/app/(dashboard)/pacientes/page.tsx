import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PacienteForm } from "./_components/PacienteForm";

async function getPacientes() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("pacientes").select("*").order("nombre");
  return data || [];
}

export default async function PacientesPage() {
  const pacientes = await getPacientes();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
      <PacienteForm />
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">ID</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Nombre</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Teléfono</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Correo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pacientes.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No hay pacientes registrados</td></tr>
            ) : (
              (pacientes as any[]).map((p) => (
                <tr key={p.pacienteid} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">#{p.pacienteid}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{p.nombre} {p.apellido}</td>
                  <td className="px-4 py-3 text-gray-600">{p.telefono}</td>
                  <td className="px-4 py-3 text-gray-600">{p.correoelectronico}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
