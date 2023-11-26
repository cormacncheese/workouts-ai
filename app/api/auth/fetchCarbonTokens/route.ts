import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const customer_id = request.nextUrl.searchParams.get('customer_id');

  if (!customer_id) {
    return new Response('Missing customer_id', {
      status: 400
    });
  }

  try {
    const response = await fetch('https://api.carbon.ai/auth/v1/access_token', {
      headers: {
        'Content-Type': 'application/json',
        'customer-id': customer_id,
        authorization: `Bearer ${process.env.CARBON_API_KEY}`
      }
    });

    const data = await response.json();

    if (response.status === 200 && data) {
      return new Response(JSON.stringify(data), {
        status: 200
      });
    } else {
      return new Response('Failed to fetch carbon token', {
        status: 400
      });
    }
  } catch (e) {
    console.error('Error fetching carbon token: ', e);
    return new Response('Failed to fetch carbon token', {
      status: 400
    });
  }
}
