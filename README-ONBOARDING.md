# InvoicePatch Developer Onboarding

Welcome to the InvoicePatch project! This guide will help you get set up, understand the architecture, and start contributing quickly.

---

## 🚀 Project Overview
InvoicePatch is a modern SaaS platform for contractor/manager invoicing, payroll, and workflow automation. It features:
- Freemium onboarding and paywall
- Real-time dashboards for managers and contractors
- Automated approval workflows
- Stripe billing integration (optional)
- Supabase/Postgres backend with RLS
- Mobile-first, responsive UI

---

## 🛠️ Tech Stack
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend/API:** Next.js API routes, Supabase Edge Functions
- **Database:** Supabase (Postgres), RLS
- **Auth:** Supabase Auth (email/password, OTP)
- **Payments:** Stripe (optional, can be disabled)
- **State/Context:** React Context, custom hooks
- **Testing:** Jest, React Testing Library
- **Deployment:** Vercel (auto-deploy from GitHub)

---

## 🏗️ Key Directories
- `src/app/` — Main app pages (App Router)
- `src/components/` — UI components
- `src/contexts/` — React context providers (Auth, Role)
- `src/lib/` — Utility libraries (Stripe, Supabase, analytics, etc.)
- `supabase/` — Edge functions, migrations, SQL
- `tests/` — Unit/integration tests

---

## 🖥️ Local Development Setup
1. **Clone the repo:**
   ```bash
   git clone https://github.com/Redsteban/invoicepatch.git
   cd invoicepatch
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local` (create if missing)
   - Fill in values for:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `STRIPE_SECRET_KEY` (optional)
     - `STRIPE_WEBHOOK_SECRET` (optional)
     - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (optional)
     - Any other keys as needed (see Vercel dashboard for production values)
4. **Run the dev server:**
   ```bash
   npm run dev
   # App runs at http://localhost:3000
   ```

---

## 🌐 Deployment
- **Production:** Vercel auto-deploys from `main` branch
- **Env Vars:** Managed in Vercel dashboard
- **Supabase:** Use the hosted project (see credentials)
- **Stripe:** Integration is optional; app will run without keys

---

## 🧩 Key Architecture Notes
- **App Router:** All new pages/components go in `src/app/`
- **Contexts:** App is wrapped in `AuthProvider` and `RoleProvider` in `src/app/layout.tsx`
- **Edge Functions:** Supabase edge functions in `/supabase/functions/`
- **Freemium Flow:** `/freemium` page, usage limits, upgrade nudges, paywall modal
- **Mobile:** All UIs are mobile-first and responsive
- **Testing:** Run `npm test` for unit/integration tests

---

## 📝 Useful Scripts
- `npm run dev` — Start local dev server
- `npm run build` — Build for production
- `npm test` — Run tests

---

## 📚 Further Reading
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [Vercel Docs](https://vercel.com/docs)

---

## 🙋‍♂️ Need Help?
- Check the code comments and docs in each directory
- Review the Vercel and Supabase dashboards for environment/config
- Contact the previous developer or project owner for credentials and access

Happy coding! 