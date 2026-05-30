import { Card } from "@/components/ui/Card";
import { LogoutButton } from "@/components/settings/LogoutButton";
import { ThemeSelector } from "@/components/settings/ThemeSelector";
import { getRoomCodeFromCookies, getUserIdFromCookies } from "@/lib/auth/cookies";
import { getUserById } from "@/lib/data/users";
import { ar } from "@/lib/i18n/ar";
import { ROUTES } from "@/lib/constants";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const userId = await getUserIdFromCookies();
  const roomCode = await getRoomCodeFromCookies();

  if (!userId || !roomCode) {
    redirect(ROUTES.login);
  }

  const user = await getUserById(userId);

  if (!user) {
    redirect(ROUTES.login);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">{ar.settings.title}</h1>
        <p className="text-sm text-muted">{ar.settings.subtitle}</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-muted">
          {ar.settings.accountSection}
        </h2>
        <Card className="space-y-4">
          <div>
            <p className="text-xs text-muted">{ar.settings.yourName}</p>
            <p className="mt-1 font-medium">{user.name}</p>
          </div>
          <div>
            <p className="text-xs text-muted">{ar.settings.yourPhone}</p>
            <p className="mt-1 font-medium" dir="ltr">
              {user.phone_number}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">{ar.settings.yourRole}</p>
            <p className="mt-1 font-medium">
              {user.role === "admin"
                ? ar.settings.roleAdmin
                : ar.settings.roleUser}
              {user.role === "admin" ? " 👑" : ""}
            </p>
          </div>
        </Card>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-muted">
          {ar.settings.roomSection}
        </h2>
        <Card>
          <div>
            <p className="text-xs text-muted">{ar.settings.roomCode}</p>
            <p className="mt-1 font-medium">{user.room_code}</p>
          </div>
        </Card>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-muted">
          {ar.settings.appearanceSection}
        </h2>
        <ThemeSelector />
      </section>

      <LogoutButton />
    </div>
  );
}
