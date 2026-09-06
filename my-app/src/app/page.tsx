"use client";

import { MotionConfig } from "motion/react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Content } from "@/components/site/content";
import { SiteNav } from "@/components/site/nav";

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-dvh flex-col lg:h-dvh lg:overflow-hidden">
        <SiteNav />
        <main className="mx-auto grid w-full max-w-7xl min-h-0 flex-1 grid-cols-1 items-start gap-10 px-6 py-5 md:px-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-stretch lg:gap-16">
          <Content />
          <div className="min-h-0">
            <ChatInterface />
          </div>
        </main>
      </div>
    </MotionConfig>
  );
}
