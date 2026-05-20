"use client";

import { ChatInterface } from "@/components/chat/ChatInterface";
import { NavbarDemo } from "@/components/ui/navbar-demo";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { motion } from "motion/react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type LinkPreviewData = {
  title: string;
  domain: string;
};

const linkPreviews: Record<string, LinkPreviewData> = {
  "https://hecaton.co/": {
    title: "Hecaton",
    domain: "hecaton.co",
  },
  "https://1bitcoin.ca/": {
    title: "1Bitcoin.ca",
    domain: "1bitcoin.ca",
  },
  "https://www.fleetcraft.com/": {
    title: "Fleetcraft",
    domain: "fleetcraft.com",
  },
  "https://realestateaigents.ca/": {
    title: "reAIgents",
    domain: "realestateaigents.ca",
  },
  "https://www.mentor-trader.com/": {
    title: "MentorTrader",
    domain: "mentor-trader.com",
  },
  "https://www.manulife.ca/": {
    title: "Manulife",
    domain: "manulife.ca",
  },
  "https://bolttech.io/": {
    title: "Bolttech",
    domain: "bolttech.io",
  },
  "https://sensoft.tech/": {
    title: "Sensoft Technologies",
    domain: "sensoft.tech",
  },
  "https://kinfo.com/": {
    title: "Kinfo",
    domain: "kinfo.com",
  },
  "https://www.darwinexzero.com/": {
    title: "Darwinex Zero",
    domain: "darwinexzero.com",
  },
  "https://www.youtube.com/@tommyanytime": {
    title: "Tommy Anytime",
    domain: "youtube.com",
  },
  "https://www.blockmark.ca/": {
    title: "Blockmark",
    domain: "blockmark.ca",
  },
};

function getWebpagePreviewImage(href: string) {
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(href)}?w=640`;
}

function PreviewLink({ href, children }: { href: string; children: ReactNode }) {
  const preview = linkPreviews[href];
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const cardHeight = 320;
    const spaceBelow = window.innerHeight - rect.bottom;
    const showAbove = spaceBelow < cardHeight + 16 && rect.top > cardHeight + 16;

    setPosition({
      top: showAbove ? rect.top - cardHeight - 12 : rect.bottom + 12,
      left: rect.left + rect.width / 2,
    });
  }, []);

  const openPreview = useCallback(() => {
    updatePosition();
    setIsOpen(true);
  }, [updatePosition]);

  const closePreview = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleReposition = () => updatePosition();
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);

    return () => {
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [isOpen, updatePosition]);

  if (!preview) {
    return <a href={href}>{children}</a>;
  }

  const webpagePreviewImage = getWebpagePreviewImage(href);

  const previewCard =
    mounted && isOpen
      ? createPortal(
          <div
            aria-hidden="true"
            className="pointer-events-none w-[min(26rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl border border-white/20 bg-zinc-950 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.85)] sm:w-[26rem] animate-in fade-in zoom-in-95 duration-150"
            style={{ position: 'fixed', zIndex: 99999, top: position.top, left: position.left }}
          >
            <div className="bg-zinc-950">
              <Image
                src={webpagePreviewImage}
                alt={`${preview.title} webpage preview`}
                width={832}
                height={520}
                className="block h-60 w-full bg-zinc-900 object-cover object-top"
                sizes="416px"
                unoptimized
              />
              <div className="border-t border-white/10 bg-zinc-950 p-4">
                <span className="block truncate font-heading text-lg font-black leading-tight text-white">
                  {preview.title}
                </span>
                <span className="mt-1 block truncate font-code text-[11px] text-zinc-400">
                  {preview.domain}
                </span>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <span
        ref={triggerRef}
        className="group/link-preview relative inline-flex align-baseline"
        onPointerEnter={openPreview}
        onPointerLeave={closePreview}
      >
        <motion.a
          href={href}
          className="relative inline-flex rounded-sm underline decoration-white/30 underline-offset-4 transition-all duration-200 hover:decoration-white hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          onFocus={openPreview}
          onBlur={closePreview}
        >
          <span className="absolute -inset-x-1.5 -inset-y-1 rounded-md bg-white/0 transition-colors duration-200 group-hover/link-preview:bg-white/[0.12] group-focus-within/link-preview:bg-white/[0.12]" />
          <span className="relative">{children}</span>
        </motion.a>
      </span>
      {previewCard}
    </>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <NavbarDemo />

        {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8 pb-20 sm:p-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Introduction */}
          <motion.div 
            className="space-y-6 font-body"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-5xl font-heading font-black mb-8 tracking-tight">
              <TypingAnimation words={["Hey, I'm Chris!"]} />
            </h1>
            
            <motion.div 
              className="space-y-4 text-gray-300 text-base leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <p>I&apos;m based in <span className="underline">Toronto</span> and <span className="underline">Waterloo</span>.</p>
              <p>I came to Waterloo to study <span className="underline">CS</span> in 2023 and have been here ever since.</p>
            </motion.div>

            <motion.div 
              className="space-y-6 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h2 className="text-xl font-heading font-bold text-white text-left">What am I doing currently...</h2>
              
              <div className="space-y-3 text-gray-300">
                <motion.div 
                  className="flex items-baseline gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  whileHover={{ x: 5 }}
                >
                  <span className="text-gray-500 flex-shrink-0">›</span>
                  <p className="flex-1">studying <span className="font-semibold text-white">Computer Science</span> at <span className="inline-flex items-center gap-1.5 underline">
                    <Image 
                      src="https://storage-prtl-co.imgix.net/endor/organisations/14118/logos/1703088516_studyportals-logo.png" 
                      alt="Wilfrid Laurier University" 
                      width={16} 
                      height={16} 
                      className="inline-block"
                    />
                    Wilfrid Laurier University
                  </span> (grad: Dec. 2026, GPA: 3.85)</p>
                </motion.div>
                <motion.div 
                  className="flex items-baseline gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  whileHover={{ x: 5 }}
                >
                  <span className="text-gray-500 flex-shrink-0">›</span>
                  <p className="flex-1">working at (<span className="inline-flex items-baseline gap-1.5">
                    <Image 
                      src="/Hecaton Logo.svg" 
                      alt="Hecaton" 
                      width={16} 
                      height={16} 
                      className="inline-block align-text-bottom"
                    />
                    <PreviewLink href="https://hecaton.co/">Hecaton</PreviewLink>
                  </span>) to ship digital products for startups (<span className="inline-flex items-baseline gap-1.5 underline font-semibold">
                    <Image 
                      src="/1bitcoincaLogosmall-1024x247.webp" 
                      alt="1Bitcoin.ca" 
                      width={16} 
                      height={16} 
                      className="inline-block align-text-bottom"
                    />
                    <PreviewLink href="https://1bitcoin.ca/">1Bitcoin.ca</PreviewLink>
                  </span>, <span className="inline-flex items-baseline gap-1.5 underline font-semibold">
                    <Image 
                      src="/fleetcraft logo.png" 
                      alt="Fleetcraft" 
                      width={16} 
                      height={16} 
                      className="inline-block align-text-bottom"
                    />
                    <PreviewLink href="https://www.fleetcraft.com/">Fleetcraft</PreviewLink>
                  </span>, <span className="underline font-semibold"><PreviewLink href="https://realestateaigents.ca/">reAIgents</PreviewLink></span>)</p>
                </motion.div>
                <motion.div 
                  className="flex items-baseline gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                  whileHover={{ x: 5 }}
                >
                  <span className="text-gray-500 flex-shrink-0">›</span>
                  <p className="flex-1">working on <span className="inline-flex items-baseline gap-1.5 font-semibold text-white underline">
                    <Image 
                      src="/MT logo.jpeg" 
                      alt="MentorTrader" 
                      width={16} 
                      height={16} 
                      className="inline-block align-text-bottom"
                    />
                    <PreviewLink href="https://www.mentor-trader.com/">MentorTrader</PreviewLink>
                  </span> 
                  </p>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              className="space-y-6 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              <h2 className="text-xl font-heading font-bold text-white text-left">I ...</h2>
              
              <div className="space-y-3 text-gray-300">
                <motion.div 
                  className="flex items-baseline gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1, duration: 0.4 }}
                  whileHover={{ x: 5 }}
                >
                  <span className="text-gray-500 flex-shrink-0">›</span>
                  <p className="flex-1">
                    will be working as a SWE (Architecture team) at{" "}
                    <span className="inline-flex items-center gap-1.5 underline font-semibold text-white">
                      <PreviewLink href="https://www.manulife.ca/">Manulife</PreviewLink>
                    </span>
                    {' this summer.(May to Sep. 2026)'}
                  </p>
                </motion.div>
                <motion.div 
                  className="flex items-baseline gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1, duration: 0.4 }}
                  whileHover={{ x: 5 }}
                >
                  <span className="text-gray-500 flex-shrink-0">›</span>
                  <p className="flex-1">was working as a <span className="font-semibold text-white">SWE </span> at <span className="inline-flex items-center gap-1.5 underline font-semibold text-white">
                    <Image 
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTaqx9Nk6GoCK9IISw9asCEs2YC8MitdLjAg&s" 
                      alt="Bolttech" 
                      width={16} 
                      height={16} 
                      className="inline-block"
                    />
                    <PreviewLink href="https://bolttech.io/">
                    Bolttech
                    </PreviewLink>
                  </span>. Generated $15000+ in annual savings by re-architecting legacy automation into a serverless AWS ETL
                  pipeline (Lambda/Step Functions) scaling to process 1M+ daily inventory records.</p>
                </motion.div>
                <motion.div 
                  className="flex items-baseline gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2, duration: 0.4 }}
                  whileHover={{ x: 5 }}
                >
                  <span className="text-gray-500 flex-shrink-0">›</span>
                  <p className="flex-1">was working as a <span className="font-semibold text-white">SWE </span> at <span className="inline-flex items-center gap-1.5 underline font-semibold text-white">
                    <Image 
                      src="https://media.licdn.com/dms/image/v2/C560BAQE7J1kH3K6Axg/company-logo_200_200/company-logo_200_200/0/1663666337869/sensoft_technologies_logo?e=2147483647&v=beta&t=MHNWv81ezIhKijgNalYp3yrMd-_Rv_fBno1FCqg0_04" 
                      alt="Sensoft Technologies" 
                      width={16} 
                      height={16} 
                      className="inline-block"
                    />
                    <PreviewLink href="https://sensoft.tech/">
                    Sensoft Technologies
                    </PreviewLink>
                  </span>, building a monitoring system for <span className="font-semibold text-white">50+ IoT sensors</span> across multiple sites</p>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              className="space-y-6 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.5 }}
            >
              <h2 className="text-xl font-heading font-bold text-white text-left">On nights and weekends...</h2>
              
              <div className="space-y-3 text-gray-300">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-gray-500 flex-shrink-0">›</span>
                    <div className="flex-1">
                      <p>am working on <span className="inline-flex items-baseline gap-1.5 font-semibold text-white">
                        <Image 
                          src="/MT logo.jpeg" 
                          alt="MentorTrader" 
                          width={16} 
                          height={16} 
                          className="inline-block align-text-bottom"
                        />
                        <PreviewLink href="https://www.mentor-trader.com/">MentorTrader</PreviewLink>
                      </span> -- a marketplace platform for <span className="font-semibold text-white">retail traders</span> to find <span className="font-semibold text-white">credible verified mentors</span></p>
                              
                      <div className="mt-4 ml-4">
                        <video
                          src={process.env.NEXT_PUBLIC_LAUNCH_VIDEO_URL}
                          controls
                          preload="metadata"
                          className="w-full rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="space-y-6 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.5 }}
            >
              <h2 className="text-xl font-heading font-bold text-white text-left">A few projects that I&apos;ve worked on...</h2>
              
              <div className="space-y-3 text-gray-300">
                <motion.div 
                  className="flex items-baseline gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.7, duration: 0.4 }}
                  whileHover={{ x: 5 }}
                >
                  <span className="text-gray-500 flex-shrink-0">›</span>
                  <p className="flex-1"><span className="underline font-semibold"><PreviewLink href="https://www.blockmark.ca/">Blockmark</PreviewLink></span> - Permanently record and verify messages and files on the Bitcoin blockchain. </p>
                </motion.div>
                <motion.div 
                  className="flex items-baseline gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.8, duration: 0.4 }}
                  whileHover={{ x: 5 }}
                >
                  <span className="text-gray-500 flex-shrink-0">›</span>
                  <p className="flex-1"><span className="underline font-semibold"><PreviewLink href="https://www.fleetcraft.com/">Fleetcraft</PreviewLink></span> – AI built for aircraft maintenance.</p>
                </motion.div>
                <motion.div 
                  className="flex items-baseline gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.9, duration: 0.4 }}
                  whileHover={{ x: 5 }}
                >
                  <span className="text-gray-500 flex-shrink-0">›</span>
                  <p className="flex-1"><span className="underline font-semibold"><PreviewLink href="https://realestateaigents.ca/">reAIgents</PreviewLink></span> – Make Better Real Estate Decisions (Ontario).</p>
                </motion.div>
              </div>
            </motion.div>

   
          </motion.div>

          {/* Right Side - Chat Interface */}
          <motion.div 
            className="lg:sticky lg:top-24"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <ChatInterface />
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <motion.footer 
        className="mt-20 text-center text-sm text-gray-500 pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.5 }}
      >
        <p>© Please reach out to me on X, I love yapping with anyone about anything.</p>
      </motion.footer>
    </div>
  );
}
