export function SubscribeCard() {
  return (
    <div className="w-full max-w-xl rounded-[2rem] border border-black/10 bg-white/70 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.05)] backdrop-blur">
      <div className="mb-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
          Subscribe
        </div>
        <h2 className="mt-3 font-serif text-3xl leading-tight tracking-tight text-zinc-950 md:text-4xl">
          Get the latest AI assistant news in your inbox.
        </h2>
        <p className="mt-3 max-w-lg text-sm leading-6 text-zinc-700 md:text-base">
          Daily coverage of AI assistants, agents, voice assistants, automation, and the tools shaping the future of AI-powered work.
        </p>
      </div>

      <form
        action="https://subscribe-forms.beehiiv.com/api/v1/subscribe"
        method="POST"
        target="_blank"
        className="space-y-3"
      >
        <input type="hidden" name="publication_id" value="bb32401e-c7a5-4631-bc05-ce32449ecf21" />
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Enter your email"
            className="h-14 w-full rounded-full border border-black/10 bg-[#f7f4ee] px-5 text-base text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-black/25"
          />
          <button
            type="submit"
            className="h-14 shrink-0 rounded-full bg-zinc-950 px-6 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Subscribe
          </button>
        </div>
        <p className="text-xs leading-5 text-zinc-500">
          No spam. Just sharp daily updates on AI assistants, agents, and automation.
        </p>
      </form>
    </div>
  );
}
