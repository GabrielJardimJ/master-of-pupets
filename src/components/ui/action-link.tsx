import { Magnetic } from "../core/magnetic";
import type { ReactNode } from "react";
import { buttonVariants } from "./button-variants";
import { Arrow } from "./arrow";
export function ActionLink({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Magnetic>
      <a
        href={href}
        data-variant={secondary ? "ghost" : "default"}
        className={`${buttonVariants({ variant: secondary ? "ghost" : "default", size: "lg" })} action-link ${secondary ? "action-secondary" : ""}`}
      >
        {children}
        <Arrow diagonal={!secondary} />
      </a>
    </Magnetic>
  );
}
