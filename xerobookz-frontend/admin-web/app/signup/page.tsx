"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input, Card, XeroBookzLogo } from "@xerobookz/ui-shared";
import { Mail, Lock, Building2, User, Gift } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    promoCode: "",
  });
  const [error, setError] = useState("");
  const [promoValid, setPromoValid] = useState<boolean | null>(null);
  const [promoMessage, setPromoMessage] = useState("");

  // In browser: use env, or on localhost hit API at 8000 directly so signup works when API is running.
  const getApiBase = () => {
    if (typeof window === "undefined") return "";
    const env = process.env.NEXT_PUBLIC_API_URL;
    if (env) return env;
    if (window.location?.hostname === "localhost") return "http://localhost:8000";
    return "";
  };

  const validatePromoCode = async (code: string) => {
    if (!code) {
      setPromoValid(null);
      return;
    }

    try {
      const base = getApiBase();
      const url = base ? `${base}/api/v1/promo/validate` : "/api/v1/promo/validate"; // relative URL proxied to localhost:8000 by Next.js
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.toUpperCase() }),
      });

      const text = await response.text();
      let result: { success?: boolean; data?: { valid?: boolean; message?: string }; error?: { details?: string } };
      try {
        result = text ? JSON.parse(text) : {};
      } catch {
        setPromoValid(false);
        setPromoMessage("Server unavailable. Start the backend (see document/RUN-LOCAL.md) or try again later.");
        return;
      }

      if (result.success && result.data?.valid) {
        setPromoValid(true);
        setPromoMessage(result.data.message || "Promo code is valid!");
      } else {
        setPromoValid(false);
        setPromoMessage(result.data?.message || result.error?.details || "Invalid promo code");
      }
    } catch (err) {
      setPromoValid(false);
      setPromoMessage("Cannot reach server. Start the API with: ./start-api.sh (requires Docker) then try again.");
    }
  };

  const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setFormData({ ...formData, promoCode: code });
    validatePromoCode(code);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.promoCode && !promoValid) {
      setError("Please enter a valid promo code");
      return;
    }

    setIsLoading(true);

    const base = getApiBase();

    const parseJson = (res: Response, text: string) => {
      try {
        return text ? JSON.parse(text) : null;
      } catch {
        return null;
      }
    };

    try {
      // Validate promo code if provided
      let promoValidation: { success?: boolean; data?: { valid?: boolean } } | null = null;
      if (formData.promoCode) {
        const promoUrl = base ? `${base}/api/v1/promo/validate` : "/api/v1/promo/validate";
        const promoResponse = await fetch(promoUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: formData.promoCode.toUpperCase() }),
        });
        const promoText = await promoResponse.text();
        promoValidation = parseJson(promoResponse, promoText);
        if (!promoValidation?.success || !promoValidation?.data?.valid) {
          setError("Invalid promo code");
          setIsLoading(false);
          return;
        }
      }

      // Create company/tenant
      const signupUrl = base ? `${base}/api/v1/auth/signup` : "/api/v1/auth/signup";
      const signupResponse = await fetch(signupUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: formData.companyName,
          email: formData.email,
          password: formData.password,
          promo_code: formData.promoCode || null,
        }),
      });

      const signupText = await signupResponse.text();
      const result = parseJson(signupResponse, signupText);
      if (!result) {
        setError("Server returned an invalid response. Ensure the API is running (see document/RUN-LOCAL.md).");
        setIsLoading(false);
        return;
      }

      if (result.success) {
        // Apply promo code if valid
        if (formData.promoCode && promoValidation?.data?.valid) {
          const applyUrl = base ? `${base}/api/v1/promo/apply` : "/api/v1/promo/apply";
          const applyParams = new URLSearchParams({
            code: formData.promoCode.toUpperCase(),
            tenant_id: result.data.tenant_id,
            user_email: formData.email,
          });
          await fetch(`${applyUrl}?${applyParams}`, { method: "POST" });
        }

        // Auto login
        const loginUrl = base ? `${base}/api/v1/auth/login` : "/api/v1/auth/login";
        const loginResponse = await fetch(loginUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            tenant_id: result.data.tenant_id,
          }),
        });

        const loginText = await loginResponse.text();
        const loginResult = parseJson(loginResponse, loginText);

        if (loginResult?.success) {
          localStorage.setItem("xerobookz_token", loginResult.data.access_token);
          localStorage.setItem("xerobookz_refresh_token", loginResult.data.refresh_token);
          localStorage.setItem("xerobookz_tenant_id", result.data.tenant_id);
          router.push("/company-admin/dashboard");
        } else {
          router.push("/login");
        }
      } else {
        setError(result.error?.details || "Signup failed");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Signup failed";
      setError(
        msg.toLowerCase().includes("fetch") || msg === "Failed to fetch"
          ? "Cannot reach server. Start the API with ./start-api.sh (requires Docker) and try again."
          : msg
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 p-6">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="text-grey-600 hover:text-secondary-800 mb-6"
          >
            ← Back to Home
          </Button>
        </div>
        <Card variant="default" className="p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <XeroBookzLogo size="xl" />
            </div>
            <h1 className="text-3xl font-bold text-secondary-800 mb-2">
              Get Started
            </h1>
            <p className="text-grey-600">
              Create your company account and start using XeroBookz
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Company Name"
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="Your Company Name"
              required
              icon={<Building2 className="h-4 w-4 text-grey-400" />}
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              required
              icon={<Mail className="h-4 w-4 text-grey-400" />}
            />
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Create a password"
              required
              icon={<Lock className="h-4 w-4 text-grey-400" />}
            />
            <Input
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Confirm your password"
              required
              icon={<Lock className="h-4 w-4 text-grey-400" />}
            />
            
            <div>
              <Input
                label="Promo Code (Optional)"
                type="text"
                value={formData.promoCode}
                onChange={handlePromoCodeChange}
                placeholder="Enter promo code"
                icon={<Gift className="h-4 w-4 text-grey-400" />}
              />
              {promoValid !== null && (
                <div className={`mt-2 text-sm ${
                  promoValid ? "text-accent-600" : "text-danger-600"
                }`}>
                  {promoMessage}
                </div>
              )}
              <p className="text-xs text-grey-500 mt-1">
                Use promo code "FREE2026" for one year free service (valid for 2026 only)
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-danger-50 border border-danger-200">
                <p className="text-danger-600 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              loading={isLoading}
              size="lg"
              variant="gradient"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-grey-600">
              Already have an account?{" "}
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
