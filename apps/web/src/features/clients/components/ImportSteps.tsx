export function ImportSteps({ currentStep }: { currentStep: number }) {
  const steps = [
    ["Subir archivo", "Archivo Excel"],
    ["Hojas", "Seleccionar hoja"],
    ["Columnas", "Detectar columnas"],
    ["Mapeo", "Asignar campos"],
    ["Vista previa", "Revisar datos"],
    ["Confirmar", "Importar datos"],
    ["Resumen", "Resultado"]
  ];

  return (
    <div className="mt-7 flex items-center gap-3 overflow-x-auto pb-1">
      {steps.map(([title, subtitle], index) => {
        const step = index + 1;
        const active = step <= currentStep;

        return (
          <div className="flex min-w-fit items-center gap-3" key={title}>
            <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${active ? "bg-[#007fcb] text-white shadow-lg" : "bg-[#d8e8f6] text-[#40577a]"}`}>
              {step}
            </div>
            <div>
              <p className="text-sm font-bold">{title}</p>
              <p className="text-xs text-[#53698d]">{subtitle}</p>
            </div>
            {index < steps.length - 1 ? <div className="h-px w-16 bg-[#c9dbef]" /> : null}
          </div>
        );
      })}
    </div>
  );
}
