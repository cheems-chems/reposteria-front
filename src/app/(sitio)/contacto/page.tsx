import { ContactForm } from "@/components/store/contact-form";
import { PageHeader } from "@/components/store/page-header";
import { brand } from "@/lib/brand";

export const metadata = {
  title: "Contacto",
  description: "Cuéntanos qué necesitas y para cuándo, y confirmamos tu encargo.",
};

export default function ContactoPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8">
      <PageHeader
        title="Hablemos de tu encargo"
        description="Cuéntanos sabor, tamaño y para cuándo lo necesitas. Te confirmamos disponibilidad y fecha."
      />

      <div className="mt-8">
        <ContactForm whatsapp={brand.contact.whatsapp || null} />
      </div>
    </main>
  );
}
