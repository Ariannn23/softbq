import { useNavigate } from "react-router-dom";

import { NewConversionForm } from "../components/NewConversionForm";
import { useNewConversionPage } from "../hooks/useNewConversionPage";

export function NewConversionPage() {
  const navigate = useNavigate();
  const conversion = useNewConversionPage({
    onValidated: (validation) => navigate("/conversions/preview", { state: { validation } }),
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Nueva conversion</h1>
        <p className="text-slate-500 mt-1">Carga los archivos SIRE y prepara la conversion a Contasis.</p>
      </div>

      <NewConversionForm
        clients={conversion.clients}
        clientId={conversion.clientId}
        selectedMonth={conversion.selectedMonth}
        selectedYear={conversion.selectedYear}
        years={conversion.years}
        salesFile={conversion.salesFile}
        purchasesFile={conversion.purchasesFile}
        isSubmitting={conversion.isSubmitting}
        error={conversion.error}
        onClientChange={conversion.setClientId}
        onMonthChange={conversion.setSelectedMonth}
        onYearChange={conversion.setSelectedYear}
        onSalesFileChange={conversion.setSalesFile}
        onPurchasesFileChange={conversion.setPurchasesFile}
        onDrop={conversion.setFileFromDrop}
        onSubmit={conversion.submit}
        onCancel={() => navigate("/conversions")}
      />
    </div>
  );
}
