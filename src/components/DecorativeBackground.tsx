export function DecorativeBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="bg-orb bg-orb-elle animate-blob-drift left-[-18%] top-[-12%] h-[55vmin] w-[55vmin]" />
      <div className="bg-orb bg-orb-lui animate-blob-drift animation-delay-2000 right-[-14%] top-[8%] h-[48vmin] w-[48vmin]" />
      <div className="bg-orb bg-orb-gold animate-blob-drift animation-delay-4000 bottom-[-8%] left-[28%] h-[42vmin] w-[42vmin]" />
      <div className="bg-orb bg-orb-sage animate-blob-drift animation-delay-6000 right-[18%] bottom-[12%] h-[36vmin] w-[36vmin]" />
      <div className="bg-noise absolute inset-0 opacity-[0.35]" />
    </div>
  );
}
