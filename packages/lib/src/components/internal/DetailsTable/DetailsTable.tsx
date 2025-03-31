import { h } from 'preact';
import './DetailsTable.scss';

export interface DetailsTableData
    extends Array<{
        label: string;
        value: string;
    }> {}

export interface DetailsTableProps {
    tableFields: DetailsTableData;
}

export default function DetailsTable({ tableFields }: DetailsTableProps) {
    // For context, this markup uses 2 classes for backwards compatibility
    // This was originally part of the voucher component and ported out
    // We can remove the voucher class names at point
    return (
        <dl className="bubp-checkout__voucher-result__details bubp-checkout__details-table">
            {tableFields
                // first remove empty values
                .filter(item => !!item)
                // or objects without label and value
                .filter(({ label, value }) => !!label && !!value)
                .map(({ label, value }) => (
                    <div key={`${label + value}`} className="bubp-checkout__voucher-result__details__item bubp-checkout__details-table__item">
                        <dt className="bubp-checkout__voucher-result__details__label bubp-checkout__details-table__label">{label}</dt>
                        <dd className="bubp-checkout__voucher-result__details__value bubp-checkout__details-table__value">{value}</dd>
                    </div>
                ))}
        </dl>
    );
}
