import { db } from "../lib/db";
import { createTicket, updateTicketStatus, deleteTicket } from "./actions/tickets";

export const revalidate = 0;

export default async function Home() {
  const tickets = await db.ticket.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-4xl mx-auto p-6 md:p-12 min-h-screen bg-slate-50 text-slate-800">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">IT-Support-Ticketsystem</h1>
        <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
          Admin-Bereich
        </span>
      </div>

      {/* Sektion 1: Ticket erstellen */}
      <section className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm mb-10">
        <h2 className="text-xl font-semibold mb-4 text-slate-700">Neues Ticket erfassen</h2>
        <form action={createTicket} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Betreff</label>
            <input
              type="text"
              name="title"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="z.B. Monitor flackert oder VPN-Zugang gesperrt"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Problembeschreibung</label>
            <textarea
              name="description"
              required
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Bitte beschreiben Sie das Problem möglichst genau..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Priorität</label>
            <select
              name="priority"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
            >
              <option value="LOW">Niedrig</option>
              <option value="MEDIUM">Mittel</option>
              <option value="HIGH">Hoch</option>
            </select>
          </div>

          <button
            type="submit"
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Ticket einsenden
          </button>
        </form>
      </section>

      {/* Sektion 2: Liste aller Tickets */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-slate-700">Gemeldete Vorfälle ({tickets.length})</h2>
        {tickets.length === 0 ? (
          <div className="bg-white p-6 rounded-lg border border-slate-200 text-center text-slate-500">
            Aktuell liegen keine Support-Tickets vor.
          </div>
        ) : (
          <div className="grid gap-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{ticket.title}</h3>
                      <p className="text-xs text-slate-400">
                        Gemeldet von: {ticket.user.name} ({ticket.user.email})
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        ticket.priority === "HIGH"
                          ? "bg-red-100 text-red-800"
                          : ticket.priority === "MEDIUM"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {ticket.priority === "HIGH" ? "Hoch" : ticket.priority === "MEDIUM" ? "Mittel" : "Niedrig"}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm mb-4 whitespace-pre-wrap">{ticket.description}</p>
                </div>

                <div className="flex flex-wrap justify-between items-center gap-4 pt-3 border-t border-slate-100">
                  {/* Formular zur Statusänderung */}
                  <form action={updateTicketStatus} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={ticket.id} />
                    <span className="text-xs text-slate-500 font-medium">Status:</span>
                    <select
                      name="status"
                      defaultValue={ticket.status}
                      className="text-xs border border-slate-300 rounded p-1 text-black bg-slate-50 font-medium cursor-pointer"
                    >
                      <option value="OPEN">Offen</option>
                      <option value="IN_PROGRESS">In Bearbeitung</option>
                      <option value="CLOSED">Gelöst</option>
                    </select>
                    <button 
                      type="submit" 
                      className="text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded font-semibold transition-colors"
                    >
                      Speichern
                    </button>
                  </form>

                  <form
                    action={async () => {
                      "use server";
                      await deleteTicket(ticket.id);
                    }}
                  >
                    <button className="text-xs text-red-600 hover:text-red-800 font-medium transition-colors">
                      Ticket löschen
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}