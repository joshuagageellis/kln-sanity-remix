import { ErrorMessage, Field, Form, Formik } from 'formik';
import jsonp from 'jsonp';
import {useState} from 'react';
import { object, string } from 'yup';

import {wrapLines} from '~/lib/formatters';

import { Button } from '../ui/Button';

/**
 * Hidden input name for Mailchimp form.
 * Pass with no value attached.
 */
const MC_ID_HIDDEN_INPUT = 'b_f996df88b435fb64d8d6f2e5e_c6e273f93a';

/**
 * Mailchimp form action url.
 */
const MC_ACTION_URL = 'https://nyc.us22.list-manage.com/subscribe/post-json?u=f996df88b435fb64d8d6f2e5e&amp;id=c6e273f93a&amp;f_id=0031d2e1f0';

const mcSchema =  object({
	EMAIL: string().email().required(),
	FNAME: string().required(),
	LNAME: string().required(),
});

export function MailchimpForm({
	title = ''
}: {
	title?: null|string;
}) {
	const [inFlight, setInFlight] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [status, setStatus] = useState<
		'' | 'duplicate' | 'error' | 'idle' | 'success'
	>('');

	return (
		<>
			<Formik
				initialValues={{
					EMAIL: '',
					FNAME: '',
					LNAME: '',
				}}
				onSubmit={(values) => {
					let fValues = Object.keys(values).map(field => {
						return `${field}=${encodeURIComponent(values[field as keyof typeof values])}`;
					}).join("&");
					fValues += `&${MC_ID_HIDDEN_INPUT}`;
					const url = `${MC_ACTION_URL}&${fValues}`;
					setInFlight(true);
					jsonp(url, { param: "c" }, (err, data) => {
						if (data.msg.includes("already subscribed")) {
							setStatus('duplicate');
						} else if (err) {
							setStatus('error');
						} else if (data.result !== 'success') {
							setStatus('error');
						} else {
							setStatus('success');
						}
						setSubmitted(true);
						setInFlight(false);
					});
				}}
				validationSchema={mcSchema}
			>
				{!inFlight ? (
					<>
						{status === 'success'  && submitted ? <p>Thank you for signing up!</p> : (
							<Form action={MC_ACTION_URL}>
								{title && <h2 className="body-20 mb-4 md:mb-6 text-balance">{wrapLines(title)}</h2>}
								<div className="flex gap-2 flex-row mb-2">
									<div className="grow">
										<Field className="default-input" name="FNAME" placeholder="First Name" type="text" />
									</div>
									<div className="grow">
										<Field className="default-input" name="LNAME" placeholder="Last Name" type="text" />
									</div>
								</div>
								<div className="flex flex-col md:flex-row gap-2">
									<div className="md:basis-2/3">
										<Field className="default-input" name="EMAIL" placeholder="Email" type="email"/>
									</div>
									<div className="grow">
										<Button className="w-full h-[48px] md:h-[60px]" size="lg" type="submit" variant="default">Submit</Button>
									</div>
								</div>
								<div className="flex flex-col gap-2 mt-2 info-16 text-salsa">
									<ErrorMessage name="FNAME" render={msg => <span>{msg.replaceAll('FNAME', 'First Name')}</span>} />
									<ErrorMessage name="LNAME" render={msg => <span>{msg.replaceAll('LNAME', 'Last Name')}</span>} />
									<ErrorMessage name="EMAIL" render={msg => <span>{msg.replaceAll('EMAIL', 'Email')}</span>} />
									{status !== 'success' && submitted && (
										<span>
											{status === 'duplicate'
												? 'You are already subscribed.'
												: 'An error occurred. Please try again later.'}
											{status === 'error' && 'An error occurred. Please try again later.'}
										</span>
									)}
								</div>
							</Form>
						)}
					</>
				) : (
					<p>Submitting...</p>
				)}
			</Formik>
		</>
	)
}