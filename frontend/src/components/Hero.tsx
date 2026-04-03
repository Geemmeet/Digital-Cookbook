interface HeroProps {
  title: string
  image: string
}

export default function Hero({ title, image }: HeroProps) {
  return (
    <div
      className="relative w-full h-48 md:h-80 flex items-center justify-center"
      style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black/30" />
      <h1 className="relative text-6xl font-bold text-white drop-shadow-lg tracking-wide uppercase">
        {title}
      </h1>
    </div>
  )
}