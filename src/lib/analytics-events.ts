"use client";

/** Sends non-personal conversion events to the existing Google Tag Manager data layer. */
export function trackMarketingEvent(
  event: "bezel_form_success" | "bezel_whatsapp_click",
  details: { form_type?: "contato" | "orcamento"; placement?: "floating_button" } = {},
) {
  if (typeof window === "undefined") return;

  const target = window as typeof window & {
    dataLayer?: Array<Record<string, string>>;
  };

  // GTM initializes dataLayer when configured; do not create duplicate analytics installation.
  if (!Array.isArray(target.dataLayer)) return;

  target.dataLayer.push({ event, ...details });
}
