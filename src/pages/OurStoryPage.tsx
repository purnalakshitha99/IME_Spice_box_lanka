const values = [
  'Authenticity',
  'Quality',
  'Personalization',
  'Sustainability',
  'Innovation',
  'Sri Lankan Heritage',
]

export function OurStoryPage() {
  return (
    <div>
      <section className="relative min-h-[60vh] overflow-hidden">
        <img
          src="/products/tea.jpg"
          alt="Sri Lankan tea country"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-cinnamon/75" />
        <div className="relative mx-auto flex min-h-[60vh] max-w-7xl items-end px-4 pb-16 md:px-6">
          <div className="max-w-2xl text-cream">
            <h1 className="font-display text-5xl md:text-6xl">Our Story</h1>
            <p className="mt-4 text-lg text-cream/85">
              Sri Lanka has a rich heritage of spices, tea and traditional food. SpiceBox Lanka was
              created to transform this heritage into modern gifting experiences.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-20 md:px-6">
        <h2 className="font-display text-3xl text-cinnamon">Mission</h2>
        <p className="mt-4 font-display text-2xl italic leading-relaxed text-forest">
          “To share the authentic taste and stories of Sri Lanka through meaningful gifts.”
        </p>
        <h2 className="mt-12 font-display text-3xl text-cinnamon">Vision</h2>
        <p className="mt-4 leading-relaxed text-muted">
          To become the leading premium platform for personalized Sri Lankan cultural gifting —
          connecting diaspora families, travellers, corporates, and curious food lovers with the
          island’s living flavour traditions.
        </p>
        <h2 className="mt-12 font-display text-3xl text-cinnamon">Our Values</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {values.map((v) => (
            <div
              key={v}
              className="rounded-2xl border-l-4 border-gold bg-white/70 px-5 py-4 font-medium text-cinnamon"
            >
              {v}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
