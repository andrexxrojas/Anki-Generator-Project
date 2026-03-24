import localFont from "next/font/local";

export const regular = localFont({
    src: [{ path: "./fonts/Inter-Regular.ttf" }],
    variable: "--font-regular"
});

export const medium = localFont({
    src: [{ path: "./fonts/Inter-Medium.ttf" }],
    variable: "--font-medium"
});

export const semibold = localFont({
    src: [{ path: "./fonts/Inter-SemiBold.ttf" }],
    variable: "--font-semibold"
});

export const bold = localFont({
    src: [{ path: "./fonts/Inter-Bold.ttf" }],
    variable: "--font-bold"
});