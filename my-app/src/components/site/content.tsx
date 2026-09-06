"use client";

import Image from "next/image";
import { motion, type Variants } from "motion/react";
import { GithubGraph } from "@/components/site/github-graph";
import { LaunchVideo } from "@/components/site/launch-video";
import { PreviewLink } from "@/components/site/preview-link";

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

function Logo({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={16}
      height={16}
      className="mr-1.5 inline-block size-4 object-contain align-text-bottom"
    />
  );
}

const launchVideo = process.env.NEXT_PUBLIC_LAUNCH_VIDEO_URL;

const now = [
  <>
    studying Computer Science at{" "}
    <Logo
      src="https://storage-prtl-co.imgix.net/endor/organisations/14118/logos/1703088516_studyportals-logo.png"
      alt="Wilfrid Laurier University logo"
    />
    Wilfrid Laurier University (grad Oct 2026, GPA 3.85)
  </>,
  <>
    working at <PreviewLink href="https://hecaton.co/">Hecaton</PreviewLink> to ship digital products for
    startups (<PreviewLink href="https://1bitcoin.ca/">1Bitcoin.ca</PreviewLink>,{" "}
    <PreviewLink href="https://www.fleetcraft.com/">Fleetcraft</PreviewLink>,{" "}
    <PreviewLink href="https://realestateaigents.ca/">reAIgents</PreviewLink>)
  </>,
  <>
    building <Logo src="/MT logo.jpeg" alt="MentorTrader logo" />
    <PreviewLink href="https://www.mentor-trader.com/">MentorTrader</PreviewLink> on nights and
    weekends, a marketplace for retail traders to find credible verified mentors
    {launchVideo && (
      <>
        {" "}
        (<LaunchVideo src={launchVideo} />)
      </>
    )}
  </>,
];

const worked = [
  <>
    was a SWE intern on the Enterprise Architecture team at{" "}
    <PreviewLink href="https://www.manulife.ca/">Manulife</PreviewLink>, building an AI pipeline
    on Azure that turns natural language into enterprise architecture diagrams
  </>,
  <>
    was a Data Engineer intern at{" "}
    <Logo
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTaqx9Nk6GoCK9IISw9asCEs2YC8MitdLjAg&s"
      alt="Bolttech logo"
    />
    <PreviewLink href="https://bolttech.io/">Bolttech</PreviewLink>, re-architecting legacy
    automation into a serverless AWS ETL pipeline that processes 1M+ daily inventory records and
    saves $15,000+ a year
  </>,
  <>
    was a SWE intern at{" "}
    <Logo
      src="https://media.licdn.com/dms/image/v2/C560BAQE7J1kH3K6Axg/company-logo_200_200/company-logo_200_200/0/1663666337869/sensoft_technologies_logo?e=2147483647&v=beta&t=MHNWv81ezIhKijgNalYp3yrMd-_Rv_fBno1FCqg0_04"
      alt="Sensoft Technologies logo"
    />
    <PreviewLink href="https://sensoft.tech/">Sensoft Technologies</PreviewLink>, building a
    real-time monitoring dashboard for 15,000+ Modbus sensors
  </>,
];

const projects = [
  <>
    <PreviewLink href="https://www.blockmark.ca/">Blockmark</PreviewLink>, permanently record and
    verify messages and files on the Bitcoin blockchain
  </>,
  <>
    <PreviewLink href="https://www.fleetcraft.com/">Fleetcraft</PreviewLink>, AI built for aircraft
    maintenance
  </>,
  <>
    <PreviewLink href="https://realestateaigents.ca/">reAIgents</PreviewLink>, make better real
    estate decisions in Ontario
  </>,
];

function Section({ title, lines }: { title: string; lines: React.ReactNode[] }) {
  return (
    <motion.section variants={rise}>
      <h2 className="font-display text-[22px] tracking-[-0.03em] md:text-2xl">{title}</h2>
      <ul className="mt-2 space-y-1.5">
        {lines.map((line, i) => (
          <li key={i} className="flex gap-2.5 text-sm leading-normal text-foreground/80">
            <span className="font-mono text-neutral-400">›</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </motion.section>
  );
}

export function Content() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="min-h-0 space-y-5 lg:overflow-y-auto">
      <motion.div variants={rise}>
        <h1 className="font-display text-[clamp(2rem,3.5vw,3rem)] leading-[1.05] tracking-[-0.04em]">
          Hey, I&apos;m Chris{" "}
          <Image
            src="/flag-my.svg"
            alt="Malaysia flag"
            width={28}
            height={14}
            className="inline-block h-[0.6em] w-auto align-baseline"
          />
          .
        </h1>
        <div className="mt-2.5 max-w-[50ch] text-[15px] leading-normal text-foreground/55">
          <p>I&apos;m based in Toronto and Waterloo.</p>
        </div>
      </motion.div>
      <Section title="What am I doing currently..." lines={now} />
      <Section title="I ..." lines={worked} />
      <Section title="A few projects that I've worked on..." lines={projects} />
      <motion.section
        variants={rise}
        data-github
        className="lg:hidden lg:[@media(min-height:800px)]:block"
      >
        <GithubGraph />
      </motion.section>
    </motion.div>
  );
}
