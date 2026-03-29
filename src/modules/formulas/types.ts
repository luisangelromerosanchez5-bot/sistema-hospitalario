export interface DetalleFormula {
  detalleId:       number;
  presentacion:    string;
  posologia:       string;
  periodoUso:      string;
  periodicidadUso: string;
  medicamento: {
    medicamentoId: number;
    nombre:        string;
    prescripcion:  string;
    unidades:      string;
    descripcion:   string;
    cantidad:      number;
  };
}

export interface Formula {
  formulaId:     number;
  tratamientoId: number;
  fecha:         string;
  detalles:      DetalleFormula[];
}

export interface CreateDetalleFormulaDTO {
  medicamentoId:   number;
  presentacion:    string;
  posologia:       string;
  periodoUso:      string;
  periodicidadUso: string;
}

export interface CreateFormulaDTO {
  tratamientoId: number;
  fecha:         string;
  detalles:      CreateDetalleFormulaDTO[];
}