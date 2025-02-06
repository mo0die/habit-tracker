import { CreateHabit } from "@/components/createHabit";
import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import Link from "next/link";
import { UpdateHabit } from "@/components/updateHabit";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      k
      <main className="flex min-h-screen flex-col items-center justify-center text-black">
        <Link
          href={session ? "/api/auth/signout" : "/api/auth/signin"}
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          {session ? "Sign out" : "Sign in"}
        </Link>
        <div>
          <CreateHabit />
        </div>
        <div className="mt-4">
          <UpdateHabit />
        </div>
      </main>
    </HydrateClient>
  );
}
