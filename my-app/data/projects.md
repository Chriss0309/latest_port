# Projects

## MentorTrader
**Technologies:** Next.js, TypeScript, PostgreSQL, Stripe, Supabase, Docker, AWS, Sentry
**Type:** Full-Stack Two-Sided Marketplace Platform

### Description
A two-sided marketplace connecting **retail investors** with **vetted trading mentors**. Built to solve the problem of finding trustworthy trading education and mentorship in the financial markets space.

### Key Features
- **Marketplace Platform:** Created a platform connecting retail investors with vetted mentors
- **AI Mentor-Matching Wizard:** Matches investors to mentors using **OpenAI embeddings**, **PostgreSQL vector search**, and **Claude reranking**, with **budget-aware recommendations** and direct handoff into mentor messaging
- **Student Management Dashboards:** Featuring comprehensive dashboards for tracking progress and interactions
- **Fintech Partnerships:** Established partnerships with companies like **Darwinex** and **Whop**
- **Payment Integration:** Secure payment processing through Stripe
- **Monitoring:** Real-time error tracking and performance monitoring with Sentry

### Technical Highlights
- Implemented using **Next.js** and **TypeScript** with **Supabase** backend for secure authentication and database
- **OpenAI embeddings + PostgreSQL vector search** for semantic mentor matching, with **Claude** as a reranking layer
- **Redis caching** for improved performance
- **PostgreSQL database** for reliable data storage
- **Docker** for containerized development and deployment
- **AWS** for media and document storage
- **Stripe payment integration** for secure transactions
- **Sentry monitoring** for production reliability

### Impact
- Onboarded **120+ active mentors**
- Reached **20,000+ monthly visitors**
- Created sustainable revenue model through platform fees
- Built strong fintech partnerships with **Darwinex** and **Whop**

---

## Digital Wealth Management
**Technologies:** Next.js, TypeScript, tRPC, Prisma, PostgreSQL
**Type:** Regulated Bitcoin Custody & Lending Platform

### Description
An **Ontario Securities Commission (OSC) approved** Bitcoin custody and **BTC-backed lending** platform. Provides a regulated path for clients to hold Bitcoin and borrow against it.

### Key Features
- **Secure Onboarding:** Identity verification and account setup flows built for a regulated environment
- **Deposits & Withdrawals:** Bitcoin custody with deposit and withdrawal workflows
- **BTC-Backed Lending:** Loans collateralized by clients' Bitcoin holdings
- **Compliance Workflows:** Built-in processes to meet OSC regulatory requirements

### Technical Highlights
- **Next.js** and **TypeScript** frontend with end-to-end type safety via **tRPC**
- **Prisma** ORM over **PostgreSQL** for custody, lending, and compliance data

### Impact
- Achieved **OSC approval** for a Bitcoin custody and lending product
- Delivered the full onboarding → custody → lending → compliance lifecycle

---

## Faves
**Technologies:** Express.js, Firebase, TailwindCSS, Google Cloud, OpenAI
**Type:** AI-Powered Recommendation Curation Platform

### Description
A platform that **curates AI-verified recommendations from influential figures**. The platform enables users to discover trusted recommendations with detailed context and citations, while allowing community contributions through a managed workflow where public submissions trigger **LLM-based citation generation** followed by rigorous admin moderation.

### Key Features
- **Recommendation Browsing:** Browse **1,000+ AI-verified recommendations** with detailed citations
- **Public Submissions:** Community can submit recommendations
- **LLM Citation Pipeline:** Automated content pipeline using LLMs to generate citations from public submissions
- **Admin Approval Workflow:** Managed approval system for quality control
- **Responsive Design:** Tailwind CSS frontend for all devices

### Technical Highlights
- Built with **Node.js** and **Firebase**
- **OpenAI API** for LLM-based citation generation
- **Joi validation** for data integrity
- **reCAPTCHA security** to prevent spam and abuse
- Implemented **rate-limiting** for public endpoints
- Deployed on **Google Cloud Functions** for serverless scalability

### Impact
- Curated **1,000+ AI-verified recommendations** from influential figures
- Enabled community-driven content with automated LLM-powered citation workflow
- Quality-controlled admin moderation pipeline

---

## Technical Showcase
These projects demonstrate proficiency in:
- **Full-Stack Development:** Next.js, TypeScript, tRPC, Prisma, Node.js, Express.js
- **Cloud Services:** AWS, Google Cloud, Firebase
- **Databases:** PostgreSQL (including vector search), Redis, Firebase
- **AI/LLM Integration:** OpenAI embeddings, Claude reranking, OpenAI API for automated pipelines
- **Fintech & Compliance:** OSC-approved Bitcoin custody and lending, Stripe payments
- **Security:** reCAPTCHA, rate-limiting, Supabase Auth
- **DevOps:** Docker, serverless deployment on Vercel and Google Cloud
- **Monitoring:** Sentry for production systems
