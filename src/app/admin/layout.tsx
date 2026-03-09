import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";
import Sidebar from "@/components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Allow the login page through without auth
  const session = await auth();

  return (
    <SessionProvider session={session}>
      {session ? (
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 bg-gray-50">
            <div className="p-8">{children}</div>
          </div>
        </div>
      ) : (
        children
      )}
    </SessionProvider>
  );
}
