import { InputPanel } from "@/components/input-panel";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  return (
    <>
      <InputPanel />
    </>
  );
}
