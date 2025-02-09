import type {ProductVariant} from '@shopify/hydrogen/storefront-api-types';
import type {ErrorMessageProps} from 'formik';
import type {PartialDeep} from 'type-fest';

import {ErrorMessage, Field, Form, Formik} from 'formik';
import {useEffect, useState} from 'react';

import {Button} from '~/components/ui/Button';

import {productInquirySchema} from '../../routes/products.inquiry.send';

const ErrorMessageWrapper = (props: ErrorMessageProps) => (
  <ErrorMessage
    {...props}
    render={(msg) => <span className="error sr-only">{msg}</span>}
  />
);

export function ProductInquiryForm({
  selectedVariant,
}: {
  selectedVariant: PartialDeep<ProductVariant>;
}) {
  const [productLink, setProductLink] = useState('');

  useEffect(() => {
    if (window?.location) {
      setProductLink(window.location.href);
    }
  }, []);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        email: '',
        name: '',
        note: '',
        productId: selectedVariant.id,
        productLink,
        productTitle: selectedVariant.product?.title,
        variantTitle: selectedVariant.title,
      }}
      onSubmit={async (values, actions) => {
        try {
          const response = await fetch('/products/inquiry/send', {
            body: JSON.stringify({
              ...values,
              productLink,
            }),
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            method: 'POST',
          });
          if (response?.ok) {
            actions.setStatus('success');
          }
        } catch (e) {
          actions.setStatus('error');
          console.error('Error', e);
        }
        actions.setSubmitting(false);
      }}
      validationSchema={productInquirySchema}
    >
      {({isSubmitting, status}) => (
        <Form className="mt-4 grid gap-4">
          {status === 'success' ? (
            <div className="py-6 text-charcoal">
              <h3 className="h5 mb-4">Thank you for your inquiry!</h3>
              <p className='body-20'>
                We'll get back to you soon about{' '}
                <em>{selectedVariant.product?.title}</em>.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 ">
							<div>
								<p className='h4 text-pretty'>Our made to order products are personally handled. Please send us a message and we will follow up via email.</p>
							</div>
              <div>
                <label className="info-16 mb-1 block" htmlFor="name">
                  Name
                </label>
                <Field
                  className="default-input default-input--dark w-full"
                  name="name"
                  type="text"
                />
                <ErrorMessageWrapper name="name" />
              </div>

              <div>
                <label className="info-16 mb-1 block" htmlFor="email">
                  Email
                </label>
                <Field
                  className="default-input default-input--dark w-full"
                  name="email"
                  type="email"
                />
                <ErrorMessageWrapper name="email" />
              </div>

              <div>
                <label className="info-16 mb-1 block" htmlFor="note">
                  Message (Optional)
                </label>
                <Field
                  as="textarea"
                  className="default-input default-input--dark w-full"
                  name="note"
                  rows={4}
                />
                <ErrorMessageWrapper name="note" />
              </div>
              <Button
                className=""
                disabled={isSubmitting}
                type="submit"
                variant="default"
              >
                {isSubmitting ? (
                  'Sending...'
                ) : (
                  'Send Request'
                )}
              </Button>

              {status === 'error' && (
                <p className="text-salsa">
                  There was an error sending your inquiry. Please try again.
                </p>
              )}
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
}
