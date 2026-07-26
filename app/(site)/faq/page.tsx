import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about buying and selling marine diesel engines and parts on Shipcove Trading.",
};

const FAQS = [
  {
    q: "How do I find a part without the exact OEM number?",
    a: "Use the exploded diagram for your engine model — browse to the brand, then the model, and open its drawing. Tap the callout for the component to see whether we have it in stock.",
  },
  {
    q: "What does POA mean?",
    a: "Price on application. Most engines and larger assemblies are priced individually based on condition, hours and current market — send an enquiry and we'll reply with a quote.",
  },
  {
    q: "How fast do you respond to sell enquiries?",
    a: "Within 24 hours, with either an offer or a request for more photos/documentation.",
  },
  {
    q: "Can I inspect equipment before buying?",
    a: "Yes — inspections at our Dordrecht warehouse can be arranged for engines and larger assemblies.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes, we regularly export engines and parts worldwide and can arrange freight and export documentation.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <span className="label text-blueprint">FAQ</span>
      <h1 className="mt-1 text-display-lg font-display font-bold tracking-tight text-hull">Frequently asked questions</h1>
      <div className="mt-8">
        <Accordion type="multiple">
          {FAQS.map((item) => (
            <AccordionItem key={item.q} value={item.q}>
              <AccordionTrigger className="normal-case tracking-normal text-hull">{item.q}</AccordionTrigger>
              <AccordionContent className="text-[14px] leading-relaxed text-steel">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
