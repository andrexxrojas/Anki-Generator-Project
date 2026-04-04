const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function Login(identifier: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            identifier: identifier,
            password: password,
        })
    });

    if (!res.ok) {
        throw new Error("Failed to login user.");
    }

    return res.json();
}

export async function Register(username: string, email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password
        })
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Failed to register user.");
    }

    return data;
}

export async function Logout() {
    const res = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!res.ok) {
        throw new Error("Failed to logout user.");
    }

    return res.json();
}

export async function CheckAuth() {
    const res = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!res.ok) {
        throw new Error("Failed to check user.");
    }

    return res.json();
}

export async function GetProfile() {
    const res = await fetch(`${API_URL}/auth/profile`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to fetch profile");
    }

    return res.json();
}