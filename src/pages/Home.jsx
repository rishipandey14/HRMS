import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FolderKanban,
  LayoutGrid,
  MessageSquareMore,
  ShieldCheck,
  Sparkles,
  Users2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const featureCards = [
  {
    title: "Project delivery",
    description: "Plan work, assign ownership, and keep every project visible from kickoff to completion.",
    icon: FolderKanban,
  },
  {
    title: "Live collaboration",
    description: "Move from update threads to real-time chat without leaving the workspace.",
    icon: MessageSquareMore,
  },
  {
    title: "Calendar-first planning",
    description: "Track deadlines, schedules, and attendance in one clean operational view.",
    icon: CalendarDays,
  },
  {
    title: "People operations",
    description: "Handle leave requests, regularization, team records, and role-based access.",
    icon: Users2,
  },
  {
    title: "Hiring and jobs",
    description: "Publish openings, manage job details, and keep recruitment activity organized.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Actionable insights",
    description: "Use dashboard charts and status summaries to spot what needs attention first.",
    icon: BarChart3,
  },
];

const capabilityRows = [
  { label: "9 core workspaces", detail: "Dashboard, projects, calendar, chat, team, jobs, leave, regularization, settings" },
  { label: "RBAC protected", detail: "Sensitive actions are gated by permissions and role-aware routes" },
  { label: "Designed for operations", detail: "Built to keep approvals, coordination, and tracking in the same flow" },
];

const stackItems = ["React", "Vite", "TailwindCSS", "Framer Motion", "Socket.IO", "FullCalendar", "Recharts"];

const footerLinks = [
  {
    label: "GitHub",
    href: "https://github.com/rishipandey14/HRMS",
    external: true,
  },
  {
    label: "Docs",
    href: "https://github.com/rishipandey14/HRMS#readme",
    external: true,
  },
  {
    label: "Support",
    href: "/contact",
    external: false,
  },
];

function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="relative min-h-screen overflow-hidden text-slate-100"
      style={{
        backgroundImage:
          "radial-gradient(circle at top left, rgba(34, 211, 238, 0.22), transparent 28%), radial-gradient(circle at top right, rgba(59, 130, 246, 0.2), transparent 26%), linear-gradient(180deg, #07111f 0%, #040814 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage: "url('/imagelogo.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          mixBlendMode: "soft-light",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(7,17,31,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(7,17,31,0.35)_1px,transparent_1px)] bg-[size:44px_44px] opacity-20" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 lg:px-10">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 shadow-lg shadow-cyan-500/10 backdrop-blur">
              <Sparkles className="h-5 w-5 text-cyan-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.42em] text-cyan-200/70">WorkSphere</p>
              <p className="text-sm text-slate-300">HRMS command center for teams, projects, and approvals</p>
            </div>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href="#features"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
            >
              Explore features
            </a>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300"
            >
              Sign in
            </button>
          </div>
        </header>

        <main className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:py-14">
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100 backdrop-blur">
              <ShieldCheck className="h-4 w-4" />
              Secure, role-aware work management for modern teams
            </div>

            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              One workspace for people, projects, and progress.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              WorkSphere brings dashboards, task delivery, collaboration, leave workflows, scheduling,
              and hiring into a single polished interface so teams can move faster without losing control.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
              >
                Enter WorkSphere
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10"
              >
                View platform highlights
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { value: "9", label: "Core modules" },
                { value: "RBAC", label: "Access control" },
                { value: "Live", label: "Team updates" },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <div className="text-2xl font-semibold text-white">{item.value}</div>
                  <div className="mt-1 text-sm text-slate-300">{item.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-cyan-300" />
              Built for project teams, HR operations, and leadership visibility
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute -left-6 top-12 h-24 w-24 rounded-full bg-cyan-400/20 blur-2xl" />
            <div className="absolute -right-4 bottom-10 h-28 w-28 rounded-full bg-blue-500/20 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/45 p-4 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-5">
              <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-900/70">
                <div
                  className="min-h-[520px] bg-cover bg-center p-5 sm:p-6"
                  style={{ backgroundImage: "url('/imagelogo.jpg')" }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/70">Live workspace</p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">Everything in motion, all at once.</h2>
                    </div>
                    <div className="rounded-full border border-white/15 bg-black/20 px-3 py-1 text-xs text-white/80 backdrop-blur">
                      WorkSphere OS
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {[
                      { title: "Project visibility", detail: "Track progress, ownership, and updates from one board.", icon: LayoutGrid },
                      { title: "People operations", detail: "Leave, regularization, and approvals stay easy to review.", icon: Users2 },
                      { title: "Scheduling", detail: "Deadlines and calendars keep delivery time-aware.", icon: Clock3 },
                      { title: "Insight layer", detail: "Dashboards surface what is blocked, pending, or complete.", icon: BarChart3 },
                    ].map((card) => (
                      <div key={card.title} className="rounded-2xl border border-white/10 bg-slate-950/55 p-4 text-white shadow-lg shadow-black/10 backdrop-blur">
                        <card.icon className="h-5 w-5 text-cyan-300" />
                        <h3 className="mt-3 text-base font-semibold">{card.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-300">{card.detail}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/70">Workflow focus</p>
                        <p className="mt-1 text-lg font-medium text-white">Approvals, coordination, and delivery</p>
                      </div>
                      <div className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-medium text-cyan-100">
                        Ready for teams
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {stackItems.map((item) => (
                        <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </main>

        <section id="features" className="grid gap-5 pb-8 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map((card, index) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/10 backdrop-blur"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                <card.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{card.description}</p>
            </motion.article>
          ))}
        </section>

        <section className="grid gap-6 pb-12 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/55 p-6 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-8">
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/70">What WorkSphere centralizes</p>
            <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">A single system for the work that usually gets scattered.</h2>

            <div className="mt-6 space-y-4">
              {capabilityRows.map((row) => (
                <div key={row.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-base font-semibold text-white">{row.label}</div>
                  <div className="mt-1 text-sm leading-6 text-slate-300">{row.detail}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 shadow-2xl shadow-cyan-950/10 backdrop-blur-xl sm:p-8">
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/70">Built on a modern stack</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Fast enough for daily use, flexible enough for scale.</h2>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
              {stackItems.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-slate-200">
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm leading-6 text-cyan-50">
              WorkSphere is positioned as a polished HRMS and task-management front door: it introduces the product,
              frames the value, and gives users a clear path into the authenticated experience.
            </div>
          </div>
        </section>

        <footer className="flex flex-col gap-4 border-t border-white/10 py-5 text-sm text-slate-400 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <div className="text-base font-semibold text-white">WorkSphere</div>
            <p className="max-w-xl leading-6 text-slate-400">
              Built for project delivery, team coordination, and HR operations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;