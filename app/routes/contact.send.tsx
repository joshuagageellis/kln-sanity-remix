import type {ActionFunctionArgs} from '@shopify/remix-oxygen';
import type {InferType} from 'yup';

import {json} from '@shopify/remix-oxygen';
import {renderToString} from 'react-dom/server';
import {ValidationError, number, object, string, tuple} from 'yup';

export const serviceTypes = {
  cnc: 'CNC',
  design_fabrication: 'Design & Fabrication',
  get_our_products: 'Get our Products',
  other: 'Other (I don’t know)',
};

export const serviceTypesValues = Object.values(serviceTypes);

export const deliveryOptions = {
  inperson: 'Delivery/Installation',
  pickup: 'Pickup',
};

export const deliveryOptionsValues = Object.values(deliveryOptions);

export const contactFormInitialValues = {
  addressLine1: '',
  addressLine2: '',
  budget: [100, 5000],
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
  timeline: [3, 6],
  zip: '',
};

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const splitString = (str: string, id: string) => str.split('\n').map((str, index) => <p key={`${index}-${id}`}>{str}</p>);

const submissionEmailFormat = (data: ContactForm) =>
  renderToString(
    <div>
      <div>
        <h1>New Website Inquiry, RE: {data.serviceType}</h1>
				<div>
					<h2>Contact</h2>
					<p>Name: {data.firstName} {data.lastName}</p>
					<p>Email: {data.email}</p>
					{data.phoneNumber && <p>Phone: {data.phoneNumber}</p>}
				</div>
				{data.serviceType === serviceTypes.design_fabrication || data.serviceType === serviceTypes.cnc ? (
					<>
						<div>
							<h2>Project Details</h2>
							<p>Service Type: {data.serviceType}</p>
							<p>Project Brief: {splitString(data.projectBrief, 'brief')}</p>
							{data.links && <p>Links: {splitString(data.links, 'links')}</p>}
							{data.timeline && data.timeline.length > 2 && <p>Timeline: {data.timeline[0]} - {data.timeline[1]} months</p>}
							{data.budget && data.budget.length > 2 && <p>Budget: ${data.budget[0]} - {data.budget[1]}</p>}
						</div>
						<div>
							<h2>Delivery & Pickup Options</h2>
							<p>Delivery: {data.delivery}</p>
							{data.delivery === deliveryOptions.inperson && (
								<>
									<p>Address: {data.addressLine1}</p>
									<p>Address 2: {data.addressLine2}</p>
									<p>City: {data.city}</p>
									<p>State: {data.state}</p>
									<p>Zip: {data.zip}</p>
									<p>Country: {data.country}</p>
								</>
							)}
						</div>
					</>
				) : (
					<div>
						<h2>Service Type</h2>
						<p>Service Type: {data.serviceType}</p>
						<p>Details: {splitString(data.projectBrief, 'brief')}</p>
					</div>
				)}				
      </div>
    </div>,
  );

export const contactFormSchema = object().shape(
  {
    addressLine1: string().when('delivery', {
      is: deliveryOptions.inperson,
      otherwise: (schema) => schema.nullable(),
      then: (schema) => schema.required('Primary address is required'),
    }),
    addressLine2: string(),
    budget: tuple([number().required(), number().required()]),
    city: string().when('delivery', {
      is: deliveryOptions.inperson,
      otherwise: (schema) => schema.nullable(),
      then: (schema) => schema.required('City is required'),
    }),
    country: string().when('delivery', {
      is: deliveryOptions.inperson,
      otherwise: (schema) => schema.nullable(),
      then: (schema) => schema.required('Country is required'),
    }),
    delivery: string().when('serviceType', {
			is: serviceTypes.cnc,
			otherwise: (schema) => schema.nullable().notRequired(),
			then: (schema) => schema.required('Delivery type is required'),
		})
		.when('serviceType', {
			is: serviceTypes.design_fabrication,
			otherwise: (schema) => schema.nullable().notRequired(),
			then: (schema) => schema.required('Delivery type is required'),
		}),
    email: string().email().required('Email is required'),
    firstName: string().required('First name is required'),
    lastName: string().required('Last name is required'),
    links: string()
      .when('serviceType', {
        is: serviceTypes.cnc,
        otherwise: (schema) => schema.nullable().notRequired(),
        then: (schema) => schema.required('Please provide links to your files'),
      })
      .when('serviceType', {
        is: serviceTypes.design_fabrication,
        otherwise: (schema) => schema.nullable().notRequired(),
        then: (schema) => schema.required('Please provide links to your files'),
      }),
    phoneNumber: string().when('phoneNumber', {
      is: (phoneNumber: string) => phoneNumber !== '',
      otherwise: (schema) => schema.nullable(),
      then: (schema) =>
        schema.matches(phoneRegExp, 'Phone number is not valid'),
    }),
    projectBrief: string().required('Project brief is required'),
    serviceType: string()
      .oneOf(serviceTypesValues)
      .required('Service type is required'),
    state: string().when('delivery', {
      is: deliveryOptions.inperson,
      otherwise: (schema) => schema.notRequired(),
      then: (schema) => schema.required('State is required'),
    }),
    timeline: tuple([number().required(), number().required()]),
    zip: string().when('delivery', {
      is: deliveryOptions.inperson,
      otherwise: (schema) => schema.notRequired(),
      then: (schema) => schema.required('Zip is required'),
    }),
  },
  [
    // Allow empty phone number.
    ['phoneNumber', 'phoneNumber'],
  ],
);

export interface ContactForm extends InferType<typeof contactFormSchema> {}

export async function action({context, request}: ActionFunctionArgs) {
  const SENDGRID_API_KEY = context.env.SENDGRID_API_KEY;
  const SENDGRID_FROM_EMAIL = context.env.SENDGRID_FROM_EMAIL;

  // Validate data.
  const data = await request.json();
  let validData = contactForminitialValues as ContactForm;
  try {
    validData = await contactFormSchema.validate(data, {
      abortEarly: true,
      stripUnknown: true,
    });
  } catch (e: ValidationError | any) {
    if (e instanceof ValidationError) {
      console.error('Error validating form', e.errors);
      return json({error: e.errors, ok: false}, {status: 400});
    }
  }

  // Send email.
  try {
    if (!SENDGRID_API_KEY || !SENDGRID_FROM_EMAIL) {
      throw new Error('Missing SendGrid API key or from email');
    }

    const request = new Request('https://api.sendgrid.com/v3/mail/send');
    const response = await fetch(request, {
      body: JSON.stringify({
        content: [
          {
            type: 'text/html',
            value: submissionEmailFormat(validData),
          },
        ],
        from: {
          email: SENDGRID_FROM_EMAIL,
          name: 'KLN Studios',
        },
        personalizations: [
          {
            to: [{email: SENDGRID_FROM_EMAIL}],
          },
        ],
        reply_to: {email: SENDGRID_FROM_EMAIL},
        subject: `Website Inquiry: ${validData.firstName} ${validData.lastName}, RE: ${validData.serviceType}`,
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
      const r = await response.json();
      throw new Error('Error sending email');
    }
  } catch (e) {
    return json({error: ['403 Forbidden error'], ok: true}, {status: 403});
  }
}

export async function loader() {
  throw new Response(null, {
    status: 404,
    statusText: 'Not Found',
  });
}
