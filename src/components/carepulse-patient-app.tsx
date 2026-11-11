import { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  AudioLines,
  BadgeCheck,
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  FileHeart,
  HeartPulse,
  House,
  LockKeyhole,
  MapPin,
  Menu,
  MessageCircleHeart,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  X,
} from "lucide-react";

import consultationPhoto from "@/assets/carepulse-consultation.jpg";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type View = "home" | "doctors" | "appointments" | "assistant" | "notifications" | "account";
type AccountView = "login" | "register" | "forgot";

const doctors = [
  { name: "Dr. Amara Okafor", specialty: "Family medicine", initials: "AO", tone: "bg-care-panel text-care-deep", availability: "Today, 11:30 AM" },
  { name: "Dr. Daniel Adeyemi", specialty: "Cardiology", initials: "DA", tone: "bg-secondary text-primary", availability: "Today, 2:00 PM" },
  { name: "Dr. Zainab Bello", specialty: "Paediatrics", initials: "ZB", tone: "bg-muted text-muted-foreground", availability: "Tomorrow, 9:00 AM" },
];

const navigation: { id: View; label: string; icon: typeof House }[] = [
  { id: "home", label: "Overview", icon: House },
  { id: "doctors", label: "Find a doctor", icon: Stethoscope },
  { id: "appointments", label: "Appointments", icon: CalendarDays },
  { id: "assistant", label: "Care assistant", icon: MessageCircleHeart },
  { id: "notifications", label: "Notifications", icon: Bell },
];

const heading: Record<Exclude<View, "account">, { title: string; eyebrow: string }> = {
  home: { title: "Your care, at a glance.", eyebrow: "PATIENT HOME" },
  doctors: { title: "Meet your care team.", eyebrow: "DOCTOR DIRECTORY" },
  appointments: { title: "Your visits, all in one place.", eyebrow: "APPOINTMENTS" },
  assistant: { title: "A little more support.", eyebrow: "CARE ASSISTANT" },
  notifications: { title: "The latest from your clinic.", eyebrow: "NOTIFICATIONS" },
};

function SectionTitle({ title, detail, action }: { title: string; detail?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-lg font-semibold tracking-tight text-care-ink">{title}</h2>
        {detail && <p className="mt-1 text-sm text-muted-foreground">{detail}</p>}
      </div>
      {action}
    </div>
  );
}

function SampleLabel() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-care-line bg-background px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">
      <span className="size-1.5 rounded-full bg-care-amber" /> SAMPLE PREVIEW
    </span>
  );
}

function DoctorRow({ doctor, onBook }: { doctor: (typeof doctors)[number]; onBook: () => void }) {
  return (
    <div className="flex items-center gap-3 border-b border-care-line/70 py-3 last:border-b-0 last:pb-0">
      <Avatar className={`size-11 rounded-md ${doctor.tone}`}>
        <AvatarFallback className={`${doctor.tone} rounded-md text-xs font-semibold`}>{doctor.initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-care-ink">{doctor.name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{doctor.specialty}</p>
      </div>
      <Button onClick={onBook} variant="outline" size="sm" className="shrink-0 px-2.5 text-xs">
        View times
      </Button>
    </div>
  );
}

export function CarePulsePatientApp() {
  const [activeView, setActiveView] = useState<View>("home");
  const [accountView, setAccountView] = useState<AccountView>("login");
  const [searchTerm, setSearchTerm] = useState("");
  const [bannerOpen, setBannerOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [chosenDoctor, setChosenDoctor] = useState<string | null>(null);
  const [appointmentTab, setAppointmentTab] = useState<"upcoming" | "past">("upcoming");
  const filteredDoctors = useMemo(
    () => doctors.filter((doctor) => `${doctor.name} ${doctor.specialty}`.toLowerCase().includes(searchTerm.toLowerCase())),
    [searchTerm],
  );

  const go = (view: View) => {
    setActiveView(view);
    setMenuOpen(false);
    if (view === "home") setChosenDoctor(null);
  };

  const bookDemo = () => {
    setActiveView("doctors");
    setChosenDoctor(doctors[0].name);
  };

  const current = activeView === "account" ? null : heading[activeView];

  return (
    <div className="min-h-screen bg-care-paper text-care-ink">
      {bannerOpen && (
        <div className="flex min-h-8 items-center justify-center gap-2 bg-care-deep px-10 py-1.5 text-center text-[11px] font-medium text-primary-foreground">
          <span className="size-1.5 shrink-0 rounded-full bg-care-amber" />
          Sample preview · Sign-in and clinic records aren’t connected yet
          <Button variant="ghost" size="icon" aria-label="Dismiss preview notice" onClick={() => setBannerOpen(false)} className="absolute right-2 h-6 w-6 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
            <X className="size-3" />
          </Button>
        </div>
      )}

      <div className="mx-auto flex min-h-[calc(100vh-32px)] max-w-[1440px]">
        <aside className="sticky top-0 hidden h-screen w-[232px] shrink-0 flex-col border-r border-care-line/80 bg-background px-5 py-6 lg:flex">
          <button className="flex items-center gap-2.5 text-left" onClick={() => go("home")} aria-label="CarePulse overview">
            <span className="grid size-9 place-items-center rounded-md bg-care-deep text-primary-foreground"><HeartPulse className="size-5" /></span>
            <span className="font-display text-[20px] font-bold tracking-tight text-care-deep">carepulse<span className="text-care-teal">.</span></span>
          </button>
          <p className="mb-3 mt-10 px-2 text-[10px] font-semibold text-muted-foreground">YOUR SPACE</p>
          <nav aria-label="Main navigation" className="space-y-1">
            {navigation.map(({ id, label, icon: Icon }) => (
              <Button key={id} variant="ghost" onClick={() => go(id)} aria-current={activeView === id ? "page" : undefined}
                className={`w-full justify-start gap-3 rounded-md px-3 text-sm font-medium ${activeView === id ? "bg-care-mist text-care-deep hover:bg-care-mist" : "text-muted-foreground"}`}>
                <Icon className="size-[17px]" />{label}
                {id === "notifications" && <span className="ml-auto size-2 rounded-full bg-care-teal" />}
              </Button>
            ))}
          </nav>
          <div className="mt-auto border-t border-care-line pt-4">
            <Button variant="ghost" onClick={() => go("account")} className="h-auto w-full justify-start gap-3 rounded-md px-2 py-2 text-left">
              <Avatar className="size-9 rounded-md bg-care-panel"><AvatarFallback className="rounded-md bg-care-panel text-xs font-semibold text-care-deep">PA</AvatarFallback></Avatar>
              <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-care-ink">Patient account</span><span className="block text-xs text-muted-foreground">Preview mode</span></span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-care-line/80 bg-background/95 px-4 backdrop-blur md:px-8 lg:px-10">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" aria-label="Open navigation" onClick={() => setMenuOpen((open) => !open)} className="lg:hidden"><Menu className="size-5" /></Button>
              <button onClick={() => go("home")} className="font-display text-[19px] font-bold tracking-tight text-care-deep lg:hidden">carepulse<span className="text-care-teal">.</span></button>
              <span className="hidden text-sm text-muted-foreground sm:block">Patient care</span>
            </div>
            <div className="flex items-center gap-2.5">
              <SampleLabel />
              <Button variant="ghost" size="icon" aria-label="View notifications" onClick={() => go("notifications")} className="relative"><Bell className="size-[18px]" /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-care-teal ring-2 ring-background" /></Button>
              <Button variant="ghost" onClick={() => go("account")} aria-label="Patient account" className="size-9 rounded-md p-0"><Avatar className="size-8 rounded-md bg-care-panel"><AvatarFallback className="rounded-md bg-care-panel text-xs font-semibold text-care-deep">PA</AvatarFallback></Avatar></Button>
            </div>
          </header>

          {menuOpen && <nav aria-label="Mobile navigation" className="absolute inset-x-0 z-30 space-y-1 border-b border-care-line bg-background p-3 shadow-md lg:hidden">{navigation.map(({ id, label, icon: Icon }) => <Button key={id} variant="ghost" onClick={() => go(id)} className="w-full justify-start gap-3"><Icon className="size-4" />{label}</Button>)}</nav>}

          <main className="mx-auto max-w-[1140px] px-4 pb-28 pt-7 sm:px-7 md:pb-12 md:pt-9 lg:px-10">
            {current && <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div><p className="text-[10px] font-semibold text-care-teal">{current.eyebrow}</p><h1 className="mt-1 font-display text-[27px] font-semibold leading-tight tracking-tight text-care-ink sm:text-[32px]">{current.title}</h1></div>
              <Badge variant="outline" className="gap-1.5 border-care-line bg-background text-[10px] font-medium text-muted-foreground"><span className="size-1.5 rounded-full bg-care-amber" /> DEMO DATA</Badge>
            </div>}

            {activeView === "home" && <div className="space-y-7">
              <section className="relative isolate min-h-[235px] overflow-hidden rounded-md bg-care-deep sm:min-h-[260px]" aria-label="Welcome to CarePulse">
                <img src={consultationPhoto} alt="Doctor having a calm conversation with a patient" width={1536} height={1024} className="absolute inset-0 -z-20 size-full object-cover object-[center_43%]" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-care-deep/95 via-care-deep/85 to-care-deep/10" />
                <div className="flex min-h-[235px] max-w-[570px] flex-col items-start justify-center px-5 py-6 sm:min-h-[260px] sm:px-8">
                  <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-2.5 py-1 text-[10px] font-medium text-primary-foreground"><Sparkles className="size-3" /> A little easier, every step</span>
                  <h2 className="max-w-[390px] font-display text-[25px] font-semibold leading-[1.1] text-primary-foreground sm:text-[30px]">Good care starts with feeling heard.</h2>
                  <p className="mt-2 max-w-[335px] text-sm leading-relaxed text-primary-foreground/80">Find a doctor, keep visits together, and take your next step at your own pace.</p>
                  <Button onClick={bookDemo} className="mt-5 gap-2 bg-primary-foreground text-care-deep hover:bg-primary-foreground/90">Find a doctor <ArrowRight className="size-4" /></Button>
                </div>
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-primary-foreground/30 bg-care-deep/60 px-2.5 py-1 text-[9px] font-medium text-primary-foreground"><span className="size-1.5 rounded-full bg-care-amber" /> SAMPLE APPOINTMENT</div>
              </section>

              <div className="grid gap-7 xl:grid-cols-[1.4fr_0.95fr]">
                <div className="space-y-7">
                  <section>
                    <SectionTitle title="Your upcoming visit" detail="A sample appointment for preview only." action={<Button variant="link" onClick={() => go("appointments")} className="h-8 gap-1 p-0 text-xs text-care-teal">All appointments <ArrowRight className="size-3.5" /></Button>} />
                    <article className="overflow-hidden rounded-md border border-care-line bg-background">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-care-line bg-care-panel/70 px-4 py-2.5">
                        <span className="flex items-center gap-2 text-xs font-semibold text-care-deep"><span className="size-2 rounded-full bg-care-amber" /> SAMPLE PREVIEW</span><span className="text-xs text-muted-foreground">Request not submitted</span>
                      </div>
                      <div className="grid gap-5 p-4 sm:grid-cols-[1fr_auto] sm:items-center sm:p-5">
                        <div className="flex items-start gap-3">
                          <div className="grid size-11 shrink-0 place-items-center rounded-md bg-care-mist text-care-teal"><CalendarDays className="size-[21px]" /></div>
                          <div><p className="text-sm font-semibold text-care-ink">Friday, November 13</p><p className="mt-1 text-xs text-muted-foreground">11:30 AM · Family medicine</p><p className="mt-2 text-xs text-care-ink">Dr. Amara Okafor</p></div>
                        </div>
                        <Button onClick={() => go("appointments")} variant="outline" size="sm" className="gap-2 sm:self-center">View appointment <ArrowRight className="size-3.5" /></Button>
                      </div>
                    </article>
                  </section>

                  <section>
                    <SectionTitle title="A doctor for you" detail="Example clinicians · schedules aren’t connected" action={<Button variant="link" onClick={() => go("doctors")} className="h-8 gap-1 p-0 text-xs text-care-teal">Meet the team <ArrowRight className="size-3.5" /></Button>} />
                    <div className="rounded-md border border-care-line bg-background px-4 py-1 sm:px-5">{doctors.slice(0, 2).map((doctor) => <DoctorRow key={doctor.name} doctor={doctor} onBook={bookDemo} />)}</div>
                  </section>
                </div>

                <div className="space-y-7">
                  <section>
                    <SectionTitle title="Find your next step" />
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => go("doctors")} className="group flex min-h-[119px] flex-col items-start justify-between rounded-md border border-care-line bg-background p-4 text-left transition-colors hover:bg-care-mist/50"><span className="grid size-9 place-items-center rounded-md bg-care-panel text-care-teal"><Stethoscope className="size-[18px]" /></span><span className="flex w-full items-center justify-between gap-1 text-sm font-semibold">Find a doctor <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" /></span></button>
                      <button onClick={() => go("appointments")} className="group flex min-h-[119px] flex-col items-start justify-between rounded-md border border-care-line bg-background p-4 text-left transition-colors hover:bg-care-mist/50"><span className="grid size-9 place-items-center rounded-md bg-secondary text-primary"><Plus className="size-[18px]" /></span><span className="flex w-full items-center justify-between gap-1 text-sm font-semibold">Book a visit <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" /></span></button>
                    </div>
                  </section>
                  <section>
                    <SectionTitle title="Care, with a little help" />
                    <button onClick={() => go("assistant")} className="group w-full overflow-hidden rounded-md border border-care-line bg-care-panel/70 p-4 text-left transition-colors hover:bg-care-panel sm:p-5">
                      <span className="mb-4 flex items-center justify-between"><span className="grid size-10 place-items-center rounded-md bg-background text-care-teal"><MessageCircleHeart className="size-[19px]" /></span><Badge variant="outline" className="border-care-line bg-background text-[9px] text-muted-foreground">NOT CONNECTED</Badge></span>
                      <span className="block text-sm font-semibold text-care-ink">Care assistant</span><span className="mt-1 block text-xs leading-relaxed text-muted-foreground">The screening guide will appear here after clinic safety rules are set.</span><span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-care-teal">More about this <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" /></span>
                    </button>
                  </section>
                  <section className="border-t border-care-line pt-5">
                    <div className="mb-3 flex items-center gap-2"><Clock3 className="size-4 text-care-teal" /><h2 className="text-sm font-semibold">Clinic hours</h2><Badge variant="outline" className="ml-auto border-care-line text-[9px] text-muted-foreground">SAMPLE</Badge></div>
                    <p className="text-xs text-muted-foreground">Monday – Friday <span className="float-right font-medium text-care-ink">8:00 AM – 5:00 PM</span></p>
                    <p className="mt-2 text-xs text-muted-foreground">Saturday <span className="float-right font-medium text-care-ink">9:00 AM – 1:00 PM</span></p>
                  </section>
                </div>
              </div>
            </div>}

            {activeView === "doctors" && <div className="space-y-5">
              <section className="flex flex-col justify-between gap-4 border-b border-care-line pb-5 sm:flex-row sm:items-end">
                <div><p className="text-sm text-muted-foreground">Meet example doctors from the CarePulse directory.</p><p className="mt-1 text-xs text-muted-foreground">Sample names and schedules · clinic records aren’t connected.</p></div>
                <label className="relative block w-full sm:max-w-[280px]"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Name or specialty" aria-label="Search doctors" className="pl-9" /></label>
              </section>
              {chosenDoctor && <div role="status" className="flex items-start justify-between gap-3 rounded-md border border-care-line bg-care-panel/60 p-4"><div className="flex gap-3"><div className="grid size-9 place-items-center rounded-md bg-background text-care-teal"><CalendarDays className="size-4" /></div><div><p className="text-sm font-semibold">Sample visit with {chosenDoctor}</p><p className="mt-1 text-xs text-muted-foreground">This preview doesn’t reserve a time or send a request.</p><div className="mt-3 flex flex-wrap gap-2">{["11:30 AM", "2:00 PM", "3:30 PM"].map((time) => <Badge key={time} variant="outline" className="border-care-line bg-background font-medium text-care-deep">{time}</Badge>)}</div></div></div><Button variant="ghost" size="icon" aria-label="Close sample visit times" onClick={() => setChosenDoctor(null)}><X className="size-4" /></Button></div>}
              <div className="divide-y divide-care-line rounded-md border border-care-line bg-background px-4 sm:px-5">{filteredDoctors.length ? filteredDoctors.map((doctor) => <article key={doctor.name} className="flex flex-wrap items-center gap-3 py-4 sm:gap-4"><Avatar className={`size-12 rounded-md ${doctor.tone}`}><AvatarFallback className={`${doctor.tone} rounded-md text-xs font-semibold`}>{doctor.initials}</AvatarFallback></Avatar><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{doctor.name}</p><p className="mt-0.5 text-xs text-muted-foreground">{doctor.specialty}</p><p className="mt-1.5 flex items-center gap-1 text-[11px] text-care-teal"><Clock3 className="size-3" /> Example availability: {doctor.availability}</p></div><Button onClick={() => setChosenDoctor(doctor.name)} variant="outline" size="sm" className="gap-1.5">View times <ArrowRight className="size-3.5" /></Button></article>) : <p className="py-8 text-center text-sm text-muted-foreground">No sample doctors match that search.</p>}</div>
            </div>}

            {activeView === "appointments" && <div className="space-y-5">
              <section className="flex flex-wrap items-center justify-between gap-3 border-b border-care-line pb-4"><p className="text-sm text-muted-foreground">Sample appointments · no booking information is stored.</p><div className="flex gap-1 rounded-md bg-muted p-1"><Button size="sm" variant={appointmentTab === "upcoming" ? "default" : "ghost"} onClick={() => setAppointmentTab("upcoming")} className="h-8 px-3 text-xs">Upcoming</Button><Button size="sm" variant={appointmentTab === "past" ? "default" : "ghost"} onClick={() => setAppointmentTab("past")} className="h-8 px-3 text-xs">Past visits</Button></div></section>
              {appointmentTab === "upcoming" ? <article className="max-w-2xl overflow-hidden rounded-md border border-care-line bg-background"><div className="flex items-center justify-between gap-2 border-b border-care-line bg-care-panel/60 px-4 py-3"><span className="flex items-center gap-2 text-xs font-semibold text-care-deep"><span className="size-2 rounded-full bg-care-amber" /> EXAMPLE REQUEST</span><Badge variant="outline" className="border-care-line bg-background text-[10px]">Not submitted</Badge></div><div className="p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-display text-xl font-semibold">Friday, November 13</p><p className="mt-1 text-sm text-muted-foreground">11:30 AM · Family medicine</p></div><span className="grid size-11 place-items-center rounded-md bg-care-mist text-care-teal"><CalendarDays className="size-5" /></span></div><div className="mt-5 space-y-3 border-t border-care-line pt-4 text-sm"><p className="flex items-center gap-2"><Stethoscope className="size-4 text-care-teal" />Dr. Amara Okafor</p><p className="flex items-center gap-2"><MapPin className="size-4 text-care-teal" />Clinic location · sample only</p></div><div className="mt-5 border-t border-care-line pt-4"><Button onClick={() => go("doctors")} variant="outline" size="sm" className="gap-2"><Plus className="size-3.5" /> Explore sample times</Button><p className="mt-3 text-[11px] text-muted-foreground">Appointment passes are unavailable until the clinic connection is configured.</p></div></div></article> : <div className="max-w-2xl rounded-md border border-care-line bg-background px-4 py-3"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-md bg-muted text-muted-foreground"><FileHeart className="size-[18px]" /></span><div><p className="text-sm font-semibold">Annual wellness visit</p><p className="mt-1 text-xs text-muted-foreground">Sample history · Tuesday, September 8</p></div><span className="ml-auto text-xs text-muted-foreground">Example only</span></div></div>}
            </div>}

            {activeView === "assistant" && <div className="max-w-2xl">
              <section className="overflow-hidden rounded-md border border-care-line bg-background">
                <div className="flex items-start gap-4 border-b border-care-line bg-care-panel/60 p-5 sm:p-7"><span className="grid size-11 shrink-0 place-items-center rounded-md bg-background text-care-teal"><MessageCircleHeart className="size-5" /></span><div><Badge variant="outline" className="mb-2 border-care-line bg-background text-[9px] text-muted-foreground">SCREENING NOT AVAILABLE</Badge><h2 className="font-display text-lg font-semibold">Your wellbeing deserves safe guidance.</h2><p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">The CarePulse screening and voice assistant are paused until the clinic’s approved safety guide is connected. This preview does not assess symptoms or provide medical advice.</p></div></div>
                <div className="space-y-4 p-5 sm:p-7"><div className="grid gap-3 sm:grid-cols-2"><div className="border-l-2 border-care-teal pl-3"><span className="flex items-center gap-2 text-sm font-medium"><ShieldCheck className="size-4 text-care-teal" /> Clinic-approved guidance</span><p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">Unavailable until safety rules are set.</p></div><div className="border-l-2 border-care-teal pl-3"><span className="flex items-center gap-2 text-sm font-medium"><AudioLines className="size-4 text-care-teal" /> Voice conversations</span><p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">Not enabled in this sample preview.</p></div></div><div className="rounded-md border border-care-line bg-muted/50 p-4"><p className="text-xs font-semibold">Need medical help now?</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Contact your clinic or local emergency service directly. This app cannot assess urgent symptoms.</p></div></div>
              </section>
            </div>}

            {activeView === "notifications" && <div className="max-w-2xl"><p className="mb-5 text-sm text-muted-foreground">Sample updates only · no messages from a live clinic.</p><div className="divide-y divide-care-line rounded-md border border-care-line bg-background px-4"><article className="flex gap-3 py-4"><span className="grid size-9 shrink-0 place-items-center rounded-md bg-care-panel text-care-teal"><CalendarDays className="size-4" /></span><div><p className="text-sm font-semibold">Your appointment is confirmed <Badge variant="outline" className="ml-1 border-care-line text-[9px] text-muted-foreground">SAMPLE</Badge></p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Sample update for Friday, November 13 at 11:30 AM.</p><p className="mt-2 text-[10px] text-muted-foreground">Example · 2 days ago</p></div></article><article className="flex gap-3 py-4"><span className="grid size-9 shrink-0 place-items-center rounded-md bg-secondary text-primary"><BadgeCheck className="size-4" /></span><div><p className="text-sm font-semibold">Welcome to CarePulse</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Explore the app in sample mode while the clinic connection is being prepared.</p><p className="mt-2 text-[10px] text-muted-foreground">Example · Last week</p></div></article></div></div>}

            {activeView === "account" && <AccountScreen accountView={accountView} onSetView={setAccountView} />}
          </main>

          <footer className="hidden border-t border-care-line px-8 py-4 text-center text-[10px] text-muted-foreground md:block">CarePulse · Sample preview · Not for clinical use</footer>
        </div>
      </div>

      <nav aria-label="Bottom navigation" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-care-line bg-background/95 px-1 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur md:hidden">
        {navigation.filter((item) => item.id !== "notifications").map(({ id, label, icon: Icon }) => <Button key={id} variant="ghost" onClick={() => go(id)} aria-current={activeView === id ? "page" : undefined} className={`flex h-[58px] flex-col gap-1 rounded-none px-0 text-[10px] ${activeView === id ? "text-care-teal" : "text-muted-foreground"}`}><Icon className="size-[18px]" /><span>{id === "appointments" ? "Visits" : id === "assistant" ? "Care" : id === "doctors" ? "Doctors" : "Home"}</span></Button>)}
        <Button variant="ghost" onClick={() => go("notifications")} aria-current={activeView === "notifications" ? "page" : undefined} className={`relative flex h-[58px] flex-col gap-1 rounded-none px-0 text-[10px] ${activeView === "notifications" ? "text-care-teal" : "text-muted-foreground"}`}><Bell className="size-[18px]" /><span>Inbox</span><span className="absolute right-[calc(50%-15px)] top-2 size-1.5 rounded-full bg-care-teal" /></Button>
      </nav>
    </div>
  );
}

function AccountScreen({ accountView, onSetView }: { accountView: AccountView; onSetView: (view: AccountView) => void }) {
  const titles: Record<AccountView, { title: string; detail: string }> = {
    login: { title: "Welcome back.", detail: "Sign in to your CarePulse patient account." },
    register: { title: "Your care starts here.", detail: "Create a patient profile to get started." },
    forgot: { title: "Reset your password.", detail: "We’ll help you securely get back into your account." },
  };
  const isRegister = accountView === "register";
  const isForgot = accountView === "forgot";
  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-7"><Badge variant="outline" className="mb-3 gap-1.5 border-care-line bg-background text-[10px] font-medium text-muted-foreground"><LockKeyhole className="size-3" /> CONNECTION REQUIRED</Badge><h2 className="font-display text-[26px] font-semibold tracking-tight">{titles[accountView].title}</h2><p className="mt-2 text-sm text-muted-foreground">{titles[accountView].detail}</p></div>
      <form onSubmit={(event) => event.preventDefault()} className="space-y-4">
        {isRegister && <label className="block text-xs font-medium">Full name<Input disabled placeholder="Your name" className="mt-1.5 bg-background" /></label>}
        <label className="block text-xs font-medium">Email address<Input disabled type="email" placeholder="you@example.com" className="mt-1.5 bg-background" /></label>
        {!isForgot && <label className="block text-xs font-medium">Password<Input disabled type="password" placeholder="Enter your password" className="mt-1.5 bg-background" /></label>}
        {!isForgot && <label className="block text-xs font-medium">{isRegister ? "A little about your preferences (optional)" : "Reason for your visit"}<Textarea disabled placeholder="Optional · saved only after the clinic connection is ready" className="mt-1.5 min-h-[82px] resize-none bg-background" /></label>}
        <div className="rounded-md border border-care-line bg-care-panel/60 p-3.5"><div className="flex gap-2.5"><LockKeyhole className="mt-0.5 size-4 shrink-0 text-care-teal" /><p className="text-xs leading-relaxed text-muted-foreground">This secure form will become available when the clinic’s existing account system is connected. Your details aren’t being collected in this preview.</p></div></div>
        <Button type="button" disabled className="w-full">{isRegister ? "Create patient account" : isForgot ? "Send reset link" : "Sign in"} <ArrowRight className="size-4" /></Button>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground">{!isForgot && <Button type="button" variant="link" onClick={() => onSetView(isRegister ? "login" : "register")} className="h-auto p-0 text-xs text-care-teal">{isRegister ? "Already registered? Sign in" : "Create an account"}</Button>}{!isRegister && <Button type="button" variant="link" onClick={() => onSetView(isForgot ? "login" : "forgot")} className="h-auto p-0 text-xs text-care-teal">{isForgot ? "Return to sign in" : "Forgot password?"}</Button>}</div>
      </form>
    </div>
  );
}