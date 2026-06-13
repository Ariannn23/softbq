import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';

interface Client {
  id: number;
  ruc: string;
  businessName: string;
}

interface ClientComboboxProps {
  clients: Client[];
  value: number | string;
  onChange: (value: number | string) => void;
  placeholder?: string;
  className?: string;
}

export function ClientCombobox({ clients, value, onChange, placeholder = "-- Seleccionar cliente --", className = "" }: ClientComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedClient = clients.find(c => c.id.toString() === value.toString());

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredClients = clients.filter(c => 
    c.businessName.toLowerCase().includes(search.toLowerCase()) || 
    c.ruc.includes(search)
  );

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <button
        type="button"
        className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm flex items-center justify-between"
        onClick={() => {
          setIsOpen(!isOpen);
          setSearch("");
        }}
      >
        <span className={`block truncate ${!selectedClient ? 'text-slate-500' : 'text-slate-900'}`}>
          {selectedClient ? `${selectedClient.ruc} - ${selectedClient.businessName}` : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          <div className="sticky top-0 z-10 bg-white px-3 py-2 border-b border-slate-100 relative">
            <input
              type="text"
              className="w-full border-slate-300 rounded-md py-1.5 pl-3 pr-8 text-sm focus:ring-blue-500 focus:border-blue-500 border outline-none"
              placeholder="Buscar por RUC o nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            {search && (
              <button
                className="absolute right-5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setSearch("");
                }}
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {filteredClients.length === 0 ? (
            <div className="relative cursor-default select-none py-2 px-4 text-slate-700">
              No se encontraron clientes.
            </div>
          ) : (
            filteredClients.map((client) => (
              <div
                key={client.id}
                className={`relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-blue-600 hover:text-white group ${
                  value.toString() === client.id.toString() ? 'bg-blue-50 text-blue-900' : 'text-slate-900'
                }`}
                onClick={() => {
                  onChange(client.id);
                  setIsOpen(false);
                }}
              >
                <span className={`block truncate ${value.toString() === client.id.toString() ? 'font-semibold' : 'font-normal'}`}>
                  {client.ruc} - {client.businessName}
                </span>

                {value.toString() === client.id.toString() ? (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600 group-hover:text-white">
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </span>
                ) : null}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
