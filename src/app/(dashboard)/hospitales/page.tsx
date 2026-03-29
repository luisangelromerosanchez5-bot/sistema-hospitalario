import { HospitalRepository } from "@/modules/hospitales/hospital.repository";
import { HospitalService }    from "@/modules/hospitales/hospital.service";
import { HospitalesTable }    from "./_components/HospitalesTable";
import { HospitalFormModal }  from "./_components/HospitalFormModal";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata = { title: "Dashboard" };

const hospitalService = new HospitalService(new HospitalRepository());

async function getKPIs() {
  const supabase = await createServerSupabaseClient();
  const hoy = new Date().toISOString().split("T")[0];
  const [pacientes, visitasHoy, medicos, hospitales] = await Promise.all([
    supabase.from("pacientes").select("*", { count: "exact", head: true }),
    supabase.from("visitas").select("*", { count: "exact", head: true }).eq("fecha", hoy),
    supabase.from("medicos").select("*", { count: "exact", head: true }),
    supabase.from("hospitales").select("*", { count: "exact", head: true }),
  ]);
  return {
    pacientes:   pacientes.count  || 0,
    visitasHoy:  visitasHoy.count || 0,
    medicos:     medicos.count    || 0,
    hospitales:  hospitales.count || 0,
  };
}

export default async function HospitalesPage() {
  const [result, kpis] = await Promise.all([
    hospitalService.getAll(),
    getKPIs(),
  ]);

  if (!result.success) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-6">
        <h2 className="text-red-700 font-semibold">Error al cargar hospitales</h2>
        <p className="text-red-600 text-sm mt-1">{result.error}</p>
      </div>
    );
  }

  const hospitales = result.data || [];

  return (
    <div className="space-y-6">

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border p-5 bg-green-50 border-green-200">
          <p className="text-sm font-medium text-green-700">Total Pacientes</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{kpis.pacientes}</p>
        </div>
        <div className="rounded-xl border p-5 bg-blue-50 border-blue-200">
          <p className="text-sm font-medium text-blue-700">Visitas Hoy</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{kpis.visitasHoy}</p>
        </div>
        <div className="rounded-xl border p-5 bg-purple-50 border-purple-200">
          <p className="text-sm font-medium text-purple-700">Médicos</p>
          <p className="text-3xl font-bold text-purple-600 mt-1">{kpis.medicos}</p>
        </div>
        <div className="rounded-xl border p-5 bg-orange-50 border-orange-200">
          <p className="text-sm font-medium text-orange-700">Hospitales</p>
          <p className="text-3xl font-bold text-orange-600 mt-1">{kpis.hospitales}</p>
        </div>
      </div>

      {/* Hospitales */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hospitales</h1>
          <p className="text-sm text-gray-500 mt-1">
            {hospitales.length} hospital{hospitales.length !== 1 ? "es" : ""} registrados
          </p>
        </div>
        <HospitalFormModal />
      </div>

      {hospitales.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No hay hospitales registrados</p>
          <p className="text-sm mt-1">Haz clic en "Nuevo Hospital" para agregar uno.</p>
        </div>
      ) : (
        <HospitalesTable hospitales={hospitales} />
      )}
    </div>
  );
}
