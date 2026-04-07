const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface CreateCheckoutResponse {
    url: string;
}

interface PortalSessionResponse {
    url: string;
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

export async function createPortalSession(): Promise<PortalSessionResponse> {
    const res = await fetch(`${API_URL}/subscription/create-portal-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to create portal session.");
    }

    return res.json();
}