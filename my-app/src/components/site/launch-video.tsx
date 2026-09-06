"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export function LaunchVideo({ src }: { src: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <HoverCard openDelay={150} closeDelay={80}>
        <HoverCardTrigger asChild>
          <button type="button" onClick={() => setOpen(true)} className="link-dotted">
            launch video
          </button>
        </HoverCardTrigger>
        <HoverCardContent
          sideOffset={10}
          align="start"
          className="w-[26rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-border bg-card p-0"
        >
          <video
            src={src}
            muted
            autoPlay
            loop
            playsInline
            preload="metadata"
            className="aspect-video w-full bg-neutral-100 object-cover"
          />
          <div className="flex items-baseline justify-between gap-4 px-5 py-4">
            <span className="font-display text-[18px] leading-tight">MentorTrader launch</span>
            <span className="font-mono text-[11px] text-muted-foreground">click to play</span>
          </div>
        </HoverCardContent>
      </HoverCard>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="gap-0 overflow-hidden rounded-2xl border-border bg-card p-0 sm:max-w-4xl"
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <DialogTitle className="font-display text-[18px] font-normal leading-tight">
              MentorTrader launch
            </DialogTitle>
            <DialogClose
              aria-label="Close"
              className="rounded-md p-1 text-foreground/60 transition-colors hover:bg-neutral-100 hover:text-foreground"
            >
              <X className="size-4" />
            </DialogClose>
          </div>
          {open && (
            <video src={src} controls autoPlay playsInline className="aspect-video w-full bg-neutral-950" />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
