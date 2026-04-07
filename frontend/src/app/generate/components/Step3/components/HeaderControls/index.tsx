"use client";

import styles from "./styles.module.css";
import React, { useState, useEffect, useRef } from "react";
import { exportDeckApkg, saveDeck } from "@/app/services/deck.service";
import {DotsThreeVerticalIcon, DownloadSimpleIcon, FloppyDiskIcon} from "@phosphor-icons/react";
import {PlusIcon} from "@phosphor-icons/react/ssr";

interface HeaderControlsProps {
    title: string;
    updateTitle: (newTitle: string) => void;
    numItems: number;
    generatedDeck: GeneratedDeck | null;
    onNewSet: () => void;
}

interface GeneratedDeck {
    deckName: string;
    tags: string[];
    cards: GeneratedCard[];
}

interface GeneratedCard {
    type: "basic" | "reversible" | "multiple-choice" | "cloze";
    front: string;
    back: string;
}

export default function HeaderControls({ title, updateTitle, numItems, generatedDeck, onNewSet }: HeaderControlsProps) {
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [deckTitle, setDeckTitle] = useState<string>(title);
    const menuRef = useRef<HTMLDivElement>(null);
    const titleInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showMenu && menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showMenu]);

    const handleAction = (actionCallback: () => void): void => {
        actionCallback();
        setShowMenu(false);
    };

    const handleExport = async (): Promise<void> => {
        if (!generatedDeck) return;

        try {
            const blob = await exportDeckApkg(
                generatedDeck.deckName,
                generatedDeck.cards
            );

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${generatedDeck.deckName}.apkg`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            alert("Failed to export deck");
        }
    };

    const handleSave = async (): Promise<void> => {
        if (!generatedDeck) return alert("No deck to save");

        const deckData = {
            title: generatedDeck.deckName,
            cards: generatedDeck.cards,
            tags: generatedDeck.tags,
        };

        try {
            const result = await saveDeck(deckData);

            if (result.entity === "guest") {
                switch(result.action) {
                    case "created":
                        alert("Deck saved temporarily! Sign up to keep it permanently.");
                        break;
                    case "updated":
                        alert("Deck updated temporarily! Sign up to keep it permanently.");
                        break;
                    case "already_exists_guest":
                        alert("Sign up to migrate it to your account.");
                        break;
                }
            } else {
                switch(result.action) {
                    case "created":
                        alert("Deck saved to dashboard!");
                        console.log("Successfully created!");
                        break;
                    case "already_exists":
                        alert("You've already saved this exact deck!");
                        console.log("Deck already exists!");
                        break;
                    case "migrated":
                        alert("Deck migrated to your account successfully!");
                        break;
                    case "updated":
                        alert("Deck updated successfully!");
                        break;
                }
            }
        } catch (err) {
            console.error(err);
            alert("Failed to save deck");
        }
    };

    const handleStartEdit = (): void => {
        setIsEditing(true);
        setShowMenu(false);
        setTimeout(() => {
            if (titleInputRef.current) {
                titleInputRef.current.focus();
            }
        }, 0);
    };

    const handleSaveTitle = (): void => {
        setIsEditing(false);
        if (updateTitle && deckTitle !== title) {
            updateTitle(deckTitle);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            handleSaveTitle();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            setDeckTitle(title);
        }
    };

    return (
        <div className={styles.headerControls}>
            <div className={styles.headerInfo}>
                {isEditing ? (
                    <input
                        ref={titleInputRef}
                        type="text"
                        value={deckTitle}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeckTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleSaveTitle}
                        className={styles.headerInfoTitleInput}
                        autoFocus
                    />
                ) : (
                    <h4
                        className={styles.headerInfoTitle}
                        onClick={handleStartEdit}
                    >
                        {deckTitle}
                    </h4>
                )}
                <p className={styles.headerInfoSubtitle}>{numItems} Items</p>
                <div className={styles.menuAnchor} ref={menuRef}>
                    <button
                        className={styles.headerInfoMenu}
                        onClick={() => setShowMenu((prev) => !prev)}
                    >
                        <DotsThreeVerticalIcon size={19} weight="bold"/>
                    </button>
                    {showMenu && (
                        <div className={styles.dropdownMenu}>
                            <button
                                className={styles.menuItem}
                                onClick={() => handleAction(handleStartEdit)}
                            >
                                Edit Name
                            </button>
                            <button
                                className={styles.menuItem}
                                onClick={() => handleAction(handleExport)}
                            >
                                Export .apkg
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.buttonsContainer}>
                <button
                    className={`${styles.btn} ${styles.new}`}
                    onClick={onNewSet}
                >
                    <span className={styles.btnTxt}>New Set</span>
                    <span className={styles.btnLogo}>
                        <PlusIcon size={19}/>
                    </span>
                </button>
                <button
                    type="button"
                    className={`${styles.btn} ${styles.export}`}
                    onClick={() => handleExport()}
                >
                    <span className={styles.btnTxt}>Export</span>
                    <span className={styles.btnLogo}>
                        <DownloadSimpleIcon size={19}/>
                    </span>
                </button>
            </div>
        </div>
    )
}