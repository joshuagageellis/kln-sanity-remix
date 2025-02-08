import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {redirect} from '@shopify/remix-oxygen';

export async function loader({params}: LoaderFunctionArgs) {
  return redirect(params?.locale ? `${params.locale}/collections/kln-designs` : '/collections/kln-designs');
}
