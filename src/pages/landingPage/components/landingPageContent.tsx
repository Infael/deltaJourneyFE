import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";

const InfoCardsData = [
  {
    title: "Compare journeys at different times",
    description: "Observe and analyze customer journeys at different stages of development.",
  },
  {
    title: "Your Data, Your Control",
    description: "We never process your data—everything stays securely under your control.",
  },
  {
    title: "Seamless Integration",
    description: "Connect data from multiple touchpoints effortlessly.",
  },
  {
    title: "Actionable Insights",
    description: "Identify drop-offs and optimize key moments.",
  },
  {
    title: "Easy-to-Use",
    description: "Intuitive interface, no coding required. All your maps in one place!",
  },
];

export const LandingPageContent = () => {
  return (
    <section className="flex w-full items-center justify-center px-32 py-16">
      <div className="flex max-w-[800px] flex-col items-center gap-16">
        {InfoCardsData.map((card, index) => (
          <Card
            key={card.title}
            className="flex w-full flex-col justify-between px-4 py-2"
            variant={index % 2 === 0 ? "primary" : "secondary"}
          >
            <Heading level="h3">{card.title}</Heading>
            <Paragraph>{card.description}</Paragraph>
          </Card>
        ))}
      </div>
    </section>
  );
};
