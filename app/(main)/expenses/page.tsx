import { loadDashboardForUser } from "@/app/actions/expenses";
import { ExpensesClient } from "@/components/dashboard/ExpensesClient";
import { ROUTES } from "@/lib/constants";
import { redirect } from "next/navigation";

export default async function ExpensesPage() {
  const data = await loadDashboardForUser();
  if (!data) {
    redirect(ROUTES.login);
  }

  return <ExpensesClient {...data} />;
}
