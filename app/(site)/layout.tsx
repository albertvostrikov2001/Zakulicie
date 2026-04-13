import { CustomCursor } from "@/components/motion/CustomCursor";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <CustomCursor />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
