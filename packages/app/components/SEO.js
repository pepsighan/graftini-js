import Head from 'next/head';

// TODO: Add open graph meta properties and twitter properties.
export default function SEO({ title, description }) {
  return (
    <Head>
      <title>{title ? `${title} - Graftini` : 'Graftini'}</title>
      <meta
        name="description"
        content={
          description ?? 'Deploy your web apps without writing any code in less than 10 minutes.'
        }
      />
    </Head>
  );
}
