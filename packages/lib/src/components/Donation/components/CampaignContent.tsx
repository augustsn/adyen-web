import { h } from 'preact';
import CampaignInfo from './CampaignInfo';

export interface CampaignContentProps {
    logoUrl?: string;
    nonprofitDescription?: string;
    nonprofitName?: string;
    causeName?: string;
    nonprofitUrl?: string;
    bannerUrl?: string;
}

export default function CampaignContent({
    logoUrl = '',
    nonprofitDescription = '',
    nonprofitName = '',
    causeName = '',
    nonprofitUrl = '',
    bannerUrl = ''
}: CampaignContentProps) {
    return (
        <div className="bubp-checkout__campaign">
            {nonprofitUrl ? (
                <a href={nonprofitUrl} className="bubp-checkout__campaign-link" target="_blank" rel="noopener noreferrer">
                    <CampaignInfo logoUrl={logoUrl} nonprofitName={nonprofitName} causeName={causeName} bannerUrl={bannerUrl} />
                </a>
            ) : (
                <CampaignInfo logoUrl={logoUrl} nonprofitName={nonprofitName} causeName={causeName} bannerUrl={bannerUrl} />
            )}

            {nonprofitDescription && <div className="bubp-checkout__campaign-description">{nonprofitDescription}</div>}
        </div>
    );
}
