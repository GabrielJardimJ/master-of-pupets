import { Technologies } from "@/components/sections/technologies";
import { Process } from "@/components/sections/process";
import { Header } from "@/components/header";
import { Hero } from "@/components/sections/hero";
import { Manifesto } from "@/components/sections/manifesto";
import { Services } from "@/components/sections/services";
import { Projects } from "@/components/sections/projects";
import { Studio } from "@/components/sections/studio";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/footer";
export default function Home() {
  return (
    <>
      <a href="#manifesto" className="skip-link">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        <Manifesto />
        <Services />
        <Technologies />
        <Projects />
        <Process />
        <Studio />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
