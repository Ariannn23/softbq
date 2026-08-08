import { ConfirmModal } from "../../shared/ConfirmModal";
import { BillingChargesTable } from "../components/BillingChargesTable";
import { BillingHeader } from "../components/BillingHeader";
import { BillingPaymentPanel } from "../components/BillingPaymentPanel";
import { BillingSummaryCards } from "../components/BillingSummaryCards";
import { EditAmountModal } from "../components/EditAmountModal";
import { NewChargePanel } from "../components/NewChargePanel";
import { useBillingPage } from "../hooks/useBillingPage";

export function BillingPage() {
  const billing = useBillingPage();
  const isPanelOpen = Boolean(billing.payment.charge) || billing.newCharge.isOpen;

  return (
    <div className={`transition-all duration-300 ease-in-out ${isPanelOpen ? "pr-[360px]" : ""}`}>
      <div className="p-6 max-w-[1400px] mx-auto space-y-6">
        <BillingHeader
          selectedMonth={billing.selectedMonth}
          selectedYear={billing.selectedYear}
          years={billing.years}
          isGenerating={billing.isGenerating}
          onMonthChange={billing.setSelectedMonth}
          onYearChange={billing.setSelectedYear}
          onNewCharge={billing.newCharge.open}
          onGenerateMonthly={billing.actions.generateMonthly}
        />

        <BillingSummaryCards {...billing.totals} />

        <BillingChargesTable
          charges={billing.paginatedCharges}
          filteredCount={billing.filteredCharges.length}
          isLoading={billing.isLoading}
          searchTerm={billing.searchTerm}
          page={billing.page}
          limit={billing.limit}
          onSearchChange={billing.setSearchTerm}
          onPageChange={billing.setPage}
          onPageSizeChange={billing.setLimit}
          onEditAmount={billing.actions.openEditAmountModal}
          onRegisterPayment={billing.actions.openPaymentPanel}
        />
      </div>

      {billing.payment.charge && (
        <BillingPaymentPanel
          charge={billing.payment.charge}
          amount={billing.payment.amount}
          method={billing.payment.method}
          date={billing.payment.date}
          notes={billing.payment.notes}
          isSubmitting={billing.payment.isSubmitting}
          onAmountChange={billing.payment.setAmount}
          onMethodChange={billing.payment.setMethod}
          onDateChange={billing.payment.setDate}
          onNotesChange={billing.payment.setNotes}
          onClose={billing.payment.close}
          onSave={billing.payment.save}
        />
      )}

      {billing.editAmount.isOpen && (
        <EditAmountModal
          value={billing.editAmount.value}
          isSubmitting={billing.editAmount.isSubmitting}
          onValueChange={billing.editAmount.setValue}
          onClose={billing.editAmount.close}
          onSave={billing.editAmount.save}
        />
      )}

      {billing.newCharge.isOpen && (
        <NewChargePanel
          clients={billing.clients}
          clientId={billing.newCharge.clientId}
          concept={billing.newCharge.concept}
          amount={billing.newCharge.amount}
          isSubmitting={billing.newCharge.isSubmitting}
          onClientChange={billing.newCharge.setClientId}
          onConceptChange={billing.newCharge.setConcept}
          onAmountChange={billing.newCharge.setAmount}
          onClose={billing.newCharge.close}
          onSave={billing.newCharge.save}
        />
      )}

      <ConfirmModal
        isOpen={billing.showConfirmModal}
        onClose={() => billing.setShowConfirmModal(false)}
        onConfirm={billing.actions.executeGenerateMonthly}
        title="Generar Deudas Mensuales"
        message="Seguro que deseas generar las deudas por Honorarios para todos los clientes activos este mes?"
        confirmText="Si, generar deudas"
      />
    </div>
  );
}
