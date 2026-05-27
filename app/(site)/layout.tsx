import { CustomCursor } from "@/components/motion/CustomCursor";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageTransition } from "@/components/layout/PageTransition";
import { ContactFormScrollOnLoad } from "@/components/ui/ContactFormScrollOnLoad";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ContactFormScrollOnLoad />
      <Navbar />
      <CustomCursor />
      <main id="main-content">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  );
}
