import { redirect } from "next/navigation";
import { getSession } from "../../lib/get-session";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user.email}</p>
    </main>
  );
}
