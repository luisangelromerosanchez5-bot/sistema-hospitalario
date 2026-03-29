import { type NextRequest, NextResponse } from "next/server";
import { HospitalRepository } from "@/modules/hospitales/hospital.repository";
import { HospitalService } from "@/modules/hospitales/hospital.service";
import { CreateHospitalSchema } from "@/modules/hospitales/hospital.schema";

const service = new HospitalService(new HospitalRepository());

export async function GET(_request: NextRequest) {
  const result = await service.getAll();
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ data: result.data, total: result.data?.length ?? 0 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = CreateHospitalSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: "Datos invalidos" }, { status: 400 });
  }
  const result = await service.create(validation.data);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 422 });
  }
  return NextResponse.json(result.data, { status: 201 });
}
