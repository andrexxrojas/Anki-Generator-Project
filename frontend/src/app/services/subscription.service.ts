const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface CreateCheckoutResponse {
    url: string;
}

interface CanGenerateResponse {
    canGenerate: boolean;
}

interface UsageResponse {
    used: number;
    limit: number;
    totalDecksGenerated: number;
    tier: 'free' | 'pro' | 'premium';
}

export async function createCheckoutSession(priceId: string): Promise<CreateCheckoutResponse> {
    const res = await fetch(`${API_URL}/subscription/create-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ priceId }),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to create checkout session.");
    }

    return res.json();
}

export async function checkCanGenerate(): Promise<CanGenerateResponse> {
    const res = await fetch(`${API_URL}/subscription/can-generate`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to check generation limit.");
    }

    return res.json();
}

export async function getUsage(): Promise<UsageResponse> {
    const res = await fetch(`${API_URL}/subscription/usage`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to fetch usage data.");
    }

    return res.json();
}