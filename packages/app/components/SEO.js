import Head from 'next/head';
import { useRouter } from 'next/router';
import config, { Environment } from 'utils/config';
import previewImg from 'assets/preview.png';

function domainName() {
  switch (config.ENV) {
    case Environment.Development:
      return 'https://development.graftini.xyz';
    case Environment.Production:
      return 'https://www.graftini.com';
    case Environment.Local:
    default:
      return 'http://localhost:3000';
  }
}

export default function SEO({ title, description }) {
  const expandedTitle = title ? `${title} - Graftini` : 'Graftini';

  const { pathname } = useRouter();
  const domain = domainName();
  const url = domain + pathname;
  const imageUrl = domain + previewImg.src;

  return (
    <Head>
      <title>{expandedTitle}</title>
      <meta
        name="description"
        content={
          description ?? 'Deploy your web apps without writing any code in less than 10 minutes.'
        }
      />

      <meta property="og:title" content={expandedTitle} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
    </Head>
  );
}
