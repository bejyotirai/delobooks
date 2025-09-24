import { Separator } from "@/components/ui/separator";
import Link from "next/link";


export default function PrivacyPolicyPage() {
  const data = [
    {
      label: "Account",
      text: "means a unique account created for you to access our Service or parts of it.",
    },
    {
      label: "Affiliate",
      text: "means an entity that controls, is controlled by or is under common control with a party.",
    },
    {
      label: "Company",
      text: `refers to Delobooks (also referred to as "We", "Us", or "Our" in this Agreement).`,
    },
    {
      label: "Cookies",
      text: "are small files placed on your device by a website, which store certain browsing information.",
    },
    {
      label: "Country",
      text: "refers to: Delhi, India",
    },
    {
      label: "Device",
      text: "means any device that can access the Service (computer, phone, tablet, etc).",
    },
    {
      label: "Personal Data",
      text: "is any information that relates to an identified or identifiable individual.",
    },
    {
      label: "Service",
      text: "refers to the Website.",
    },
    {
      label: "Service Provider",
      text: "means any third‑party who processes the data on behalf of the Company.",
    },
    {
      label: "Third‑party Social Media Service",
      text: "refers to any platform through which a user can sign in or create an account.",
    },
    {
      label: "Usage Data",
      text: "refers to data collected automatically by using the Service.",
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
      text: "means the individual accessing the Service, or the company they represent.",
    },
  ];
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl text-white">
      <h1 className="text-center text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
        Privacy Policy
      </h1>
      <p className="text-sm text-center text-white mb-8">
        Last updated: September 21, 2025
      </p>

      <section className="space-y-6 text-white leading-relaxed">
        <p>
          This Privacy Policy describes our policies and procedures on the
          collection, use, and disclosure of your information when you use the
          Service and tells you about your privacy rights and how the law
          protects you.
        </p>
      </section>

      <SectionTitle title="Interpretation and Definitions" />
      <SubSection title="Interpretation" />
      <Paragraph>
        The words with initial capital letters have meanings defined under the
        following conditions. These definitions apply whether they appear in
        singular or plural.
      </Paragraph>

      <SubSection title="Definitions" />
      <Paragraph>For the purposes of this Privacy Policy:</Paragraph>
      <ul className="list-disc list-inside space-y-4 pl-4 mt-4  text-white">
        {data.map((item, i) => (
          <li key={i}>
            <strong>{item.label}:</strong> {item.text}
          </li>
        ))}
      </ul>

      <Section title="Collecting and Using Your Personal Data">
        <SubSection title="Types of Data Collected" />
         <Separator />
        <SubSubSection title="Personal Data" />
         <Separator />
        <Paragraph>
          While using our Service, we may ask you to provide certain personally
          identifiable information such as:
        </Paragraph>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li>Email address</li>
          <li>First name and last name</li>
          <li>Usage Data</li>
        </ul>

        <SubSubSection title="Usage Data" />
         <Separator />
        <Paragraph>
          Usage Data is collected automatically when using the Service. It may
          include IP address, browser type, browser version, time spent, and
          pages visited. Mobile device data may also be collected.
        </Paragraph>

        <SubSubSection title="Information from Third‑Party Social Media Services" />
         <Separator />
        <Paragraph>
          You may log in through third‑party services (Google, Facebook, etc.)
          which may share info like name, email, and contacts with us.
        </Paragraph>

        <SubSubSection title="Tracking Technologies and Cookies" />
         <Separator />
        <Paragraph>
          We use cookies and similar tracking technologies to enhance your
          experience.
        </Paragraph>
        <Paragraph>Types of cookies we use include:</Paragraph>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li>
            <strong>Essential Cookies:</strong> Required for the website to
            function properly.
          </li>
          <li>
            <strong>Preference Cookies:</strong> Remember your preferences.
          </li>
          <li>
            <strong>Analytics Cookies:</strong> Help us understand usage
            patterns.
          </li>
        </ul>
      </Section>

      <Section title="Use of Your Personal Data">
        <Paragraph>We may use your data to:</Paragraph>
        <ul className="list-disc list-inside space-y-3 pl-4">
          <li>Provide and maintain the Service</li>
          <li>Manage Your Account</li>
          <li>Fulfill contract obligations</li>
          <li>Contact You for updates or information</li>
          <li>Offer products, services, promotions</li>
          <li>Respond to your inquiries</li>
          <li>Analyze data to improve service</li>
        </ul>
      </Section>

      <Section title="Retention, Transfer & Deletion of Personal Data">
        <SubSection title="Retention of Your Personal Data" />
         <Separator />
        <Paragraph>
          We keep your Personal Data as long as needed to fulfill purposes
          outlined in this policy or comply with legal obligations.
        </Paragraph>

        <SubSection title="Transfer of Your Personal Data" />
         <Separator />
        <Paragraph>
          Your data may be processed and stored outside your country. We ensure
          adequate security during such transfers.
        </Paragraph>

        <SubSection title="Delete Your Personal Data" />
         <Separator />
        <Paragraph>
          You may request deletion of your data. Some data may be retained if
          legally required or for legitimate business reasons.
        </Paragraph>
      </Section>

      <Section title="Security of Your Personal Data">
        <Paragraph>
          We use commercially acceptable measures to protect your Personal Data,
          but no system is 100% secure.
        </Paragraph>
      </Section>

      <Section title="Children's Privacy">
        <Paragraph>
          We do not knowingly collect information from anyone under the age of
          13. If you are a parent and aware that your child has provided us with
          data, please contact us.
        </Paragraph>
      </Section>

      <Section title="Links to Other Websites">
        <Paragraph>
          Our Service may contain links to other websites. We are not
          responsible for their content or privacy practices.
        </Paragraph>
      </Section>

      <Section title="Changes to this Privacy Policy">
        <Paragraph>
          We may update this Privacy Policy. You will be notified via email or
          prominent notice on the Service.
        </Paragraph>
      </Section>

      <Section title="Contact Us">
        <Paragraph>For any questions, contact us:</Paragraph>
        <ul className="list-disc list-inside space-y-2 pl-4 text-white">
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


type TitleProps = {
  title: string;
};

function SectionTitle({ title }: TitleProps) {
  return (
    <h2 className="text-3xl font-semibold tracking-tight border-b pb-2 mt-12 text-white">
      {title}
    </h2>
  );
}

function SubSection({ title }: TitleProps) {
  return (
    <h3 className="text-2xl font-semibold tracking-tight mt-8 text-white">{title}</h3>
  );
}

function SubSubSection({ title }: TitleProps) {
  return <h4 className="text-xl font-semibold tracking-tight mt-6 text-white">{title}</h4>;
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
    <section className="mt-10 text-white">
      <h2 className="text-3xl font-semibold tracking-tight border-b pb-2">
        {title}
      </h2>
      <div className="space-y-6 mt-4">{children}</div>
    </section>
  );
}
