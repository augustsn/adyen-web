import { Page } from '@playwright/test';

const STATUS_URL = 'https://bubpayment.com/checkout/shopper/services/PaymentInitiation/v1/status?*';

const numberOfPendingCalls = 3;

const statusMock = async (page: Page, mockedResponse: any): Promise<void> => {
    let numberOfCalls = 0;

    await page.route(STATUS_URL, (route, request) => {
        if (numberOfCalls < numberOfPendingCalls) {
            numberOfCalls++;

            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    payload: 'encrypted-data',
                    resultCode: 'pending',
                    type: 'complete'
                }),
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            });
            return;
        }

        const requestData = JSON.parse(request.postData() || '');
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                ...mockedResponse,
                requestId: requestData.requestId
            }),
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        });
    });
};

export { statusMock };
