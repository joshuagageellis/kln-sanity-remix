import type {ActionFunctionArgs} from '@shopify/remix-oxygen';
import type {InferType} from 'yup';

import {json} from '@shopify/remix-oxygen';
import {renderToString} from 'react-dom/server';
import {object, string} from 'yup';

const submissionEmailFormat = (data: ProductInquiryForm) =>
  renderToString(
    <div>
      <div>
        <h1>New Product Inquiry</h1>
        <div>
          <h2>Contact Details</h2>
          <p>Name: {data.name}</p>
          <p>Email: {data.email}</p>
          <p>Product URL: {data.productLink}</p>
          <p>Product ID: {data.productId}</p>
          {data.note && <p>Note: {data.note}</p>}
        </div>
      </div>
    </div>,
  );

export const productInquirySchema = object().shape({
  email: string().email('Invalid email').required('Email is required'),
  name: string().required('Name is required'),
  note: string(),
  productId: string().required('Product ID is required'),
  productLink: string().required('Product link is required'),
});

export interface ProductInquiryForm extends InferType<typeof productInquirySchema> {}

export async function action({context, request}: ActionFunctionArgs) {
  const SENDGRID_API_KEY = context.env.SENDGRID_API_KEY;
  const SENDGRID_FROM_EMAIL = context.env.SENDGRID_FROM_EMAIL;

  // Validate data
  const data = await request.json();
  try {
    const validData = await productInquirySchema.validate(data, {
      abortEarly: true,
      stripUnknown: true,
    });

    // Send email
    if (!SENDGRID_API_KEY || !SENDGRID_FROM_EMAIL) {
      throw new Error('Missing SendGrid API key or from email');
    }

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      body: JSON.stringify({
        content: [
          {
            type: 'text/html',
            value: submissionEmailFormat(validData),
          },
        ],
        from: {
          email: SENDGRID_FROM_EMAIL,
          name: 'Product Inquiry',
        },
        personalizations: [
          {
            to: [{email: SENDGRID_FROM_EMAIL}],
          },
        ],
        reply_to: {email: validData.email},
        subject: `Product Inquiry from ${validData.name}`,
      }),
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (response.ok) {
      return json({ok: true}, {status: 200});
    } else {
      throw new Error('Error sending email');
    }
  } catch (e: any) {
    return json(
      {error: e.errors || ['An error occurred'], ok: false},
      {status: 400},
    );
  }
}

export async function loader() {
  throw new Response(null, {
    status: 404,
    statusText: 'Not Found',
  });
} 