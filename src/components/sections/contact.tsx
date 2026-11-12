"use client";
import { useState, type FormEvent } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Magnetic } from "../core/magnetic";
import { Button } from "../ui/button";
import { Arrow } from "../ui/arrow";
export function Contact() {
  const [downloaded, setDownloaded] = useState(false);
  function download(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const text = `BRIEFING / UNTOLD\n\nNome: ${form.get("name")}\nE-mail: ${form.get("email")}\nTipo de projeto: ${form.get("type")}\n\nSua ideia:\n${form.get("message")}\n\nDocumento preparado localmente. Nenhuma informação foi enviada.\n`;
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/plain;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "meu-projeto-untold.txt";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloaded(true);
  }
  return (
    <section
      id="contato"
      className="contact section-pad"
      aria-labelledby="contact-title"
      tabIndex={-1}
    >
      <div className="section-label">
        <span>06 / Seu próximo capítulo</span>
        <span>Começa com uma ideia.</span>
      </div>
      <div className="contact-layout">
        <div className="contact-copy">
          <h2 id="contact-title">
            Tem algo
            <br />
            em mente<span>?</span>
          </h2>
          <p>
            Conte o que você quer construir.
            <br />
            Vamos dar uma forma a essa ideia.
          </p>
          <div className="contact-status">
            <span className="status-line" />O envio ainda não está disponível.
            Você já pode preparar e baixar seu briefing, sem enviar dados.
          </div>
        </div>
        <form
          onSubmit={download}
          className="contact-form liquid-glass"
          aria-describedby="form-note"
          onChange={() => setDownloaded(false)}
        >
          <div className="field-pair">
            <div className="form-field">
              <label htmlFor="contact-name">
                Seu nome <span aria-hidden="true">*</span>
              </label>
              <Input
                id="contact-name"
                name="name"
                placeholder="Como podemos chamar você?"
                autoComplete="name"
                required
                maxLength={100}
              />
            </div>
            <div className="form-field">
              <label htmlFor="contact-email">
                E-mail <span aria-hidden="true">*</span>
              </label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                placeholder="voce@empresa.com"
                autoComplete="email"
                required
                maxLength={200}
              />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="contact-type">
              O que vamos construir? <span aria-hidden="true">*</span>
            </label>
            <select
              className="liquid-glass"
              id="contact-type"
              name="type"
              defaultValue=""
              required
            >
              <option value="" disabled>
                Selecione um tipo de projeto
              </option>
              <option>Site institucional</option>
              <option>Landing page</option>
              <option>Design de interface</option>
              <option>Experiência digital</option>
              <option>Vamos descobrir juntos</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="contact-message">
              Sua ideia <span aria-hidden="true">*</span>
            </label>
            <Textarea
              id="contact-message"
              name="message"
              placeholder="Um pouco sobre a marca, o projeto e o que você imagina."
              rows={4}
              required
              minLength={10}
              maxLength={5000}
            />
          </div>
          <div className="form-actions">
            <Magnetic>
              <Button size="lg" type="submit">
                Baixar meu briefing <Arrow diagonal />
              </Button>
            </Magnetic>
            <Button
              variant="outline"
              size="lg"
              type="button"
              disabled
              aria-describedby="form-note"
            >
              Enviar projeto
            </Button>
          </div>
          <p id="form-note" className="form-note">
            O download acontece no seu dispositivo. Nenhum dado é enviado ou
            armazenado pelo site.
          </p>
          <p role="status" className="download-status">
            {downloaded
              ? "Briefing preparado para download. Nenhum dado foi enviado."
              : ""}
          </p>
        </form>
      </div>
    </section>
  );
}
