import { useNavigate } from "react-router-dom";

import type { SessionUser } from "../../shared/types";
import { ImportColumnsStep } from "../components/ImportColumnsStep";
import { ImportConfirmationStep } from "../components/ImportConfirmationStep";
import { ImportFileStep } from "../components/ImportFileStep";
import { ImportMappingStep } from "../components/ImportMappingStep";
import { ImportPreviewStep } from "../components/ImportPreviewStep";
import { ImportResultSummary } from "../components/ImportResultSummary";
import { ImportSheetStep } from "../components/ImportSheetStep";
import { ImportSteps } from "../components/ImportSteps";
import { useClientImport } from "../hooks/useClientImport";

export function ImportClientsPage({
  onClientsChanged,
  user
}: {
  onClientsChanged: () => void;
  user: SessionUser;
}) {
  const navigate = useNavigate();
  const state = useClientImport(onClientsChanged);

  if (!user) {
    return <p className="p-8 text-[#072d4a]">Cargando...</p>;
  }

  return (
    <div className="mx-auto max-w-[1540px] px-7 py-7">
      <div className="text-sm text-[#53698d]">
        <button className="hover:text-[#056ba6]" onClick={() => navigate("/clients")} type="button">Clientes</button>
        <span className="mx-3">{">"}</span>
        <span>Importar clientes</span>
      </div>
      <h1 className="mt-3 text-3xl font-bold">Importar clientes</h1>
      <p className="mt-2 text-[#26466f]">Carga la base inicial de clientes desde un archivo Excel.</p>

      <ImportSteps currentStep={state.currentStep} />

      <div className="mt-6 grid gap-3 xl:grid-cols-[330px_minmax(0,1fr)_minmax(0,1fr)]">
        <ImportFileStep fileName={state.fileName} fileSize={state.fileSize} onFileChange={(file) => void state.handleFileChange(file)} />
        <ImportSheetStep analysis={state.analysis} busy={state.busy} selectedSheet={state.selectedSheet} selectedSheetInfo={state.selectedSheetInfo} onSheetChange={state.setSelectedSheet} />
        <ImportColumnsStep busy={state.busy} hasAnalysis={Boolean(state.analysis)} headers={state.headers} />
        <ImportMappingStep busy={state.busy} hasAnalysis={Boolean(state.analysis)} headers={state.headers} mapping={state.mapping} onMappingChange={state.setMapping} />
        <ImportPreviewStep busy={state.busy} hasAnalysis={Boolean(state.analysis)} preview={state.preview} />
      </div>

      <section className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <ImportConfirmationStep busy={state.busy} message={state.message} preview={state.preview} onCancel={() => navigate("/clients")} onConfirm={() => void state.confirmImport()} />
        <ImportResultSummary summary={state.summary} />
      </section>
    </div>
  );
}
