import { LoginModal } from "@/components/loginModal/loginModal";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import landingImage from "../assets/landingPageImage.png";

export const LandingPageHeader = () => {
  return (
    <section className="section-x-inset-xl bg-bw flex w-full flex-col items-center gap-24 border-b-4 py-16 md:gap-32">
      <div className="mx-auto grid grid-cols-1 items-center gap-8 sm:grid-cols-2 md:gap-16">
        <div className="flex flex-col items-start justify-center gap-4">
          <Heading level="h1">
            Better Journeys,
            <br />
            Happier Customers
          </Heading>
          <Paragraph>
            Create and track your customer journey
            <br /> in minutes with <strong>DeltaJourney</strong>.
          </Paragraph>
          <LoginModal />
        </div>
        <img src={landingImage} alt="" width={400} height={400} className="border border-r-4 border-b-4" />
      </div>
    </section>
  );
};
