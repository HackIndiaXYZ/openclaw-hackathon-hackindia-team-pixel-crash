"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

type LogoProps = {
  size?: number
  className?: string
  showText?: boolean
  text?: string
  priority?: boolean
}

export function Logo({ size = 28, className, showText = true, text = "Agro-Genix", priority = false }: LogoProps) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2", className)}>
      <Image
        src="/ag-logo.svg"
        alt="Agro-Genix logo"
        width={size}
        height={size}
        priority={priority}
        className="w-auto h-auto"
      />
      {showText ? <span className="text-sm font-semibold leading-none tracking-tight">{text}</span> : null}
    </Link>
  )
}

export default Logo
