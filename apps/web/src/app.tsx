import { FileSpreadsheet, LockKeyhole, UsersRound } from "lucide-react";

const cards = [
  { title: "Clientes", value: "Base local", icon: UsersRound },
  { title: "Conversiones", value: "SIRE a Contasis", icon: FileSpreadsheet },
  { title: "Acceso", value: "admin / armando", icon: LockKeyhole }
];

export function App() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">SOFTBQ</p>
            <h1 className="text-2xl font-semibold">Panel local del estudio contable</h1>
          </div>
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Nueva conversion
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.title} className="rounded-lg border border-border bg-white p-5 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-muted text-primary">
                  <Icon size={20} />
                </div>
                <h2 className="text-sm font-medium text-muted-foreground">{card.title}</h2>
                <p className="mt-1 text-xl font-semibold">{card.value}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-8 rounded-lg border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">MVP inicial</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Esta base separa la UI, el backend y los paquetes de conversion. El siguiente paso es implementar login,
            clientes, validacion de archivos SIRE y generacion Excel para Contasis.
          </p>
        </div>
      </section>
    </main>
  );
}