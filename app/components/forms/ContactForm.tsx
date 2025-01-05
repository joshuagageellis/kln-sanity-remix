import type {ErrorMessageProps, FieldAttributes, FieldHookConfig} from 'formik';

import {useFetcher, useSubmit} from '@remix-run/react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import {useState} from 'react';
import { object, string } from 'yup';

import {cn} from '~/lib/utils';
import {contactFormSchema, contactForminitialValues, serviceTypes, serviceTypesValues} from '~/routes/contact.send';

import { Button } from '../ui/Button';
import {SliderField} from './inputs/Range';

export const labelClass = 'info-16';
export const inputRowClass = 'flex gap-2 flex-row mb-2';
export const ErrorMessageWrapper = (props: ErrorMessageProps) => <ErrorMessage {...props} render={(msg) => <span className="sr-only error">{msg}</span>} />

/**
 * @todo
 * - Possibly support file uploads
 */
export function ContactForm() {
	const fetcher = useFetcher();
	return (
		<section className="container-w-padding site-grid bg-light relative[content-visibility:auto] text-on-light">
			<div className="container col-span-full md:col-span-9 lg:col-span-7 md:col-start-2 lg:col-start-3 flex justify-center">
				<Formik
					initialValues={contactForminitialValues}
					onSubmit={async (values, actions) => {
						try {
							const response = await fetcher.submit(
								values,
								{ action: '/contact/send', method: "post", navigate: false }
							);
							if (response?.ok === true) {
								actions.setStatus('success');
							}
						} catch(e) {
							actions.setStatus('error');
							console.error('Error', e);
						}
						actions.setSubmitting(false);
					}}
					validationSchema={contactFormSchema}
				>
					{(props) => {
						return (
							<Form action='/contact' className='w-full mt-12 md:mt-20 mb-14 md:mb-24 has-required-form-fields'>
								{props.status === 'success' && (<h2 className="mb-6">Thank you for signing up!</h2>)}
								<fieldset disabled={props.status === 'success'}>
									<div className={cn(inputRowClass)}>
										<div className='grow basis-1/2'>
											<label className={cn(labelClass)} htmlFor="firstName">First Name</label>
											<Field className="default-input default-input--dark" name="firstName" required type="text" />
											<ErrorMessageWrapper name="firstName" />
										</div>
										<div className='grow basis-1/2'>
											<label className={cn(labelClass)} htmlFor="lastName">Last Name</label>
											<Field className="default-input default-input--dark" name="lastName" required type="text" />
											<ErrorMessageWrapper name="lastName" />
										</div>
									</div>
									<div className={cn(inputRowClass)}>
										<div className='grow'>
											<label className={cn(labelClass)} htmlFor="email">Email</label>
											<Field className="default-input default-input--dark" name="email" required type="text" />
											<ErrorMessageWrapper name="email" />
										</div>
									</div>
									<div className={cn(inputRowClass)}>
										<div className='grow'>
											<label className={cn(labelClass)} htmlFor="phoneNumber">Phone Number</label>
											<Field className="default-input default-input--dark" name="phoneNumber" type="text" />
											<ErrorMessageWrapper name="phoneNumber" />
										</div>
									</div>
									<div className={cn(inputRowClass)}>
										<div className='grow'>
											<label className={cn(labelClass)} htmlFor="projectBrief">Project Description</label>
											<Field as="textarea" className="default-input default-input--dark" name="projectBrief" required rows="4" type="text" />
											<ErrorMessageWrapper name="projectBrief" />
										</div>
									</div>
									<div className={cn(inputRowClass)}>
										<div className='grow'>
											<SliderField label="Timeline" max={6} min={1} name="timeline" postFix='Months' step={1} unlimited />
										</div>
									</div>
									<div className={cn(inputRowClass)}>
										<div className='grow'>
											<SliderField currency label="Budget" max={100000} min={5000} name="budget" step={5000} unlimited />
										</div>
									</div>
									<div className={cn(inputRowClass)}>
										<div className='grow'>
											<label className={cn(labelClass)} htmlFor="serviceType">Type of Service</label>
											<Field as="select" className="default-input default-input--dark" name="serviceType">
												<option value="">Select a service type</option>
												{serviceTypesValues.map((type) => (
													<option key={type} value={type}>{type}</option>
												))}
											</Field>
											<ErrorMessageWrapper name="serviceType" />
										</div>
									</div>
									<div className={cn(inputRowClass)}>
										<Button className="w-full h-[48px] md:h-[60px]" onClick={(e) => {
											e.preventDefault();
											props.submitForm();
										}
										} size="lg" type="submit" variant="default">Submit</Button>
										{props.status === 'error' && (<span className="mt-2 info-16 text-salsa">
											There was an error submitting the form. Please review and try again.
										</span>)}
									</div>
									<div className={cn(inputRowClass)}>
										<div className={cn(inputRowClass)}>
											<Button onClick={(e) => {
												e.preventDefault();
												props.resetForm();
											}} size="sm" variant="link" >Reset</Button>
										</div>
									</div>
								</fieldset>
							</Form>
						)	
					}}
				</Formik>
			</div>
		</section>
	)
}