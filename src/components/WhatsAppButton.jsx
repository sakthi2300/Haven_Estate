const PHONE_NUMBER = '914440001280'
const MESSAGE =
  'Hello Haven Estate, I am interested in your properties. Could you please share more details?'

export default function WhatsAppButton() {
  function openWhatsApp() {
    const message = encodeURIComponent(MESSAGE)
    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${message}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <button
      type="button"
      onClick={openWhatsApp}
      aria-label="Contact Haven Estate on WhatsApp"
      className="fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(0,0,0,0.24)] transition duration-200 hover:-translate-y-1 hover:scale-105 hover:bg-[#20BD5A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#128C4A]"
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
        <path
          d="M20.3 11.8a8.3 8.3 0 0 1-12.3 7.3L4 20l.9-3.8a8.3 8.3 0 1 1 15.4-4.4Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 8.1c.2-.4.4-.4.7-.4h.4c.2 0 .3.1.4.4l.7 1.7c.1.2 0 .4-.1.5l-.5.6c-.2.2-.2.4-.1.6.5.9 1.2 1.6 2.1 2.1.2.1.4.1.6-.1l.7-.8c.2-.2.3-.2.5-.1l1.6.8c.2.1.3.2.3.4 0 .3-.2 1-.6 1.3-.4.4-.9.6-1.5.6-.5 0-1.2-.2-2.1-.6-1-.5-2.1-1.4-3-2.4-.8-.9-1.3-1.9-1.5-2.6-.2-.8 0-1.4.4-1.9.3-.2.7-.2 1-.1Z"
          fill="currentColor"
        />
      </svg>
    </button>
  )
}
