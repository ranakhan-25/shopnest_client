import Link from "next/link";

type Social = {
  name: string;
  href: string;
};

type FooterSocialLinksProps = {
  supportLinks: Social[];
  quickLinks: Social[];
};

const FooterSocialLinks = ({
  supportLinks,
  quickLinks,
}: FooterSocialLinksProps) => {
  return (
    <>
      {/* Quick Links */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
          Quick Links
        </h3>

        <ul className="mt-5 space-y-3">
          {quickLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className="text-sm text-gray-600 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Support */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
          Support
        </h3>

        <ul className="mt-5 space-y-3">
          {supportLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className="text-sm text-gray-600 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default FooterSocialLinks;
