import { GuestGame } from "@/components/GuestGame";

type SessionPageProps = {
  params: Promise<{ code: string }>;
};

export default async function SessionPage({ params }: SessionPageProps) {
  const { code } = await params;
  return <GuestGame code={code.toUpperCase()} />;
}
