const API_BASE_URL = 'https://frontend-assignment-api.goodrequest.dev';
export interface Shelter {
  id: number;
  name: string;
}

export interface SheltersResponse {
  shelters: Shelter[];
}

export interface DonationStats {
  contributors: number;
  contribution: number | null;
}

export interface Contributor {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface DonationRequest {
  contributors: Contributor[];
  shelterID?: number;
  value: number;
}

export interface ApiMessage {
  message: string;
  type: 'ERROR' | 'WARNING' | 'INFO' | 'SUCCESS';
}

export interface DonationResponse {
  messages: ApiMessage[];
}

export const api = {
  getShelters: async (search?: string): Promise<SheltersResponse> => {
    const url = new URL(`${API_BASE_URL}/api/v1/shelters/`);
    if (search) {
      url.searchParams.set('search', search);
    }
    
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error('Failed to fetch shelters');
    }
    return response.json();
  },

  getStats: async (search?: string): Promise<DonationStats> => {
    const url = new URL(`${API_BASE_URL}/api/v1/shelters/results`);
    if (search) {
      url.searchParams.set('search', search);
    }
    
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error('Failed to fetch statistics');
    }
    return response.json();
  },

  submitDonation: async (donation: DonationRequest): Promise<DonationResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/shelters/contribute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(donation),
    });

    if (!response.ok) {
      throw new Error('Failed to submit donation');
    }
    return response.json();
  },
};
