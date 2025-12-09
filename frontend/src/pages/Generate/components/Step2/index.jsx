import styles from "./Step2.module.css";
import {useState, useEffect} from "react";

const Header = ({title, subtitle}) => {
    return (
        <div className={styles["header"]}>
            <h4 className={styles["header-title"]}>{title}</h4>
            <p className={styles["header-subtitle"]}>{subtitle}</p>
        </div>
    )
}

const InputLabel = ({title, subtitle}) => (
    <div className={styles["input-label"]}>
        <p className={styles["label-title"]}>{title}</p>
        <div className={`${styles["label-subtitle"]} smaller`}>{subtitle}</div>
    </div>
);

const InputText = ({value, onChange, ...props}) => (
    <input
        type="text"
        className={styles["input-text"]}
        value={value}
        onChange={onChange}
        {...props}
    />
);

const SelectButtons = ({multiple = false, options = [], value, onChange}) => {
    const handleClick = (val) => {
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
        <div className={styles["select-container"]}>
            {options.map((opt) => {
                const isSelected = multiple
                    ? Array.isArray(value) && value.includes(opt.value)
                    : value === opt.value;

                return (
                    <button
                        key={opt.value}
                        type="button"
                        className={`${styles["select-option"]} ${
                            isSelected ? styles["active"] : ""
                        }`}
                        onClick={() => handleClick(opt.value)}
                    >
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
};

const InputBox = ({title, subtitle, children}) => (
    <div className={styles["labeled-input"]}>
        <InputLabel title={title} subtitle={subtitle}/>
        {children}
    </div>
);

const Form = ({formData, setFormData}) => {
    return (
        <div className={styles["form-container"]}>
            <InputBox
                title="Deck Name"
                subtitle="Choose a name for your deck"
            >
                <InputText
                    value={formData.deckName}
                    onChange={(e) => {
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
                        {value: 30, label: "30"},
                        {value: 40, label: "40"},
                    ]}
                    value={formData.cardLimit}
                    onChange={(val) => setFormData({...formData, cardLimit: val})}
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
    )
}

const NavButtons = ({onNext, onBack, formData, setDeckOptions, canContinue}) => {

    const handleBack = () => {
        onBack();
    }

    const isFormIncomplete =
        formData.deckName.trim() === "" ||
        formData.cardTypes.length === 0 ||
        formData.cardLimit === null ||
        formData.cardStyles.length === 0;

    const handleNext = () => {
        if (isFormIncomplete) {
            console.log("Please fill in all fields");
            return;
        }

        setDeckOptions(formData);
        onNext();
    }

    return (
        <div className={styles["button-wrapper"]}>
            <button className={`${styles["btn"]} ${styles["go-back"]}`} onClick={handleBack}>
                <span>Go Back</span>
            </button>
            <button className={`${styles["btn"]} ${styles["continue"]}`} onClick={handleNext} disabled={!canContinue}>
                <span>Continue</span>
            </button>
        </div>
    )
}

export default function Step2({onNext, onBack, deckOptions, setDeckOptions}) {
    const [canContinue, setCanContinue] = useState(false);
    const formData = deckOptions;
    const setFormData = setDeckOptions;

    const isFormComplete =
        formData.deckName.trim() !== "" &&
        formData.cardTypes.length > 0 &&
        formData.cardLimit !== null &&
        formData.cardStyles.length > 0;

    return (
        <div className={styles["step-wrapper"]}>
            <div className={styles["step-container"]}>
                <Header
                    title="Customize Your Deck"
                    subtitle="Fill in the details for your new deck"
                />
                <Form
                    formData={formData}
                    setFormData={setFormData}
                    setCanContinue={setCanContinue}
                />
                <NavButtons
                    onNext={onNext}
                    onBack={onBack}
                    formData={formData}
                    setDeckOptions={setDeckOptions}
                    canContinue={isFormComplete}
                />
            </div>
        </div>
    )
}