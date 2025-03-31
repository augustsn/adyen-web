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
    UIElement,
    BubpCheckoutError,
} from "@bubp/web";
import "@bubp/web/styles/bubp.css";
import type {
    PaymentFailedData,
    PaymentCompletedData,
    CoreConfiguration,
    DropinConfiguration,
} from "@bubp/web";
import {
    DEFAULT_AMOUNT,
    DEFAULT_COUNTRY,
    DEFAULT_LOCALE,
} from "@/app/_utils/constants";
import makeSessionsSetupCall from "../../_utils/makeSessionsSetupCall";
import { parseAmount } from "@/app/_utils/amount-utils";

export default function SessionsFlow() {
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

        const session = await makeSessionsSetupCall({
            countryCode,
            amount,
            shopperLocale: locale,
        });

        const options: CoreConfiguration = {
            clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY,
            session: {
                id: session.id,
                sessionData: session.sessionData,
            },
            countryCode,
            amount,
            locale,
            environment: "test",
            analytics: {
                enabled: false,
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
