import { Separator } from "@/components/ui/separator";
import Link from "next/link";


export default function TermsPage() {
  const definitions = [
    {
      label: "Affiliate",
      text: `means an entity that controls, is controlled by, or is under common control with a party. "Control" means ownership of 50% or more of the shares, equity interest, or other securities entitled to vote.`,
    },
    { label: "Country", text: "refers to: Delhi, India" },
    {
      label: "Company",
      text: `refers to Delobooks (also referred to as "We", "Us", or "Our" in this Agreement).`,
    },
    {
      label: "Device",
      text: "means any device that can access the Service, such as a computer, cellphone, or digital tablet.",
    },
    { label: "Service", text: "refers to the Website." },
    {
      label: "Third-party Social Media Service",
      text: "means any content or services provided by a third-party that may be displayed or accessible through the Service.",
    },
    {
      label: "Website",
      text: (
        <>
          refers to Delobooks accessible at{" "}
          <Link
            href="https://delobooks.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            https://delobooks.vercel.app
          </Link>
        </>
      ),
    },
    {
      label: "You",
      text: "means the individual using the Service, or the company/legal entity on whose behalf the individual is accessing the Service.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl text-white">
      <h1 className="text-center text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
        Terms and Conditions
      </h1>
      <p className="text-sm text-center  mb-8 text-white">
        Last updated: September 21, 2025
      </p>

      <Paragraph>
        Please read these terms and conditions carefully before using Our
        Service.
      </Paragraph>

      <SectionTitle title="Interpretation and Definitions" />
      <SubSection title="Interpretation" />
      <Paragraph>
        The words with initial capital letters have meanings defined under the
        following conditions. These definitions apply whether they appear in
        singular or plural.
      </Paragraph>

      <SubSection title="Definitions" />
      <Paragraph>For the purposes of these Terms and Conditions:</Paragraph>
      <ul className="list-disc list-inside space-y-4 pl-4 mt-4  text-white">
        {definitions.map((item, i) => (
          <li key={i}>
            <strong>{item.label}:</strong> {item.text}
          </li>
        ))}
      </ul>

      <Section title="Acknowledgment">
        <Paragraph>
          These Terms govern your use of the Service and form the agreement
          between You and the Company. They set out the rights and obligations
          of all users regarding the Service.
        </Paragraph>
        <Paragraph>
          By accessing or using the Service, You agree to be bound by these
          Terms. If You do not agree, You may not access the Service.
        </Paragraph>
        <Paragraph>
          You represent that you are over 18 years of age. The Company does not
          permit those under 18 to use the Service.
        </Paragraph>
        <Paragraph>
          Your use of the Service is also conditioned on your acceptance of our{" "}
          <Link
            href="/privacy-policy"
            className="text-blue-600 hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </Paragraph>
      </Section>

      <Section title="Links to Other Websites">
        <Paragraph>
          Our Service may contain links to third-party websites or services that
          are not owned or controlled by the Company. We assume no
          responsibility for their content, privacy policies, or practices.
        </Paragraph>
      </Section>

      <Section title="Termination">
        <Paragraph>
          We may suspend or terminate Your access immediately, without notice,
          if You breach these Terms. Upon termination, Your right to use the
          Service ceases immediately.
        </Paragraph>
      </Section>

      <Section title="Limitation of Liability">
        <Paragraph>
          The Company’s liability is limited to the amount You paid through the
          Service or 100 USD if no purchase was made. We are not liable for any
          indirect or consequential damages.
        </Paragraph>
      </Section>

      <Section title='"AS IS" and "AS AVAILABLE" Disclaimer'>
        <Paragraph>
          The Service is provided “AS IS” without warranties of any kind. We do
          not guarantee uninterrupted, error-free service or that the Service
          will meet Your requirements.
        </Paragraph>
      </Section>

      <Section title="Governing Law">
        <Paragraph>
          The laws of India govern these Terms, excluding its conflict of law
          rules.
        </Paragraph>
      </Section>

      <Section title="Disputes Resolution">
        <Paragraph>
          If You have any dispute, You agree to try resolving it informally by
          contacting the Company first.
        </Paragraph>
      </Section>

      <Section title="Other Provisions">
        <SubSection title="Severability" />
        <Separator />
        <Paragraph>
          If any provision is held invalid, the remaining provisions remain in
          effect.
        </Paragraph>

        <SubSection title="Waiver" />
         <Separator />
        <Paragraph>
          Failure to enforce a right or obligation under these Terms does not
          constitute a waiver.
        </Paragraph>

        <SubSection title="Translation" />
         <Separator />
        <Paragraph>
          In case of conflict, the original English version prevails.
        </Paragraph>
      </Section>

      <Section title="Changes to These Terms">
        <Paragraph>
          We may revise these Terms at any time. Material changes will be
          notified at least 30 days before taking effect. Continued use of the
          Service after revisions means acceptance of the new Terms.
        </Paragraph>
      </Section>

      <Section title="Contact Us">
        <Paragraph>If you have any questions, contact us:</Paragraph>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li>
            Email:{" "}
            <a
              href="mailto:jrai16674@gmail.com"
              className="text-blue-600 hover:underline"
            >
              jrai16674@gmail.com
            </a>
          </li>
          <li>
            Website:{" "}
            <Link
              href="https://delobooks.vercel.app/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              delobooks.vercel.app/contact
            </Link>
          </li>
        </ul>
      </Section>
    </div>
  );
}


type TitleProps = { title: string };

function SectionTitle({ title }: TitleProps) {
  return (
    <h2 className="text-3xl font-semibold tracking-tight border-b pb-2 mt-12 text-white">
      {title}
    </h2>
  );
}

function SubSection({ title }: TitleProps) {
  return <h3 className="text-2xl font-semibold tracking-tight mt-8 text-white">{title}</h3>;
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return <p className="mt-4  leading-relaxed text-white">{children}</p>;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-3xl font-semibold tracking-tight border-b pb-2 text-white">
        {title}
      </h2>
      <div className="space-y-6 mt-4">{children}</div>
    </section>
  );
}
