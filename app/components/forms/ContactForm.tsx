import type {ErrorMessageProps} from 'formik';
import type {HTMLMotionProps} from 'framer-motion';

import { ErrorMessage, Field, Form, Formik } from 'formik';
import {AnimatePresence, m} from 'framer-motion';
import {useRef} from 'react';

import {cn} from '~/lib/utils';
import {contactFormSchema, contactForminitialValues, deliveryOptions, deliveryOptionsValues, serviceTypes, serviceTypesValues} from '~/routes/contact.send';

import { Button } from '../ui/Button';
import {SliderField} from './inputs/Range';

export const labelClass = 'info-16 mb-2 block';
export const inputRowClass = 'flex gap-2 flex-row mb-4';
export const ErrorMessageWrapper = (props: ErrorMessageProps) => <ErrorMessage {...props} render={(msg) => <span className="sr-only error">{msg}</span>} />

export const Collapsible = ({children, open = false, ...rest}: {
	children: React.ReactNode,
	open?: boolean,
} & HTMLMotionProps<"div">) => {
	return (
		<AnimatePresence>
			{open && (
				<m.div {...rest}>
					{children}
				</m.div>
			)}
		</AnimatePresence>
	)
}

/**
 * @todo
 * - Possibly support file uploads
 */
export function ContactForm() {
	const formRef = useRef<HTMLFormElement>(null);
	return (
		<section className="container-w-padding site-grid bg-light relative[content-visibility:auto] text-on-light">
			<div className="container col-span-full md:col-span-9 lg:col-span-7 md:col-start-2 lg:col-start-3 flex justify-center">
				<Formik
					initialValues={contactForminitialValues}
					onSubmit={async (values, actions) => {
						try {
							const response = await fetch('/contact/send', {
								body: JSON.stringify(values),
								headers: {
									'Accept': 'application/json',
									'Content-Type': 'application/json',
								},
								method: 'POST',
							});
							if (response?.ok === true) {
								actions.setStatus('success');
								setTimeout(() => {
									window.scrollTo({ behavior: 'smooth', top: formRef?.current?.offsetTop ?? 0});
								}, 100);
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
							<Form action='/contact' className='w-full mt-12 md:mt-20 mb-14 md:mb-24' ref={formRef}>
								<AnimatePresence>
									<Collapsible
										animate={{ height: 'auto', opacity: 1 }}
										className='overflow-y-hidden'
										exit={{ height: 0, opacity: 0 }}
										initial={{ height: 0, opacity: 0 }}
										key="contact-thank-you"
										open={props.status === 'success'}
									>
										<div className="min-h-52">
											<h2 className="mb-6">Thank you for reaching out!</h2>
											<p>We've received your information and will be in touch soon.</p>
										</div>
									</Collapsible>
									<Collapsible
										exit={{ height: 0, opacity: 0 }}
										initial={{ height: 'auto', opacity: 1 }}
										key="contact-fields"
										open={props.status !== 'success'}
									>
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
												<div className='grow'>
													<label className={cn(labelClass)} htmlFor="projectBrief">Details
														<Collapsible
															animate={{ height: 'auto', opacity: 1 }}
															className='block info-14 overflow-hidden'
															exit={{ height: 0, opacity: 0 }}
															initial={{ height: 0, opacity: 0 }}
															open={props.values.serviceType === serviceTypes.cnc}
														>
															Please provide a brief description of the project along with any supporting details, such as quantities, materials, material thicknesses, etc.
														</Collapsible>
														<Collapsible
															animate={{ height: 'auto', opacity: 1 }}
															className='block info-14 overflow-hidden'
															exit={{ height: 0, opacity: 0 }}
															initial={{ height: 0, opacity: 0 }}
															open={props.values.serviceType === serviceTypes.design_fabrication}
														>
															Please provide a brief description of the project along with any supporting details, including where you are in the design process.
														</Collapsible>
													</label>
													<Field as="textarea" className="default-input default-input--dark" name="projectBrief" required rows="4" type="text" />
													<ErrorMessageWrapper name="projectBrief" />
												</div>
											</div>
											<Collapsible
												animate={{ height: 'auto', opacity: 1 }}
												className='overflow-y-hidden'
												exit={{ height: 0, opacity: 0 }}
												initial={{ height: 0, opacity: 0 }}
												key="contact-links"
												open={props.values.serviceType === serviceTypes.cnc || props.values.serviceType === serviceTypes.design_fabrication}
											>
												<div className={cn(inputRowClass)}>
													<div className='grow'>
														<label className={cn(labelClass)} htmlFor="links">
															Design File Links*
															<br />
															<span className="info-14"> Pease provide links to any current design files or reference images via Dropbox, GDrive, or another file hosting service.</span>
														</label>
														<Field as="textarea" className="default-input default-input--dark" name="links" required rows="4" type="text" />
														<ErrorMessageWrapper name="links" />
													</div>
												</div>
												<div className={cn(inputRowClass)} key="contact-timeline">
													<div className='grow'>
														<SliderField label="Timeline" max={6} min={1} name="timeline" postFix='Months' step={1} unlimited />
													</div>
												</div>
												<div className={cn(inputRowClass)} key="contact-budget">
													<div className='grow'>
														<SliderField currency label="Budget" max={100000} min={5000} name="budget" step={5000} unlimited />
													</div>
												</div>
												<div className={cn(inputRowClass)}>
													<div className='grow'>
														<label className={cn(labelClass)} htmlFor="delivery">Type of Service</label>
														<Field as="select" className="default-input default-input--dark" name="delivery">
															<option value="">Select a delivery option</option>
															{deliveryOptionsValues.map((type) => (
																<option key={type} value={type}>{type}</option>
															))}
														</Field>
														<ErrorMessageWrapper name="delivery" />
													</div>
												</div>
												<Collapsible
													animate={{ height: 'auto', opacity: 1 }}
													className='overflow-y-hidden'
													exit={{ height: 0, opacity: 0 }}
													initial={{ height: 0, opacity: 0 }}
													key="contact-address"
													open={props.values.delivery === deliveryOptions.inperson}
												>
													<div className={cn(inputRowClass)}>
														<div className='grow'>
															<label className={cn(labelClass)} htmlFor="addressLine1">Address</label>
															<Field className="default-input default-input--dark" name="addressLine1" required type="text" />
															<ErrorMessageWrapper name="addressLine1" />
														</div>
													</div>
													<div className={cn(inputRowClass)}>
														<div className='grow'>
															<label className={cn(labelClass)} htmlFor="addressLine2">Apt/Unit</label>
															<Field className="default-input default-input--dark" name="addressLine2" type="text" />
															<ErrorMessageWrapper name="addressLine2" />
														</div>
													</div>
													<div className={cn(inputRowClass)}>
														<div className='grow basis-1/2'>
															<label className={cn(labelClass)} htmlFor="city">City</label>
															<Field className="default-input default-input--dark" name="city" required type="text" />
															<ErrorMessageWrapper name="city" />
														</div>
														<div className='grow basis-1/2'>
															<label className={cn(labelClass)} htmlFor="state">State</label>
															<Field className="default-input default-input--dark" name="state" required type="text" />
															<ErrorMessageWrapper name="state" />
														</div>
													</div>
													<div className={cn(inputRowClass)}>
														<div className='grow basis-1/2'>
															<label className={cn(labelClass)} htmlFor="zip">Zip</label>
															<Field className="default-input default-input--dark" name="zip" required type="text" />
															<ErrorMessageWrapper name="zip" />
														</div>
														<div className='grow basis-1/2'>
															<label className={cn(labelClass)} htmlFor="country">Country</label>
															<Field className="default-input default-input--dark" name="country" required type="text" />
															<ErrorMessageWrapper name="country" />
														</div>
													</div>
												</Collapsible>
												<Collapsible
													animate={{ height: 'auto', opacity: 1 }}
													className='overflow-y-hidden'
													exit={{ height: 0, opacity: 0 }}
													initial={{ height: 0, opacity: 0 }}
													key="contact-pickup"
													open={props.values.delivery === deliveryOptions.pickup}
												>
													<div className={cn(inputRowClass)}>
														<p className="info-16">Pick up occurs from our East Williamsburg shop location @ 79 Grattan St, Brooklyn, NY 11237.</p>
													</div>
												</Collapsible>
											</Collapsible>
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
														setTimeout(() => {
															window.scrollTo({ behavior: 'smooth', top: 0});
														}, 100);
													}} size="sm" variant="link" >Reset</Button>
												</div>
											</div>
										</fieldset>
									</Collapsible>
								</AnimatePresence>
							</Form>
						)	
					}}
				</Formik>
			</div>
		</section>
	)
}