import React from "react";
import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Olera collects, uses, and protects your personal information.",
};

const LAST_UPDATED = "May 2025";

export default function PrivacyPage() {
  return (
    <>
      <Nav />

      <main>
        <section className="bg-cream py-20 sm:py-28 border-b border-mist">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-display font-bold text-5xl sm:text-6xl leading-[1.05] tracking-tight text-char mb-4">
              Privacy Policy
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
                <h2 className="font-display font-semibold text-2xl text-char mb-3">Who we are</h2>
                <p>
                  Olera is a talent placement platform based in Nairobi, Kenya. We match
                  customer operations professionals with global employers. For questions
                  about this policy, contact us at{" "}
                  <a href="mailto:hello@olera.co" className="text-amber hover:text-amber/80 transition-colors">
                    hello@olera.co
                  </a>
                  .
                </p>
              </div>

              <div>
                <h2 className="font-display font-semibold text-2xl text-char mb-3">Information we collect</h2>
                <p className="mb-3">
                  <strong className="text-char font-semibold">Candidates.</strong> When you apply, we collect the information
                  you provide: your CV, contact details, work history, skills, and your
                  responses to assessment questions. We also collect your availability,
                  tool familiarity, and salary expectations as you fill out your profile.
                </p>
                <p>
                  <strong className="text-char font-semibold">Employers.</strong> When you submit a role brief, we collect the
                  information you provide about your company and the role. If you contact
                  us by email, we retain those communications.
                </p>
              </div>

              <div>
                <h2 className="font-display font-semibold text-2xl text-char mb-3">How we use your information</h2>
                <p className="mb-3">
                  Candidate information is used to match candidates to relevant roles and
                  to build shortlists for employers. We share candidate profiles with
                  employers only when we believe there is a genuine role match. We do not
                  share your information with third parties for advertising or data
                  brokerage purposes.
                </p>
                <p>
                  Employer information is used to understand the role, build the shortlist,
                  and communicate about the hiring process.
                </p>
              </div>

              <div>
                <h2 className="font-display font-semibold text-2xl text-char mb-3">Data retention</h2>
                <p>
                  Candidate profiles are retained for as long as you are active on the
                  platform. You may request deletion at any time by emailing us. Employer
                  role briefs are retained for internal records and to understand what we
                  have placed historically.
                </p>
              </div>

              <div>
                <h2 className="font-display font-semibold text-2xl text-char mb-3">Your rights</h2>
                <p>
                  You have the right to access, correct, or delete your personal
                  information. To exercise any of these rights, contact us at{" "}
                  <a href="mailto:hello@olera.co" className="text-amber hover:text-amber/80 transition-colors">
                    hello@olera.co
                  </a>
                  . We will respond within 14 days.
                </p>
              </div>

              <div>
                <h2 className="font-display font-semibold text-2xl text-char mb-3">Cookies</h2>
                <p>
                  Olera uses minimal cookies necessary to operate the platform (session
                  management, authentication). We do not use advertising or tracking
                  cookies.
                </p>
              </div>

              <div>
                <h2 className="font-display font-semibold text-2xl text-char mb-3">Changes to this policy</h2>
                <p>
                  We may update this policy as the platform grows. Material changes will
                  be communicated by email to active users or by updating the date above.
                  Continued use of the platform after changes constitutes acceptance of
                  the updated policy.
                </p>
              </div>

              <div>
                <h2 className="font-display font-semibold text-2xl text-char mb-3">Contact</h2>
                <p>
                  For any privacy-related questions:{" "}
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
