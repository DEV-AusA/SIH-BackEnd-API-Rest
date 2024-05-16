import { config as dotenvConfig } from 'dotenv';
import MercadoPagoConfig from 'mercadopago';

dotenvConfig({ path: '.env' });

export const mercadopagoConfig = {
  client: new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
  }),
};
