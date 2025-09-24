import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { InputPanel } from "@/components/input-panel";
/* import { DataStreamHandler } from "@/components/data-stream-handler"; */
/* import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models"; */
import { generateUUID } from "@/lib/utils";
import { auth } from "../(auth)/auth";

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const id = generateUUID();

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("chat-model");

  if (!modelIdFromCookie) {
    return (
      <>
        <InputPanel />
        {/* <Chat
          autoResume={false}
          id={id}
          initialChatModel={DEFAULT_CHAT_MODEL}
          initialMessages={[]}
          initialVisibilityType="private"
          isReadonly={false}
          key={id}
        /> */}
        {/* <DataStreamHandler /> */}
      </>
    );
  }

  return (
    <>
      <InputPanel />
      {/* <Chat
        autoResume={false}
        id={id}
        initialChatModel={modelIdFromCookie.value}
        initialMessages={[]}
        initialVisibilityType="private"
        isReadonly={false}
        key={id}
      /> */}
      {/* <DataStreamHandler /> */}
    </>
  );
}
