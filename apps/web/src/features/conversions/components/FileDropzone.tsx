import { UploadCloud, X } from "lucide-react";

type FileDropzoneProps = {
  label: string;
  description: string;
  file: File | null;
  iconColor: string;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
};

export function FileDropzone({
  label,
  description,
  file,
  iconColor,
  onDrop,
  onChange,
  onRemove,
}: FileDropzoneProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <p className="text-xs text-slate-500 mb-3">{description}</p>

      <div
        className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors"
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
      >
        <UploadCloud className={`w-10 h-10 mb-3 ${iconColor}`} />
        {file ? (
          <div className="flex items-center gap-2 text-sm bg-white border border-slate-200 py-2 px-3 rounded shadow-sm">
            <span className="font-medium truncate max-w-[200px]">{file.name}</span>
            <span className="text-slate-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
            <button type="button" onClick={onRemove} className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-red-500">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-700 mb-2 font-medium">Arrastra y suelta el archivo aqui</p>
            <p className="text-xs text-slate-500 mb-3">o</p>
            <label className="cursor-pointer text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded border border-blue-100 hover:bg-blue-100 transition-colors">
              Seleccionar archivo
              <input type="file" className="hidden" accept=".txt,.csv" onChange={onChange} />
            </label>
          </>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px]">i</div>
        <span>Formatos permitidos: .txt, .csv. Tamano maximo: 50 MB</span>
      </div>
    </div>
  );
}
