import styles from "./Stepper.module.css";

export default function Stepper({steps, currentStep}) {
    return (
        <div className={styles["stepper"]}>
            <div className={styles["stepper-wrapper"]}>
                {steps.map((label, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep || stepNumber === steps.length && currentStep === steps.length;
                    const isActive = stepNumber === currentStep && stepNumber !== steps.length;
                    const isLastStep = stepNumber === steps.length;
                    const isFinished = currentStep > steps.length; // all steps completed


                    return (
                        <div key={index} className={styles["stepper-container"]}>
                            <div className={styles["step-info"]}>
                                <div
                                    className={`
                                ${styles["circle"]}
                                ${isCompleted ? styles["completed"] : ""}
                                ${isActive ? styles["active"] : ""}
                                ${isLastStep && isFinished ? styles.completed : ""}
                                `}
                                >
                                </div>
                                <p className={`
                                ${styles["label"]}
                                ${isCompleted ? styles["completed"] : ""}
                                ${isActive ? styles["active"] : ""}
                                ${isLastStep && isFinished ? styles.completed : ""}
                                `}>
                                    {label}
                                </p>
                            </div>

                            {stepNumber !== steps.length && (
                                <div className={`${styles["line"]} ${isCompleted ? styles["line-completed"] : ""}`}>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}