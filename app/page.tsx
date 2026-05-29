import { ROUTES } from "@/lib/constants";
import { redirect } from "next/navigation";

/** Entry — auth gate added in the next phase; send users to login for now. */
export default function HomePage() {
  redirect(ROUTES.login);
}
