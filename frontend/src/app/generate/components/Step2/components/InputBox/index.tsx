"use client";

import styles from "./styles.module.css";
import InputLabel from "@/app/generate/components/Step2/components/InputLabel/InputLabel";
import { ReactNode } from "react";

interface InputBoxProps {
    title: string;
    subtitle: string;
    children: ReactNode;
}

export default function InputBox({ title, subtitle, children }: InputBoxProps) {
    return (
        <div className={styles.labeledInput}>
            <InputLabel title={title} subtitle={subtitle} />
            {children}
        </div>
    );
}