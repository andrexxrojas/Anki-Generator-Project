"use client";

import styles from "./styles.module.css";
import React, { InputHTMLAttributes } from "react";

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputText({ value, onChange, ...props }: InputTextProps) {
    return (
        <input
            type="text"
            className={styles.inputText}
            value={value}
            onChange={onChange}
            {...props}
        />
    );
}