import { Download, PlusCircle, Upload } from "lucide-react";

import type { SessionUser } from "../../shared/types";

export function ClientsPageHeader({
  user,
  onImport,
  onCreate,
}: {
  user: SessionUser;
  onImport: () => void;
  onCreate: () => void;
}) {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold">Clientes</h1>
        <p className="mt-2 text-[#26466f]">Administra la base de clientes del estudio.</p>
      </div>
      <div className="flex gap-4">
        <a href="/formato_clientes.xlsx" download className="flex h-[42.4px] items-center gap-3 rounded-md border border-[#c9dbef] bg-white px-6 font-semibold text-[#056ba6] transition-colors hover:bg-slate-50">
          <Download size={20} />
          Descargar formato
        </a>
        {user.role !== "assistant" && (
          <>
            <button className="flex h-[42.4px] items-center gap-3 rounded-md border border-[#c9dbef] bg-white px-6 font-semibold text-[#056ba6] hover:bg-slate-50 transition-colors" onClick={onImport} type="button">
              <Upload size={20} />
              Importar clientes
            </button>
            <button className="flex h-[42.4px] items-center gap-3 rounded-md bg-[#056ba6] px-6 font-semibold text-white hover:bg-[#045585] transition-colors" onClick={onCreate} type="button">
              <PlusCircle size={20} />
              Crear cliente
            </button>
          </>
        )}
      </div>
    </div>
  );
}
