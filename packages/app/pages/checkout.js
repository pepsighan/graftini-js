import { Box } from '@material-ui/system';
import SEO from 'components/SEO';
import Script from 'next/script';
import { useEffect } from 'react';

export default function Checkout() {
  useEffect(() => {
    const Paddle = global.Paddle;
    Paddle.Environment.set('sandbox');
    Paddle.Setup({ vendor: 2834 });

    Paddle.Checkout.open({
      method: 'inline',
      product: 14500, // This is the subscription Plan ID.
      allowQuantity: true,
      disableLogout: true,
      frameTarget: 'checkout-container',
      frameInitialHeight: 416,
      frameStyle: 'width:100%; min-width:312px; background-color: transparent; border: none;',
    });
  }, []);

  return (
    <>
      <SEO title="Checkout" />
      <Script src="https://cdn.paddle.com/paddle/paddle.js" strategy="beforeInteractive" />

      <Box className="checkout-container" />
    </>
  );
}
