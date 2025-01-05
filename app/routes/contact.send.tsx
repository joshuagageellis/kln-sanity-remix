import type {ActionFunctionArgs} from '@shopify/remix-oxygen';
import type { InferType } from 'yup';

import {json} from '@shopify/remix-oxygen';
import {ValidationError, number, object, string, tuple } from 'yup';

export const serviceTypes = {
	cnc: 'CNC',
	design_fabrication: 'Design & Fabrication',
	get_our_products: 'Get our Products',
	other: 'Other (I don’t know)',
}

export const serviceTypesValues = Object.values(serviceTypes)

export const deliveryOptions = {
	inperson: 'Delivery/Installation',
	pickup: 'Pickup',
}

export const deliveryOptionsValues = Object.values(deliveryOptions)

export const contactForminitialValues = {
	addressLine1: '',
	addressLine2: '',
	budget: [15000, 30000],
	city: '',
	country: 'United States',
	delivery: '',
	email: '',
	firstName: '',
	lastName: '',
	links: '',
	phoneNumber: '',
	projectBrief: '',
	serviceType: '',
	state: '',
	timeline: [1, 3],
	zip: '',
}

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const submissionEmailFormat = (data: ContactForm) => {
	return `
		First Name: ${data.firstName}\n
		Last Name: ${data.lastName}\n
		Email: ${data.email}\n
		Phone: ${data.phoneNumber}\n
		Timeline: ${data.timeline}\n
		Budget: ${data.budget}\n
		Service Type: ${data.serviceType}\n
		Project Brief: ${data.projectBrief}\n
	`
}

export const contactFormSchema = object({
	addressLine1: string().when('delivery', {
		is: deliveryOptions.inperson,
		then: (schema) => schema.required('Primary address is required')
	}),
	addressLine2: string(),
	budget: tuple([
		number(),
		number()
	]),
	city: string().when('delivery', {
		is: deliveryOptions.inperson,
		then: (schema) => schema.required('City is required')
	}),
	country: string().when('delivery', {
		is: deliveryOptions.inperson,
		then: (schema) => schema.required('Country is required')
	}),
	delivery: string().oneOf(deliveryOptionsValues).required('Delivery option is required'),
	email: string().email().required(
		'Email is required'
	),
	firstName: string().required(
		'First name is required'
	),
	lastName: string().required(
		'Last name is required'
	),
	links: string().when('serviceType', {
		is: serviceTypes.cnc,
		then: (schema) => schema.required('Please provide links to your files')
	}).when('serviceType', {
		is: serviceTypes.design_fabrication,
		then: (schema) => schema.required('Please provide links to your files')
	}),
	phoneNumber: string().matches(phoneRegExp, 'Phone number is not valid'),
	projectBrief: string().required(
		'Project brief is required'
	),
	serviceType: string().oneOf(serviceTypesValues).required(
		'Service type is required'
	),
	state: string().when('delivery', {
		is: deliveryOptions.inperson,
		then: (schema) => schema.required('State is required')
	}),
	timeline: tuple([
		number(),
		number()
	]),
	zip: string().when('delivery', {
		is: deliveryOptions.inperson,
		then: (schema) => schema.required('Zip is required')
	})
});

export interface ContactForm extends InferType<typeof contactFormSchema>{}

export async function action({context, request}: ActionFunctionArgs) {
	const SENDGRID_API_KEY = context.env.SENDGRID_API_KEY;
	const SENDGRID_FROM_EMAIL = context.env.SENDGRID_FROM_EMAIL;

	const formData = await request.formData();
	let validData = contactForminitialValues as ContactForm;
	for (const entry of formData.entries()) {
		validData = {
			...validData,
			[entry[0]]: entry[1]
		}
	}

	// Validate data.
	try {
		validData = await contactFormSchema.validate(
			validData,
			{
				abortEarly: true,
				stripUnknown: true,
			}
		);
	} catch(e: ValidationError | any) {
		if (e instanceof ValidationError) {
			return json({ error: e.errors, ok: false }, { status: 400 });
		}
	}

	// Send email.
	try {
		// throw new Error('Error sending email');

		if (!SENDGRID_API_KEY || !SENDGRID_FROM_EMAIL) {
			throw new Error('Missing SendGrid API key or from email');
		}

		const request = new Request( "https://api.sendgrid.com/v3/mail/send" );
		const response = await fetch( request, {
			body: JSON.stringify({
				content: [
					{
						type: "text/plain",
						value: submissionEmailFormat(validData),
					},
				],
				from: {
					email: SENDGRID_FROM_EMAIL,
					name: "KLN Studios",
				},
				personalizations: [
					{
						to: [ { email: SENDGRID_FROM_EMAIL } ],
					},
				],
				reply_to: { email: SENDGRID_FROM_EMAIL },
				subject: `Website Inquiry: ${validData.firstName} ${validData.lastName}`,
			}),
			headers: {
				Authorization: `Bearer ${SENDGRID_API_KEY}`,
				"Content-Type": "application/json",
			},
			method: "POST",
		});

		if (response.ok) {
			return json({ ok: true }, { status: 200 });
		} else {
			const r = await response.json();
			console.error('Error sending email', JSON.stringify(r, null, 4));
			throw new Error('Error sending email');
		}
	} catch(e) {
		console.error('Error sending email', e);
		return json({ error: ['403 Forbidden error'], ok: true }, { status: 403 });	
	}
}

export async function loader() {
	throw new Response(null, {
		status: 404,
		statusText: 'Not Found',
	});
}