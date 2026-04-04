"use client";

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
}

const protectedPaths = ['/account/profile', '/account/dashboard'];

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!user && protectedPaths.includes(pathname)) {
            router.replace('/');
        }
    }, [user, router, pathname]);

    return <>{children}</>;
}