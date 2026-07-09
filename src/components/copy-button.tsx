"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CopyButtonProps {
  text: string;
  label?: string;
  variant?: "default" | "outline" | "secondary";
}

export function CopyButton({ text, label = "복사", variant = "outline" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("클립보드에 복사되었습니다.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("복사에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Button variant={variant} onClick={handleCopy} className="gap-2">
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {label}
    </Button>
  );
}
