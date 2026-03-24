import styles from "./styles.module.css";

interface StepperProps {
    steps: string[];
    currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
    return (
        <div className={styles.stepper}>
            <div className={styles.stepperWrapper}>
                {steps.map((label: string, index: number) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep || (stepNumber === steps.length && currentStep === steps.length);
                    const isActive = stepNumber === currentStep && stepNumber !== steps.length;
                    const isLastStep = stepNumber === steps.length;
                    const isFinished = currentStep > steps.length;

                    return (
                        <div key={index} className={styles.stepperContainer}>
                            <div className={styles.stepInfo}>
                                <div
                                    className={`
                                        ${styles.circle}
                                        ${isCompleted ? styles.completed : ""}
                                        ${isActive ? styles.active : ""}
                                        ${isLastStep && isFinished ? styles.completed : ""}
                                    `}
                                />
                                <p
                                    className={`
                                        ${styles.label}
                                        ${isCompleted ? styles.completed : ""}
                                        ${isActive ? styles.active : ""}
                                        ${isLastStep && isFinished ? styles.completed : ""}
                                    `}
                                >
                                    {label}
                                </p>
                            </div>

                            {stepNumber !== steps.length && (
                                <div
                                    className={`
                                        ${styles.line}
                                        ${isCompleted ? styles.lineCompleted : ""}
                                    `}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}