export default function HomePage() {
  return (
    <main className="bg-[#0F172A] text-white min-h-screen">

      <section className="relative h-screen flex items-center justify-center">

        <img
          src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black"></div>

        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-7xl font-bold uppercase">
            The Penthouse <br />
            Ogbomoso
          </h1>

          <a
            href="/login"
            className="mt-10 inline-block border border-yellow-400 px-8 py-4 text-sm uppercase hover:bg-yellow-400 hover:text-black transition"
          >
            View Apartment
          </a>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-20 px-6">

        <h2 className="text-4xl font-bold mb-10">
          Featured Residence
        </h2>

        <div className="grid md:grid-cols-2 gap-10">

          <img
            src="https://images.unsplash.com/photo-1493809842364-78817add7ffb"
            className="w-full h-[400px] object-cover"
          />

          <div className="flex flex-col justify-center">

            <h3 className="text-2xl font-bold mb-2">
              The Midnight Suite
            </h3>

            <p className="text-gray-400 mb-4">
              Ogbomoso, Oyo State
            </p>

            <p className="text-yellow-400 text-3xl mb-6">
              ₦150,000 / Night
            </p>

            <a
              href="/login"
              className="border border-yellow-400 px-6 py-3 hover:bg-yellow-400 hover:text-black transition"
            >
              View Residence
            </a>

          </div>
        </div>
      </section>

    </main>
  );
}