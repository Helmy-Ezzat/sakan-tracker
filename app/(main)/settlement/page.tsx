import { loadDashboardForUser } from "@/app/actions/expenses";
import { SettlementClient } from "@/components/dashboard/SettlementClient";
import { ROUTES } from "@/lib/constants";
import { redirect } from "next/navigation";

export default async function SettlementPage() {
  const data = await loadDashboardForUser();
  if (!data) {
    redirect(ROUTES.login);
  }

  return <SettlementClient {...data} />;
}
