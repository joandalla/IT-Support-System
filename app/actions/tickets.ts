"use server";

import { db } from "../../lib/db"; // Greift auf unsere lib/db.ts zu
import { revalidatePath } from "next/cache";

// Hilfsfunktion: Erstellt einen Test-User, falls keiner existiert.
// Das spart uns für die Prüfung eine komplexe Login-Verwaltung.
async function getOrCreateTestUser() {
  const existingUser = await db.user.findFirst();
  if (existingUser) return existingUser;

  return await db.user.create({
    data: {
      email: "test.entwickler@firma.de",
      name: "Max Mustermann",
    },
  });
}

// 1. Ticket erstellen
export async function createTicket(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as any;

  if (!title || !description) return;

  const testUser = await getOrCreateTestUser();

  await db.ticket.create({
    data: {
      title,
      description,
      priority,
      userId: testUser.id,
    },
  });

  // Aktualisiert die Seite sofort mit den neuen Daten
  revalidatePath("/");
}

// 2. Ticket-Status aktualisieren
export async function updateTicketStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as any;

  if (!id || !status) return;

  await db.ticket.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/");
}

// 3. Ticket löschen
export async function deleteTicket(id: string) {
  await db.ticket.delete({
    where: { id },
  });

  revalidatePath("/");
}