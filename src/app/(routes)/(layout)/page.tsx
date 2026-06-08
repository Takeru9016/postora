"use client"

import { useAuth, UserButton } from "@clerk/nextjs";

import { Logo } from "@/components";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {

  const { isSignedIn } = useAuth()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border/60 backdrop-blur bg-background/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Logo />

          <nav></nav>

          <div className="flex items-center gap-3">
            {!isSignedIn ? (
              <>
                <Button asChild variant={"outline"} className="rounded-full px-5">
                  <Link href={"/sign-in"}>
                    Sign in
                  </Link>
                </Button>
                <Button asChild variant={"default"} className="rounded-full px-5">
                  <Link href={"/sign-up"}>
                    Sign up
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild className="rounded-full px-5">
                  <Link href={"/dashboard"}>
                    Open Dashboard
                  </Link>
                </Button>
                <UserButton />
              </>
            )}
          </div>
        </div>

      </header>
    </div>
  );
}
