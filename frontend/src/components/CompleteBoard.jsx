import React, { useState, useEffect } from 'react';
import Board from './Board';
import '/Users/connorzupan/Documents/GitHub/Sudoku/frontend/src/styles/sudokuBoard.css';

export default function CompleteBoard() {
    const [missingCount, setMissingCount] = useState(0); // Zustand für die Anzahl der fehlenden Zahlen
    const [time, setTime] = useState(0);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [username, setUsername] = useState('');
    const [isGameFinished, setIsGameFinished] = useState(false);

    useEffect(() => {
        let timer;
        if (isTimerActive) {
            timer = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        }
        return () => {
            clearInterval(timer);
        }
    }, [isTimerActive]);

    const setDifficulty = (difficulty) => {
        switch (difficulty) {
            case 'easy':
                setMissingCount(30);
                break;
            case 'medium':
                setMissingCount(40);
                break;
            case 'hard':
                setMissingCount(45);
                break;
            default:
                setMissingCount(0);
        }
        setTime(0);
        setIsTimerActive(true);
        setIsGameFinished(false);
    };

    const handleStopTimer = () => {
        setIsTimerActive(false);
        setIsGameFinished(true);
    }

    const handleSubmitHighscore = () => {
        if (username === '') {
            alert('Bitte Benutzernamen eingeben');
            return;
        }

        const highscoreData = {
            username: username,
            completionTime: time,
            difficultyLevel: missingCount === 30 ? 'easy' : missingCount === 40 ? 'medium' : 'hard'
        };

        fetch('http://localhost:8080/api/highscore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(highscoreData),
        })
            .then(response => {
                if (response.ok) {
                    alert('Highscore erfolgreich gespeichert!');
                } else {
                    alert('Fehler beim Speichern des Highscores');
                }
            })
            .catch(error => {
                console.error('Fehler beim Senden des Highscores:', error);
                alert('Fehler beim Senden des Highscores');
            });
    }

    return (
        <div>
            <h1>Sudoku Spiel</h1>
            <div className="difficultyButtons">
                <button onClick={() => setDifficulty('easy')}>Leicht</button>
                <button onClick={() => setDifficulty('medium')}>Mittel</button>
                <button onClick={() => setDifficulty('hard')}>Schwer</button>
            </div>

            <div className="timer">
                <h2>Highscore {Math.floor(time / 60)}:{time % 60 < 10 ? `0${time % 60}` : time % 60}</h2>
            </div>

            <Board missingCount={missingCount} onCheckSolution={handleStopTimer} />

            {/* Eingabefeld und Button nach Abschluss des Spiels */}
            {isGameFinished && (
                <div>
                    <input
                        type="text"
                        placeholder="Benutzername"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button onClick={handleSubmitHighscore}>Highscore speichern</button>
                </div>
            )}
        </div>
    );
}
