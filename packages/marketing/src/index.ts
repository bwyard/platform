// @breeyard/marketing — provider-agnostic bulk/campaign email facade (Brevo default)

export type MarketingProvider = 'brevo' | 'mailchimp' | 'convertkit' | 'resend';

export interface Contact {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];
}

export interface Campaign {
  id: string;
  subject: string;
  htmlBody: string;
  listId: string;
  scheduledAt?: Date;
}

export interface ListStats {
  listId: string;
  subscriberCount: number;
  openRate?: number;
  clickRate?: number;
}

export interface MarketingClient {
  sendCampaign(campaign: Campaign): Promise<void>;
  addContact(listId: string, contact: Contact): Promise<void>;
  removeContact(listId: string, contactId: string): Promise<void>;
  createList(name: string): Promise<string>;
  getListStats(listId: string): Promise<ListStats>;
}

export const createMarketingClient = (
  provider: MarketingProvider,
  _apiKey: string,
): MarketingClient => {
  return {
    sendCampaign: (_campaign: Campaign): Promise<void> => {
      throw new Error(`not implemented: sendCampaign (provider=${provider})`);
    },
    addContact: (_listId: string, _contact: Contact): Promise<void> => {
      throw new Error(`not implemented: addContact (provider=${provider})`);
    },
    removeContact: (_listId: string, _contactId: string): Promise<void> => {
      throw new Error(`not implemented: removeContact (provider=${provider})`);
    },
    createList: (_name: string): Promise<string> => {
      throw new Error(`not implemented: createList (provider=${provider})`);
    },
    getListStats: (_listId: string): Promise<ListStats> => {
      throw new Error(`not implemented: getListStats (provider=${provider})`);
    },
  };
};
