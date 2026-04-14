"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();
  const login = useAppStore((s) => s.login);
  const updateUser = useAppStore((s) => s.updateUser);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    login(name, email);
    updateUser({ username: `@${username.replace("@", "")}` });
    router.push("/goals/new");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "var(--bg)",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(200,255,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: 460, position: "relative" }}>
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            color: "var(--lime)",
            textDecoration: "none",
            display: "block",
            textAlign: "center",
            marginBottom: 40,
            letterSpacing: "0.04em",
          }}
        >
          BENCHLINE
        </Link>

        <div className="card" style={{ padding: 40 }}>
          {/* Progress */}
          <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
            {[1, 2].map((s) => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: 3,
                  borderRadius: 2,
                  background: s <= step ? "var(--lime)" : "var(--surface-3)",
                  transition: "background 0.3s",
                }}
              />
            ))}
          </div>

          {step === 1 && (
            <>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: 40, color: "var(--text)", marginBottom: 8 }}>
                JOIN THE BENCH
              </h1>
              <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 32 }}>
                Create your athlete profile.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { label: "Full Name", value: name, set: setName, placeholder: "Your name", type: "text" },
                  { label: "Email", value: email, set: setEmail, placeholder: "you@example.com", type: "email" },
                  { label: "Username", value: username, set: setUsername, placeholder: "yourhandle", type: "text" },
                ].map(({ label, value, set, placeholder, type }) => (
                  <div key={label}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", display: "block", marginBottom: 8, textTransform: "uppercase" }}>
                      {label}
                    </label>
                    <input
                      type={type}
                      value={value}
                      onChange={(e) => set(e.target.value)}
                      placeholder={placeholder}
                      required
                      style={{
                        width: "100%",
                        background: "var(--surface-2)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        padding: "12px 16px",
                        color: "var(--text)",
                        fontSize: 15,
                        outline: "none",
                        fontFamily: "var(--font-body)",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "var(--lime)")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                    />
                  </div>
                ))}
                <button
                  className="btn-lime"
                  style={{ width: "100%", marginTop: 8 }}
                  onClick={() => name && email && username && setStep(2)}
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <form onSubmit={handleCreate}>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: 40, color: "var(--text)", marginBottom: 8 }}>
                ALMOST IN
              </h1>
              <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 32 }}>
                By creating an account you agree to our terms. Benchline is free to start.
              </p>

              <div
                style={{
                  background: "rgba(200,255,0,0.06)",
                  border: "1px solid rgba(200,255,0,0.2)",
                  borderRadius: 10,
                  padding: 20,
                  marginBottom: 28,
                }}
              >
                <div style={{ fontSize: 13, color: "var(--lime)", fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Your Profile
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {[
                    ["Name", name],
                    ["Email", email],
                    ["Username", `@${username}`],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                      <span style={{ color: "var(--text-muted)" }}>{k}</span>
                      <span style={{ color: "var(--text)", fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button type="button" className="btn-ghost" onClick={() => setStep(1)} style={{ flex: 1 }}>
                  Back
                </button>
                <button type="submit" className="btn-lime" style={{ flex: 2 }}>
                  Create Account 🚀
                </button>
              </div>
            </form>
          )}

          <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--text-muted)" }}>
            Have an account?{" "}
            <Link href="/login" style={{ color: "var(--lime)", textDecoration: "none", fontWeight: 600 }}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
