import { Lock } from 'lucide-react'

export default function ComingSoon({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center animate-in fade-in duration-500">
      <div className="max-w-md w-full text-center bg-[#121212] rounded-2xl border border-white/5 p-10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="mx-auto w-16 h-16 rounded-full bg-[#E8B55B]/10 ring-1 ring-[#E8B55B]/30 flex items-center justify-center mb-6">
          <Lock className="w-7 h-7 text-[#E8B55B]" strokeWidth={1.8} />
        </div>
        <h1 className="text-2xl font-headline font-bold text-[#E8B55B] tracking-wider">
          {title}
        </h1>
        <p className="mt-3 text-sm text-white/50 leading-relaxed">
          {description ?? 'Esta secção está temporariamente indisponível. Voltará em breve.'}
        </p>
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E8B55B]/20 bg-[#E8B55B]/5 text-[11px] font-bold uppercase tracking-[0.3em] text-[#E8B55B]">
          Em breve
        </div>
      </div>
    </div>
  )
}
