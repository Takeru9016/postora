"use client"

import { HugeiconsIcon } from "@hugeicons/react";
import { Leaf01Icon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils"

interface LogoProps {
    name?: string;
    className?: string;
    hideName?: boolean;
}

export function Logo({ name = "Postora", className, hideName = false }: LogoProps) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <HugeiconsIcon icon={Leaf01Icon} size={4} />
            </div>
            {!hideName && <span className="text-lg font-bold tracking-tight">{name}</span>}
        </div>
    )
}