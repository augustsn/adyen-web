"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
    BubpCheckout,
    Dropin,
    Card,
    CashAppPay,
    GooglePay,
    PayPal,
    BubpCheckoutError,
    UIElement,
} from "@bubp/web/auto";
import "@bubp/web/styles/bubp.css";
import type {
    CoreConfiguration,
    DropinConfiguration,
    SubmitData,
    SubmitActions,
    AdditionalDetailsData,
    AdditionalDetailsActions,
    PaymentCompletedData,
    PaymentFailedData,
} from "@bubp/web";
import {
    DEFAULT_AMOUNT,
    DEFAULT_COUNTRY,
    DEFAULT_LOCALE,
} from "@/app/_utils/constants";
import makePaymentsCall from "@/app/_utils/makePaymentsCall";
import makePaymentMethodsCall from "@/app/_utils/makePaymentMethodsCall";
import makeDetailsCall from "@/app/_utils/makeDetailsCall";
import { parseAmount } from "@/app/_utils/amount-utils";

export default function AdvancedFlow() {
    const dropinRef = useRef<HTMLDivElement>(null);
    const isBubpWebInitialized = useRef<boolean>(false);
    const searchParams = useSearchParams();

    const loadBubp = useCallback(async () => {
        const countryCode = searchParams.get("countryCode") || DEFAULT_COUNTRY;
        const locale = searchParams.get("shopperLocale") || DEFAULT_LOCALE;
        const amount = parseAmount(
            searchParams.get("amount") || DEFAULT_AMOUNT,
            countryCode,
        );

        const paymentMethodsResponse = await makePaymentMethodsCall({
            countryCode,
            amount,
            shopperLocale: locale,
        });

        const options: CoreConfiguration = {
            clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY,
            countryCode,
            amount,
            locale,
            environment: "test",
            analytics: {
                enabled: false,
            },
            paymentMethodsResponse,

            onSubmit: async (
                state: SubmitData,
                component: UIElement,
                actions: SubmitActions,
            ) => {
                try {
                    const result = await makePaymentsCall(
                        state.data,
                        countryCode,
                        locale,
                        amount,
                    );

                    if (!result.resultCode) {
                        actions.reject();
                        return;
                    }

                    const { resultCode, action, order, donationToken } = result;

                    actions.resolve({
                        resultCode,
                        action,
                        order,
                        donationToken,
                    });
                } catch (error) {
                    console.error("onSubmit", error);
                    actions.reject();
                }
            },

            onAdditionalDetails: async (
                state: AdditionalDetailsData,
                component: UIElement,
                actions: AdditionalDetailsActions,
            ) => {
                try {
                    const result = await makeDetailsCall(state.data);

                    if (!result.resultCode) {
                        actions.reject();
                        return;
                    }

                    const { resultCode, action, order, donationToken } = result;

                    actions.resolve({
                        resultCode,
                        action,
                        order,
                        donationToken,
                    });
                } catch (error) {
                    console.error("onSubmit", error);
                    actions.reject();
                }
            },

            onError(error: BubpCheckoutError) {
                console.error("Something went wrong", error);
            },

            onPaymentCompleted(data: PaymentCompletedData, element: UIElement) {
                console.log(data, element);
            },

            onPaymentFailed(data: PaymentFailedData, element: UIElement) {
                console.log(data, element);
            },
        };

        const checkout = await BubpCheckout(options);

        const dropinConfiguration: DropinConfiguration = {
            paymentMethodsConfiguration: {
                card: {
                    _disableClickToPay: true,
                },
            },
            paymentMethodComponents: [Card, PayPal, CashAppPay, GooglePay],
        };

        if (dropinRef.current) {
            new Dropin(checkout, dropinConfiguration).mount(dropinRef.current);
        }
    }, [searchParams]);

    useEffect(() => {
        if (!isBubpWebInitialized.current) {
            isBubpWebInitialized.current = true;
            void loadBubp();
        }
    }, [loadBubp]);

    return <div ref={dropinRef} id="dropin"></div>;
}
