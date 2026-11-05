"use client";

import { useState } from "react";
import { FALLBACK_IMAGE } from "@/lib/articles";

interface ArticleImageProps {
  src: string;
  className?: string;
  alt?: string;
}

export default function ArticleImage({ src, className, alt = "" }: ArticleImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={failedSrc === src ? FALLBACK_IMAGE : src}
      alt={alt}
      className={className}
      onError={() => setFailedSrc(src)}
    />
  );
}
