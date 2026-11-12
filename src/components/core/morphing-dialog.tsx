"use client";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
// Motion Primitives' shared-layout dialog pattern, composed with the Untold Base UI primitive.
import { Dialog } from "@base-ui/react/dialog";
import { LayoutGroup, motion } from "motion/react";
import { useId, useState } from "react";
import { Magnetic } from "./magnetic";
import { Arrow } from "../ui/arrow";
export function MorphingDialog({
  title,
  description,
  number,
  tags,
}: {
  title: string;
  description: string;
  number: string;
  tags: string[];
}) {
  const [open, setOpen] = useState(false);
  const id = useId(),
    reduced = useReducedMotion();
  const transition = {
    type: "spring" as const,
    stiffness: 280,
    damping: 30,
    duration: reduced ? 0 : undefined,
  };
  return (
    <LayoutGroup id={id}>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger
          className="service-trigger liquid-glass"
          aria-label={`Mais sobre ${title}`}
          render={
            <motion.button
              layoutId={reduced ? undefined : "surface"}
              transition={transition}
            />
          }
        >
          <span className="row-number">{number}</span>
          <span className="service-name">{title}</span>
          <span className="service-preview">{tags[0]}</span>
          <span className="service-plus" aria-hidden="true">
            +
          </span>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop className="morph-backdrop" />
          <div className="morph-positioner">
            <Dialog.Popup
              className="morph-popup liquid-glass"
              render={
                <motion.div
                  layoutId={reduced ? undefined : "surface"}
                  transition={transition}
                />
              }
            >
              <Dialog.Close
                className="morph-close liquid-glass"
                aria-label="Fechar detalhes"
              >
                ×
              </Dialog.Close>
              <span className="eyebrow">UNTOLD / {number}</span>
              <Dialog.Title className="morph-title">{title}</Dialog.Title>
              <Dialog.Description className="morph-description">
                {description}
              </Dialog.Description>
              <ul className="morph-tags">
                {tags.map((tag) => (
                  <li key={tag}>
                    {tag}
                  </li>
                ))}
              </ul>
              <Magnetic>
                <Dialog.Close
                  render={
                    <a href="#contato" className="text-link liquid-glass" />
                  }
                >
                  Conversar sobre o projeto <Arrow diagonal />
                </Dialog.Close>
              </Magnetic>
            </Dialog.Popup>
          </div>
        </Dialog.Portal>
      </Dialog.Root>
    </LayoutGroup>
  );
}
