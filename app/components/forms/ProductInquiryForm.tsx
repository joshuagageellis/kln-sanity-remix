import type {ProductVariant} from '@shopify/hydrogen/storefront-api-types';
import type {ErrorMessageProps} from 'formik';
import type {PartialDeep} from 'type-fest';

import {useLocation} from '@remix-run/react';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import {AnimatePresence, m} from 'framer-motion';
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
	selectedVariant: PartialDeep<ProductVariant>,
}) {
	const [isOpen, setIsOpen] = useState(false);
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
			{({isSubmitting, status, submitForm}) => (
				<Form className="grid gap-4 mt-4">
					{status === 'success' ? (
						<div className="text-charcoal py-6">
							<h3 className="h5 mb-4">Thank you for your inquiry!</h3>
							<p>We'll get back to you soon about <em>{selectedVariant.product?.title}</em>.</p>
						</div>
					) : (
						<>
							<AnimatePresence>
								{isOpen && (
									<m.div
										animate={{height: 'auto', opacity: 1}}
										className="grid gap-3 overflow-hidden"
										exit={{height: 0, opacity: 0}}
										initial={{height: 0, opacity: 0}}
										transition={{duration: 0.3}}
									>
										<div>
											<label className="info-16 mb-1 block" htmlFor="name">
												Name
											</label>
											<Field
												className="w-full default-input default-input--dark"
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
												className="w-full default-input default-input--dark"
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
												className="w-full default-input default-input--dark"
												name="note"
												rows={4}
											/>
											<ErrorMessageWrapper name="note" />
										</div>
									</m.div>
								)}
							</AnimatePresence>

							<Button
								className=""
								disabled={isSubmitting}
								onClick={(e) => {
									e.preventDefault();
									if (!isOpen) {
										setIsOpen(true);
									} else {
										submitForm();
									}
								}}
								type="submit"
								variant="default"
							>
								{isSubmitting ? 'Sending...' : (
									<>
										{isOpen ? 'Send Request' : 'Made to Order Request'}
									</>
								)}
							</Button>

							{status === 'error' && (
								<p className="text-salsa">
									There was an error sending your inquiry. Please try again.
								</p>
							)}
						</>
					)}
				</Form>
			)}
		</Formik>
	);
}