import { Poppins } from "next/font/google";
import "../globals.css";
import MegaMenu from "../../components/MegaMenu";
import { I18nProvider } from "../../components/i18n/I18nProvider";
import { getMessages, isSupportedLocale, DEFAULT_LOCALE } from "../../lib/i18n";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default async function LocaleLayout({ children, params }) {
  const localeParam = (await params)?.locale;
  const locale = isSupportedLocale(localeParam) ? localeParam : DEFAULT_LOCALE;
  const messages = getMessages(locale);

  return (
    <html lang={locale} className={`${poppins.className} ${poppins.variable}`}>
      <body className="">
        <I18nProvider locale={locale} messages={messages}>
          <MegaMenu />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
