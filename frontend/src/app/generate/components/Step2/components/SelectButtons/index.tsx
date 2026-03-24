"use client";

import styles from "./styles.module.css";

interface Option {
    value: string | number;
    label: string;
}

interface SelectButtonsProps {
    multiple?: boolean;
    options: Option[];
    value: string | number | (string | number)[] | null;
    onChange: (val: any) => void;
}

export default function SelectButtons({
                                          multiple = false,
                                          options = [],
                                          value,
                                          onChange
                                      }: SelectButtonsProps) {
    const handleClick = (val: string | number) => {
        if (multiple) {
            const newValue = Array.isArray(value)
                ? value.includes(val)
                    ? value.filter((v) => v !== val)
                    : [...value, val]
                : [val];
            onChange(newValue);
        } else {
            onChange(val);
        }
    };

    return (
        <div className={styles.selectContainer}>
            {options.map((opt) => {
                const isSelected = multiple
                    ? Array.isArray(value) && value.includes(opt.value)
                    : value === opt.value;

                return (
                    <button
                        key={opt.value.toString()}
                        type="button"
                        className={`${styles.selectOption} ${
                            isSelected ? styles.active : ""
                        }`}
                        onClick={() => handleClick(opt.value)}
                    >
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
}