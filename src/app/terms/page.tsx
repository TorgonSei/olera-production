import React from "react";
import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing your use of the Olera platform.",
};

const LAST_UPDATED = "May 2025";

export default function TermsPage() {
  return (
    <>
      <Nav />

      <main>
        <section className="bg-cream py-20 sm:py-28 border-b border-mist">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-display font-bold text-5xl sm:text-6xl leading-[1.05] tracking-tight text-char mb-4">
              Terms of Service
            </h1>
            <p className="text-sm font-mono text-moss/50">
              Last updated: {LAST_UPDATED}
            </p>
          </div>
        </section>

        <section className="py-16 bg-cream">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-neutral max-w-none space-y-10 text-moss leading-relaxed">

              <div>
                <h2 className="font-display font-semibold text-2xl text-char mb-3">Overview</h2>
                <p>
                  Olera operates a talent placement platform connecting customer operations
                  professionals in Kenya with global employers. These terms govern your use
                  of the platform whether you are a candidate applying for roles or an
                  employer submitting a role brief.
                </p>
              </div>

              <div>
                <h2 className="font-display font-semibold text-2xl text-char mb-3">For candidates</h2>
                <p className="mb-3">
                  The platform is free to use. Olera does not charge candidates at any
                  point — not to apply, not to be assessed, not to be placed.
                </p>
                <p className="mb-3">
                  By submitting your profile and assessment, you give Olera permission to
                  share your information with employers when we believe there is a relevant
                  role match. We will not share your profile without a genuine reason to
                  do so.
                </p>
                <p>
                  You are responsible for the accuracy of the information you provide. If
                  information in your profile is materially inaccurate, Olera reserves the
                  right to remove your profile from the platform.
                </p>
              </div>

              <div>
                <h2 className="font-display font-semibold text-2xl text-char mb-3">For employers</h2>
                <p className="mb-3">
                  Reviewing a shortlist and interviewing candidates is free. Olera charges
                  a one-time flat placement fee only when an employer makes an offer that
                  is accepted by a candidate.
                </p>
                <p className="mb-3">
                  The placement fee is non-refundable after 30 days from the hire start
                  date. Olera provides a 60-day replacement guarantee: if a placed
                  candidate leaves or is released for performance-related reasons within
                  60 days of the agreed start date, Olera will run one replacement search
                  at no additional placement fee.
                </p>
                <p>
                  The employment or contractor relationship is between the employer and the
                  candidate. Olera is not an employer of record and does not manage
                  payroll, tax, or compliance obligations on behalf of either party.
                </p>
              </div>

              <div>
                <h2 className="font-display font-semibold text-2xl text-char mb-3">Prohibited conduct</h2>
                <p>
                  You may not use the Olera platform to post roles or source candidates
                  for purposes unrelated to genuine employment or contracting. You may not
                  share platform content — including candidate profiles or shortlists —
                  with third parties without Olera&apos;s written consent.
                </p>
              </div>

              <div>
                <h2 className="font-display font-semibold text-2xl text-char mb-3">Limitation of liability</h2>
                <p>
                  Olera provides a matching and assessment service. We do not guarantee
                  employment outcomes, candidate performance, or the fitness of any
                  candidate for a specific role. The platform is provided as-is. To the
                  extent permitted by law, Olera&apos;s liability is limited to the amount
                  paid in placement fees for the relevant hire.
                </p>
              </div>

              <div>
                <h2 className="font-display font-semibold text-2xl text-char mb-3">Governing law</h2>
                <p>
                  These terms are governed by the laws of Kenya. Any disputes will be
                  resolved under Kenyan jurisdiction.
                </p>
              </div>

              <div>
                <h2 className="font-display font-semibold text-2xl text-char mb-3">Changes to these terms</h2>
                <p>
                  Olera may update these terms as the platform develops. We will notify
                  active users of material changes by email or by updating the date above.
                </p>
              </div>

              <div>
                <h2 className="font-display font-semibold text-2xl text-char mb-3">Contact</h2>
                <p>
                  For any questions about these terms:{" "}
                  <a href="mailto:hello@olera.co" className="text-amber hover:text-amber/80 transition-colors">
                    hello@olera.co
                  </a>
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
