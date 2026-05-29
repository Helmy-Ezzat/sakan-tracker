import { loadDashboardForUser } from "@/app/actions/expenses";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { ROUTES } from "@/lib/constants";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const data = await loadDashboardForUser();
  if (!data) {
    redirect(ROUTES.login);
  }

  return <DashboardClient {...data} />;
}
