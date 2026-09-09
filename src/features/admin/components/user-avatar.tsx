"use client";

import { useState } from "react";
import Image from "next/image";

interface UserAvatarProps {
  nombres?: string;
  apellidos?: string;
  urlAvatar?: string;
  size?: "xs" | "sm" | "md" | "lg";
  showOnlineDot?: boolean;
  className?: string;
}

export function UserAvatar({
  nombres = "",
  apellidos = "",
  urlAvatar = "",
  size = "md",
  showOnlineDot = false,
  className = "",
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);

  // Obtener 2 letras (primer carácter de nombre + primer carácter de apellido)
  const firstLetter = nombres.trim().charAt(0) || "";
  const secondLetter = apellidos.trim().charAt(0) || "";
  const initials = (firstLetter + secondLetter).toUpperCase() || "US";

  // Tamaños disponibles
  const sizeClasses = {
    xs: "size-5 text-[9px]",
    sm: "size-6 text-[10px]",
    md: "size-7 text-[11px]",
    lg: "size-10 text-sm",
  }[size];

  const dotSizes = {
    xs: "size-1.5",
    sm: "size-1.5",
    md: "size-2 -bottom-0.5 -right-0.5",
    lg: "size-2.5 bottom-0 right-0",
  }[size];

  const hasImage = urlAvatar && !imageError;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full font-bold select-none overflow-visible ${sizeClasses} ${className}`}
    >
      <div className="size-full rounded-full overflow-hidden flex items-center justify-center bg-slate-900 text-white border border-slate-700/60 shadow-xs">
        {hasImage ? (
          <img
            src={urlAvatar}
            alt={`${nombres} ${apellidos}`}
            className="size-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="font-semibold tracking-tight text-white leading-none">
            {initials}
          </span>
        )}
      </div>

      {/* {showOnlineDot && (
        <span
          className={`absolute rounded-full bg-emerald-500 border-2 border-white shadow-xs ${dotSizes}`}
        />
      )} */}
    </div>
  );
}
