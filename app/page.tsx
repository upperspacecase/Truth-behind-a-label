import Link from "next/link";
import { Header } from "@/components/Header";
import { Dropzone } from "@/components/Dropzone";
import { HeroIllustration } from "@/components/HeroIllustration";

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-ink/80">
      <path d="M12 2 4 5v6c0 5 3.4 9.5 8 11 4.6-1.5 8-6 8-11V5l-8-3Zm-1 14-4-4 1.4-1.4L11 13.2l4.6-4.6L17 10l-6 6Z" />
    </svg>
  );
}

function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function FeatureBlock({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F4D8C5]">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-ink/70">{body}</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />

      <section className="mx-auto max-w-page px-6 pt-12 pb-10 md:pt-16">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <div className="order-2 md:order-1">
            <h1 className="text-[44px] font-extrabold leading-[1.05] tracking-tight md:text-[60px]">
              See what the packet would say if it had to{" "}
              <span className="text-truthred">tell the truth.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">
              Upload a photo of any snack, drink, or &ldquo;healthy&rdquo; product. We&rsquo;ll
              decode the packaging, spot the persuasion tricks, and rewrite the front label in{" "}
              <span className="font-semibold text-ink">plain English.</span>
            </p>

            <div className="mt-8 flex flex-col items-start gap-4">
              <Link href="#upload" className="btn-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5" />
                  <path d="m5 12 7-7 7 7" />
                </svg>
                Upload a packet
                <ArrowRight className="ml-2" />
              </Link>
              <div className="flex items-center gap-2 text-sm text-ink/60">
                <ShieldIcon /> 100% private. Images are not stored.
              </div>
            </div>
          </div>

          <div className="relative order-1 md:order-2">
            <HeroIllustration />
          </div>
        </div>

        <div className="mt-10">
          <Dropzone variant="compact" />
        </div>
      </section>

      <section id="how" className="bg-[#F4E7D8]/70">
        <div className="mx-auto grid max-w-page gap-10 px-6 py-14 md:grid-cols-3">
          <FeatureBlock
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.5" y2="16.5" />
              </svg>
            }
            title="Decode the costume"
            body="We analyze colors, claims, mascots, and marketing tricks that shape what you think."
          />
          <FeatureBlock
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
              </svg>
            }
            title="Rewrite the front label"
            body="We create an honest version of the packet that tells you what it really is, in plain English."
          />
          <FeatureBlock
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="6" y1="20" x2="6" y2="12" />
                <line x1="12" y1="20" x2="12" y2="6" />
                <line x1="18" y1="20" x2="18" y2="14" />
              </svg>
            }
            title="Compare products"
            body="See patterns across your pantry. Candy is obvious. &ldquo;Healthy&rdquo; snacks are where it gets interesting."
          />
        </div>
      </section>

      <footer id="about" className="border-t border-black/5">
        <div className="mx-auto flex max-w-page flex-col items-start justify-between gap-2 px-6 py-8 text-sm text-ink/50 md:flex-row md:items-center">
          <div>truth label. — a front-of-pack reality check.</div>
          <div>No moral lecture. No diet culture.</div>
        </div>
      </footer>
    </main>
  );
}
