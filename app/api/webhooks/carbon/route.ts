import { updateFileLinkStatus } from '@/app/api/actions/files';

type StatusType =
  | 'FILE_READY'
  | 'FILE_ERROR'
  | 'FILE_DELETED'
  | 'RATE_LIMIT_ERROR';

// see: https://api.carbon.ai/redoc#tag/Webhooks
export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('Carbon-Signature') as string;
  const webhookSecret = process.env.CARBON_WEBHOOK_SECRET;

  console.log('Carbon webhook body:: ', body);

  try {
    const responseBody = JSON.parse(body);

    const payload = JSON.parse(responseBody.payload);

    console.log('payload:: ', payload);

    const type: StatusType = payload.webhook_type;

    console.log('type:: ', type);

    const objectId = payload.obj.object_id;
    const customerId = payload.customer_id;

    const translatedStatuses = {
      FILE_READY: 'Ready',
      FILE_ERROR: 'Error',
      FILE_DELETED: 'Deleted',
      RATE_LIMIT_ERROR: 'Rate-limit-error'
    };

    const fileUpdateTypes = [
      'FILE_READY',
      'FILE_ERROR',
      'FILE_DELETED',
      'RATE_LIMIT_ERROR'
    ];

    if (objectId && fileUpdateTypes.includes(type)) {
      const translatedStatus = translatedStatuses[type];

      const res = await updateFileLinkStatus({
        fileId: objectId,
        status: translatedStatus
      });

      if (res) {
        return new Response(JSON.stringify({ received: true }), {
          status: 200
        });
      } else {
        throw new Error('Error updating file status');
      }
    }

    throw new Error('No object id or type found');
  } catch (e) {
    console.log('Error parsing webhook body:: ', e);
    return new Response(
      JSON.stringify({ error: 'Error parsing webhook body' }),
      { status: 500 }
    );
  }
}
