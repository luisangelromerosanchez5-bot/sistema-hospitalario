import { Hospital } from "@/modules/hospitales/types";

export function HospitalesTable({ hospitales }: { hospitales: Hospital[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-4 py-3 text-left">Nombre</th>
            <th className="px-4 py-3 text-left">Direccion</th>
            <th className="px-4 py-3 text-left">NIT</th>
            <th className="px-4 py-3 text-left">Telefono</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {hospitales.map((h) => (
            <tr key={h.hospitalId} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{h.nombre}</td>
              <td className="px-4 py-3 text-gray-600">{h.direccion}</td>
              <td className="px-4 py-3 text-gray-600">{h.nit}</td>
              <td className="px-4 py-3 text-gray-600">{h.telefono}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}