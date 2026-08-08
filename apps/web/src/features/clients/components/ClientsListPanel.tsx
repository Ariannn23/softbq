import type { Client, SessionUser } from "../../shared/types";
import { Pagination } from "../../shared/Pagination";
import { SearchBox } from "../../shared/ui";
import { ClientsTable } from "./ClientsTable";

export function ClientsListPanel({
  clients,
  currentPage,
  loading,
  pageSize,
  search,
  totalItems,
  totalPages,
  user,
  onEdit,
  onPageChange,
  onSearchChange,
  onToggleClient,
  onView,
}: {
  clients: Client[];
  currentPage: number;
  loading: boolean;
  pageSize: number;
  search: string;
  totalItems: number;
  totalPages: number;
  user: SessionUser;
  onEdit: (client: Client) => void;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
  onToggleClient: (client: Client, action: "enable" | "disable") => void;
  onView: (client: Client) => void;
}) {
  return (
    <section className="mt-7 overflow-hidden rounded-lg border border-[#d8e8f6] bg-white shadow-sm">
      <div className="border-b border-[#d8e8f6] p-5">
        <SearchBox onChange={onSearchChange} placeholder="Buscar por RUC, razon social o nombre corto..." value={search} />
      </div>
      <ClientsTable clients={clients} loading={loading} onEdit={onEdit} onToggleClient={onToggleClient} onView={onView} user={user} />
      <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={totalItems} pageSize={pageSize} onPageChange={onPageChange} itemName="clientes" />
    </section>
  );
}
