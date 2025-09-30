import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { InputPanel } from "@/components/input-panel";
import { ReportPanel } from "@/components/report-panel";
import { auth } from "../(auth)/auth";

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const cookieStore = await cookies();
  return (
    <>
      <div className="flex flex-row justify-center h-screen">
        <InputPanel />
        <ReportPanel />
      </div>
    </>
  );
}
