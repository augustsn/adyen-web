import type { AdditionalDetailsData } from '@bubp/web';

export default async function makeDetailsCall(data: AdditionalDetailsData['data']) {
    return await $fetch('/api/paymentDetails', {
        method: 'post',
        body: data
    });
}
