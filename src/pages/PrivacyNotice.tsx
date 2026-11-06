import { Helmet } from 'react-helmet-async';

function PrivacyNotice() {
  return (
    <>
      <Helmet>
        <title>Privacy Notice | Manisha Properties</title>
        <meta
          name="description"
          content="How the Manisha Properties website uses analytics and handles information you choose to share through WhatsApp."
        />
        <link rel="canonical" href="https://manishaproperties.in/privacy" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <article className="mx-auto min-h-screen max-w-4xl px-4 pb-20 pt-32 text-[#F8F4E8] sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
          Manisha Properties
        </p>
        <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">
          Privacy Notice
        </h1>
        <p className="mt-4 text-sm text-white/55">
          Last updated: 6 November 2026
        </p>

        <div className="mt-10 space-y-8 text-sm leading-7 text-white/75">
          <section>
            <h2 className="font-serif text-xl font-semibold text-[#D4AF37]">
              About this notice
            </h2>
            <p className="mt-3">
              This notice explains how the Manisha Properties website handles
              information when you browse the site or choose to contact us.
              It describes the website's current features and third-party
              services; it is not a substitute for the privacy terms of those
              services.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#D4AF37]">
              Information you choose to share
            </h2>
            <p className="mt-3">
              The property enquiry form lets you select your requirement and
              optionally enter a preferred location and approximate budget.
              These entries remain in the page until you choose
              <strong className="text-[#F8F4E8]"> Continue on WhatsApp</strong>.
              That action opens WhatsApp with a pre-filled message addressed
              to Manisha Properties. Review it before sending. The website
              does not submit that form to a Manisha Properties website
              database.
            </p>
            <p className="mt-3">
              If you call us, send an email, or message us through WhatsApp,
              the information you provide is handled by the relevant service
              and by Manisha Properties to respond to your enquiry.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#D4AF37]">
              Website analytics
            </h2>
            <p className="mt-3">
              This website currently uses Google Analytics (measurement ID
              G-0B88R2EHR4) to understand website usage and improve the site.
              Google Analytics may use cookies or similar technologies and
              process technical and interaction information, such as pages
              viewed and device/browser information. Google's processing is
              subject to Google's own terms and privacy information.
            </p>
            <p className="mt-3">
              Learn more in Google's
              {' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FFD700] underline underline-offset-4"
              >
                Privacy Policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#D4AF37]">
              External services and links
            </h2>
            <p className="mt-3">
              The site links to YouTube, WhatsApp, Google services, and
              telephone or email applications. When you follow an external
              link, that provider's privacy practices apply. Review the
              provider's information before sharing personal details.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#D4AF37]">
              Your choices and questions
            </h2>
            <p className="mt-3">
              You can choose not to use the enquiry form or external contact
              links. You can also manage cookies through your browser
              settings; blocking some technologies may affect third-party
              features. For questions about information you have shared
              directly with Manisha Properties, contact us using the details
              below.
            </p>
            <p className="mt-3">
              Email:{' '}
              <a
                href="mailto:manishaguptaproperties@gmail.com"
                className="text-[#FFD700] underline underline-offset-4"
              >
                manishaguptaproperties@gmail.com
              </a>
              <br />
              Phone:{' '}
              <a
                href="tel:+918700204768"
                className="text-[#FFD700] underline underline-offset-4"
              >
                +91 8700204768
              </a>
            </p>
          </section>

          <p className="border-t border-white/10 pt-6 text-xs text-white/45">
            This notice reflects the website features identified on the date
            above. It does not describe any separate offline records or
            business processes that may be maintained by Manisha Properties.
          </p>
        </div>
      </article>
    </>
  );
}

export default PrivacyNotice;
