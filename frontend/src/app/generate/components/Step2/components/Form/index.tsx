"use client";

import styles from "./styles.module.css";
import InputBox from "@/app/generate/components/Step2/components/InputBox";
import InputText from "@/app/generate/components/Step2/components/InputText";
import SelectButtons from "@/app/generate/components/Step2/components/SelectButtons";
import React, {Dispatch, SetStateAction} from "react";

export interface DeckOptions {
    deckName: string;
    cardTypes: string[];
    cardLimit: number | null;
    cardStyles: string[];
}

interface FormProps {
    formData: DeckOptions;
    setFormData: Dispatch<SetStateAction<DeckOptions>>;
}

export default function Form({ formData, setFormData }: FormProps) {
    return (
        <div className={styles.formContainer}>
            <InputBox
                title="Deck Name"
                subtitle="Choose a name for your deck"
            >
                <InputText
                    value={formData.deckName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFormData({...formData, deckName: e.target.value})
                    }}
                    placeholder="Input your deck name here..."
                />
            </InputBox>

            <InputBox
                title="Card Types"
                subtitle="Choose the type of cards to generate"
            >
                <SelectButtons
                    multiple
                    options={[
                        {value: "basic", label: "Basic"},
                        {value: "reversible", label: "Reversible"},
                        {value: "multiple-choice", label: "Multiple Choice"},
                        {value: "cloze", label: "Cloze"},
                    ]}
                    value={formData.cardTypes}
                    onChange={(val) => setFormData({...formData, cardTypes: val})}
                />
            </InputBox>

            <InputBox
                title="Card Limit"
                subtitle="Set the maximum number of cards for this deck"
            >
                <SelectButtons
                    multiple={false}
                    options={[
                        {value: 10, label: "10"},
                        {value: 20, label: "20"},
                        {value: 30, label: "30"}
                    ]}
                    value={formData.cardLimit ?? null}
                    onChange={(val) => setFormData({...formData, cardLimit: val as number})}
                />
            </InputBox>

            <InputBox title="Card Style" subtitle="Select how content is presented">
                <SelectButtons
                    multiple
                    options={[
                        {value: "concise", label: "Concise"},
                        {value: "contextual", label: "Contextual"},
                        {value: "bulleted", label: "Bulleted"},
                        {value: "with-examples", label: "With Examples"},
                    ]}
                    value={formData.cardStyles}
                    onChange={(val) => setFormData({...formData, cardStyles: val})}
                />
            </InputBox>
        </div>
    );
}