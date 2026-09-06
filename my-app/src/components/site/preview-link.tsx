"use client";

import Image from "next/image";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const previews: Record<string, { title: string; domain: string }> = {
  "https://hecaton.co/": { title: "Hecaton", domain: "hecaton.co" },
  "https://1bitcoin.ca/": { title: "1Bitcoin.ca", domain: "1bitcoin.ca" },
  "https://www.fleetcraft.com/": { title: "Fleetcraft", domain: "fleetcraft.com" },
  "https://realestateaigents.ca/": { title: "reAIgents", domain: "realestateaigents.ca" },
  "https://www.mentor-trader.com/": { title: "MentorTrader", domain: "mentor-trader.com" },
  "https://www.manulife.ca/": { title: "Manulife", domain: "manulife.ca" },
  "https://bolttech.io/": { title: "Bolttech", domain: "bolttech.io" },
  "https://sensoft.tech/": { title: "Sensoft Technologies", domain: "sensoft.tech" },
  "https://www.blockmark.ca/": { title: "Blockmark", domain: "blockmark.ca" },
};

export function PreviewLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const link = (
    <a href={href} target="_blank" rel="noopener noreferrer" className="link-dotted">
      {children}
    </a>
  );
  const preview = previews[href];
  if (!preview) return link;

  return (
    <HoverCard openDelay={150} closeDelay={80}>
      <HoverCardTrigger asChild>{link}</HoverCardTrigger>
      <HoverCardContent
        sideOffset={10}
        align="start"
        className="w-[26rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-border bg-card p-0"
      >
        <Image
          src={`https://s.wordpress.com/mshots/v1/${encodeURIComponent(href)}?w=640`}
          alt={`Screenshot of ${preview.title}`}
          width={640}
          height={400}
          unoptimized
          className="h-60 w-full bg-neutral-100 object-cover object-top"
        />
        <div className="flex items-baseline justify-between gap-4 px-5 py-4">
          <span className="font-display text-[18px] leading-tight">{preview.title}</span>
          <span className="font-mono text-[11px] text-muted-foreground">{preview.domain}</span>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
