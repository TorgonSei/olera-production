"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { OleraLockupH, COLORS } from "@/components/brand/Mark";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { Clock, ChevronRight, Check } from "lucide-react";

/* ─── Assessment questions by track ─────────────────────────────────────── */
const WRITTEN_PROMPTS: Record<string, string> = {
  support: `A customer contacts you angry that their account was charged twice for the same subscription. They're threatening to cancel and post a negative review. Write your full response to them — be specific about what you'd do and say.`,
  success: `One of your key accounts (paying $3,000/month) hasn't logged in for 6 weeks. Their renewal is in 45 days. Write out your re-engagement strategy — what you'd do, in what order, and what you'd say on the first touch.`,
  assistant: `Your executive has four conflicting meetings on Thursday, an urgent board deck that needs finishing by Friday noon, and you've just discovered their flight to London was cancelled. Walk me through exactly how you'd handle this — your priorities, your communications, and your decisions.`,
};

const SCENARIOS: Record<string, { prompt: string; options: { label: string; correct: boolean }[] }[]> = {
  support: [
    {
      prompt: "A customer says: 'I've been waiting 3 days for a response and this is unacceptable.' Your first message back should:",
      options: [
        { label: "Apologise, acknowledge the wait specifically, and give them a resolution timeline", correct: true },
        { label: "Explain that your team is very busy and you're doing your best", correct: false },
        { label: "Ask them to re-submit the ticket through the correct channel", correct: false },
        { label: "Immediately escalate to your manager before responding", correct: false },
      ],
    },
    {
      prompt: "A customer is technically correct that they were promised a feature, but that rep is no longer at the company and the feature doesn't exist. You:",
      options: [
        { label: "Acknowledge the promise, apologise it wasn't delivered, and offer a meaningful alternative", correct: true },
        { label: "Tell them you can't confirm what a previous rep said", correct: false },
        { label: "Offer a refund immediately to close the issue", correct: false },
        { label: "Ask them for written proof of the promise before proceeding", correct: false },
      ],
    },
    {
      prompt: "You receive 40 tickets on Monday after a weekend outage. Your first action is:",
      options: [
        { label: "Triage by severity: identify customers still affected vs. resolved, address active issues first", correct: true },
        { label: "Work through them chronologically — first in, first out", correct: false },
        { label: "Send a mass email to all affected customers before reading individual tickets", correct: false },
        { label: "Escalate all 40 to your manager", correct: false },
      ],
    },
  ],
  success: [
    {
      prompt: "A customer's usage has dropped 40% over the past month. Your first step is:",
      options: [
        { label: "Review their usage data to identify which features dropped and why before reaching out", correct: true },
        { label: "Send them a check-in email asking if everything is okay", correct: false },
        { label: "Immediately schedule a QBR to address all open issues", correct: false },
        { label: "Flag them as churn risk and offer a discount", correct: false },
      ],
    },
    {
      prompt: "During a renewal call, the customer says 'We love the product but can't justify the cost at renewal.' You:",
      options: [
        { label: "Quantify the value they've received, then explore flexible terms before discounting", correct: true },
        { label: "Offer a 20% discount immediately to close the renewal", correct: false },
        { label: "Ask them to connect you with their CFO directly", correct: false },
        { label: "Send them a competitor comparison showing your value", correct: false },
      ],
    },
    {
      prompt: "You've just been assigned a new account with no handover notes. The renewal is in 60 days. You:",
      options: [
        { label: "Review all account history, set an intro meeting, identify their key goals and risks before anything else", correct: true },
        { label: "Send a standard intro email and wait for their response", correct: false },
        { label: "Start with the renewal conversation immediately to secure it", correct: false },
        { label: "Ask your manager to delay the renewal deadline", correct: false },
      ],
    },
  ],
  assistant: [
    {
      prompt: "Your executive asks you to 'handle' a sensitive email from a board member that requires a response. You:",
      options: [
        { label: "Draft a response for their review, flagging the key decision points they need to sign off on", correct: true },
        { label: "Respond on their behalf using their email signature", correct: false },
        { label: "Forward the email to the executive with 'FYI' and no context", correct: false },
        { label: "Ask the board member to resend directly to the executive", correct: false },
      ],
    },
    {
      prompt: "You have three urgent tasks from different stakeholders, all claiming top priority. You:",
      options: [
        { label: "Clarify deadlines and impact with each stakeholder, then communicate your priority order back", correct: true },
        { label: "Work on them simultaneously to show you can handle it", correct: false },
        { label: "Ask your executive to decide the order for you", correct: false },
        { label: "Do the quickest one first to reduce the list", correct: false },
      ],
    },
    {
      prompt: "You discover your executive double-booked a meeting with an important client and an internal all-hands. You:",
      options: [
        { label: "Assess which is harder to reschedule, propose a solution to your exec, and draft both communications", correct: true },
        { label: "Cancel the internal meeting without asking — external client comes first", correct: false },
        { label: "Inform both parties there's a conflict and let them resolve it", correct: false },
        { label: "Move both meetings without asking anyone", correct: false },
      ],
    },
  ],
};

const TOOLS_BY_TRACK: Record<string, string[]> = {
  support:   ["Zendesk", "Intercom", "Freshdesk", "HubSpot", "Jira", "Notion", "Slack", "Loom"],
  success:   ["Salesforce", "HubSpot", "Gainsight", "Mixpanel", "ChurnZero", "Notion", "Slack", "Loom"],
  assistant: ["Notion", "Asana", "ClickUp", "Google Workspace", "Calendly", "Slack", "Zoom", "Loom"],
};

type AssessmentStep = "intro" | "written" | "scenarios" | "tools" | "done";

/* ─── Timer hook ─────────────────────────────────────────────────────────── */
function useTimer() {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const mins = Math.floor(elapsed / 60).toString().padStart(2, "0");
  const secs = (elapsed % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default function AssessmentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const timer = useTimer();

  const [track, setTrack] = useState<string>("support");
  const [step, setStep] = useState<AssessmentStep>("intro");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Written response
  const [writtenResponse, setWrittenResponse] = useState("");

  // Scenarios — track selected option index per scenario
  const [scenarioAnswers, setScenarioAnswers] = useState<(number | null)[]>([null, null, null]);
  const [currentScenario, setCurrentScenario] = useState(0);

  // Tool ratings (0-3)
  const [toolRatings, setToolRatings] = useState<Record<string, number>>({});

  // Load candidate track
  useEffect(() => {
    fetch(`/api/candidate/${id}/track`)
      .then((r) => r.json())
      .then((d) => { if (d.track) setTrack(d.track); })
      .catch(() => {});
  }, [id]);

  const scenarios = SCENARIOS[track] ?? SCENARIOS.support;
  const tools = TOOLS_BY_TRACK[track] ?? TOOLS_BY_TRACK.support;
  const writtenPrompt = WRITTEN_PROMPTS[track] ?? WRITTEN_PROMPTS.support;

  /* ── Navigation ─────────────────────────────────────────────────────── */
  const goToScenarios = () => {
    if (writtenResponse.trim().length < 80) {
      setError("Please write a more complete response (at least 80 characters).");
      return;
    }
    setError("");
    setStep("scenarios");
  };

  const answerScenario = (optionIndex: number) => {
    const updated = [...scenarioAnswers];
    updated[currentScenario] = optionIndex;
    setScenarioAnswers(updated);
  };

  const nextScenario = () => {
    if (scenarioAnswers[currentScenario] === null) {
      setError("Please select an answer before continuing.");
      return;
    }
    setError("");
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario((n) => n + 1);
    } else {
      setStep("tools");
    }
  };

  const rateTools = (tool: string, rating: number) => {
    setToolRatings((prev) => ({ ...prev, [tool]: rating }));
  };

  const handleSubmit = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/candidate/${id}/assessment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          track,
          written_prompt: writtenPrompt,
          written_response: writtenResponse,
          scenarios: scenarios.map((s, i) => ({
            prompt: s.prompt,
            selected_index: scenarioAnswers[i],
            correct: s.options[scenarioAnswers[i] ?? -1]?.correct ?? false,
          })),
          tool_ratings: toolRatings,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Submit failed");
      setStep("done");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [id, track, writtenPrompt, writtenResponse, scenarios, scenarioAnswers, toolRatings]);

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between border-b border-mist bg-white">
        <OleraLockupH size={26} />
        {step !== "intro" && step !== "done" && (
          <div className="flex items-center gap-2 text-sm font-mono text-moss">
            <Clock size={14} className="text-amber" />
            {timer}
          </div>
        )}
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* ── INTRO ────────────────────────────────────────────────────── */}
        {step === "intro" && (
          <div>
            <p className="text-xs font-mono text-moss/60 uppercase tracking-widest mb-4">
              Step 3 of 3 · Show your work
            </p>
            <h1 className="font-display font-bold text-3xl text-char mb-4">
              Almost there — now show your work.
            </h1>
            <p className="text-moss text-lg mb-8">
              This is how employers see your actual capability, not just your CV. It takes about 20 minutes and covers three parts.
            </p>

            <div className="space-y-3 mb-10">
              {[
                { n: "01", title: "Written response", time: "~8 min", desc: "One open-ended scenario relevant to your track." },
                { n: "02", title: "Judgment scenarios", time: "~8 min", desc: "Three multiple-choice situations you'd face on the job." },
                { n: "03", title: "Tool familiarity", time: "~4 min", desc: "Rate your confidence with the most common tools for your role." },
              ].map((part) => (
                <div key={part.n} className="flex gap-4 p-4 bg-white rounded-2xl border border-mist">
                  <span className="font-mono text-amber font-semibold w-8 flex-shrink-0">{part.n}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-semibold text-char">{part.title}</span>
                      <span className="text-xs font-mono text-moss/60 bg-mist/50 px-2 py-0.5 rounded-full">{part.time}</span>
                    </div>
                    <p className="text-sm text-moss">{part.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-sage/10 rounded-2xl border border-sage/20 mb-8">
              <p className="text-sm text-char">
                <span className="font-semibold text-sage">No right or wrong style.</span>{" "}
                Assessors look for clear thinking and practical judgment — not polished language. Answer honestly.
              </p>
            </div>

            <Button variant="primary" size="lg" fullWidth onClick={() => setStep("written")}>
              Begin
              <ChevronRight size={18} />
            </Button>
          </div>
        )}

        {/* ── WRITTEN ──────────────────────────────────────────────────── */}
        {step === "written" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-mono text-moss/60 uppercase tracking-widest mb-1">
                  Part 1 of 3 · Written response
                </p>
                <h2 className="font-display font-bold text-2xl text-char">Open scenario</h2>
              </div>
              <div className="text-xs font-mono text-moss/60 bg-white px-3 py-1.5 rounded-full border border-mist">
                ~8 min
              </div>
            </div>

            <div className="p-5 bg-forest/5 border border-forest/10 rounded-2xl mb-6">
              <p className="text-char leading-relaxed">{writtenPrompt}</p>
            </div>

            <textarea
              value={writtenResponse}
              onChange={(e) => setWrittenResponse(e.target.value)}
              placeholder="Write your response here..."
              rows={8}
              className={cn(
                "w-full rounded-2xl border-2 border-mist bg-white px-4 py-3",
                "text-sm text-char placeholder:text-moss/50",
                "resize-none transition-colors duration-150",
                "focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20"
              )}
            />

            <div className="flex items-center justify-between mt-2 mb-6">
              <span className="text-xs text-moss font-mono">
                {writtenResponse.length} characters
                {writtenResponse.length < 80 && " · minimum 80"}
              </span>
              {writtenResponse.length >= 80 && (
                <span className="text-xs text-sage font-mono flex items-center gap-1">
                  <Check size={12} /> Good length
                </span>
              )}
            </div>

            {error && <p className="text-sm text-terra mb-4">{error}</p>}

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={goToScenarios}
              disabled={writtenResponse.trim().length < 80}
            >
              Continue to scenarios
              <ChevronRight size={18} />
            </Button>
          </div>
        )}

        {/* ── SCENARIOS ────────────────────────────────────────────────── */}
        {step === "scenarios" && (
          <div>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-mono text-moss/60 uppercase tracking-widest">
                  Part 2 of 3 · Judgment · {currentScenario + 1} of {scenarios.length}
                </p>
                {/* Progress dots */}
                <div className="flex gap-1.5">
                  {scenarios.map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        i < currentScenario ? "w-6 bg-sage" :
                        i === currentScenario ? "w-8 bg-amber" : "w-6 bg-mist"
                      )}
                    />
                  ))}
                </div>
              </div>
              <h2 className="font-display font-bold text-2xl text-char">What would you do?</h2>
            </div>

            <div className="p-5 bg-forest/5 border border-forest/10 rounded-2xl mb-6">
              <p className="text-char leading-relaxed font-medium">
                {scenarios[currentScenario].prompt}
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {scenarios[currentScenario].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => answerScenario(i)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl border-2 transition-all",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/40",
                    scenarioAnswers[currentScenario] === i
                      ? "border-amber bg-amber/5"
                      : "border-mist bg-white hover:border-amber/40"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all",
                        scenarioAnswers[currentScenario] === i
                          ? "border-amber bg-amber"
                          : "border-mist"
                      )}
                    >
                      {scenarioAnswers[currentScenario] === i && (
                        <Check size={11} className="text-cream" />
                      )}
                    </div>
                    <span className="text-sm text-char">{opt.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {error && <p className="text-sm text-terra mb-4">{error}</p>}

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={nextScenario}
              disabled={scenarioAnswers[currentScenario] === null}
            >
              {currentScenario < scenarios.length - 1 ? "Next scenario" : "Continue to tools"}
              <ChevronRight size={18} />
            </Button>
          </div>
        )}

        {/* ── TOOLS ────────────────────────────────────────────────────── */}
        {step === "tools" && (
          <div>
            <div className="mb-6">
              <p className="text-xs font-mono text-moss/60 uppercase tracking-widest mb-1">
                Part 3 of 3 · Tool familiarity
              </p>
              <h2 className="font-display font-bold text-2xl text-char mb-2">
                Rate your confidence
              </h2>
              <p className="text-moss text-sm">
                How comfortable are you with each tool? Be honest — a truthful rating is always better than an inflated one.
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {tools.map((tool) => {
                const rating = toolRatings[tool] ?? 0;
                return (
                  <div key={tool} className="p-3 bg-white rounded-xl border border-mist">
                    <span className="font-medium text-sm text-char block mb-2">{tool}</span>
                    <div className="flex gap-1.5">
                      {["Never used", "Basic", "Proficient", "Expert"].map((label, i) => (
                        <button
                          key={label}
                          onClick={() => rateTools(tool, i)}
                          title={label}
                          className={cn(
                            "flex-1 py-2 rounded-lg text-xs font-medium transition-all border text-center",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/40",
                            rating === i
                              ? i === 0
                                ? "border-moss/30 bg-moss/10 text-moss"
                                : i === 1
                                ? "border-sand bg-sand/40 text-char"
                                : i === 2
                                ? "border-amber/40 bg-amber/10 text-amber"
                                : "border-sage/40 bg-sage/10 text-sage"
                              : "border-mist text-moss/50 hover:border-moss/30"
                          )}
                        >
                          {["—", "Basic", "Pro", "Expert"][i]}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {error && <p className="text-sm text-terra mb-4">{error}</p>}

            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              onClick={handleSubmit}
            >
              Submit
              <ChevronRight size={18} />
            </Button>

            <p className="text-xs text-center text-moss/60 mt-4">
              You can't edit once submitted. Take a moment to review if needed.
            </p>
          </div>
        )}

        {/* ── DONE ─────────────────────────────────────────────────────── */}
        {step === "done" && (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-sage/10 flex items-center justify-center mx-auto mb-6">
              <Check size={36} className="text-sage" />
            </div>
            <h1 className="font-display font-bold text-3xl text-char mb-3">
              Done — your work is in.
            </h1>
            <p className="text-moss text-lg mb-6 max-w-sm mx-auto">
              Our team will review your responses and update your readiness level. Usually within 48 hours.
            </p>
            <div className="p-4 bg-amber/10 rounded-2xl border border-amber/20 mb-8 max-w-sm mx-auto">
              <p className="text-sm text-char">
                <span className="font-semibold">What happens next:</span> We review your responses, set your readiness level, and start matching you to relevant roles.
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push(`/profile/${id}/review`)}
            >
              View my profile
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
