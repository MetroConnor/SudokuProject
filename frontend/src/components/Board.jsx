import React, { useState, useEffect } from 'react';
import '/Users/connorzupan/Documents/GitHub/Sudoku/frontend/src/styles/sudokuBoard.css'; // Importiere die CSS-Datei

export default function Board({ missingCount, onCheckSolution }) {
    const [puzzle, setPuzzle] = useState([]);
    const [solution, setSolution] = useState([]);
    const [inputValues, setInputValues] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:8080/sudokuPuzzle?missingCount=${missingCount}`)
            .then(response => response.json())
            .then(data => {
                setPuzzle(data.puzzle);
                setSolution(data.solution);
                setInputValues(data.puzzle.map(row => row.map(num => num)));  // Initialisiere die Eingabewerte
            })
            .catch(error => console.error('Fehler beim Abrufen des Sudoku-Puzzles', error));
    }, [missingCount]);  // Der Effekt wird erneut ausgeführt, wenn missingCount geändert wird

    const handleChange = (rowIndex, colIndex, value) => {
        const newInputValues = [...inputValues];
        newInputValues[rowIndex][colIndex] = value === "" ? null : parseInt(value);
        setInputValues(newInputValues);
    };

    const checkSolution = () => {
        for (let row = 0; row < puzzle.length; row++) {
            for (let col = 0; col < puzzle[row].length; col++) {
                if (inputValues[row][col] !== null && inputValues[row][col] !== solution[row][col]) {
                    alert(`Fehler in Zeile ${row + 1}, Spalte ${col + 1}`);
                    return;
                }
            }
        }
        alert("Alles korrekt!");
        onCheckSolution();
    };

    return (
        <div>
            <div className="sudokuBoard">
                {puzzle.map((row, rowIndex) => (
                    <div key={rowIndex} className="sudokuRow">
                        {row.map((number, colIndex) => (
                            <div key={colIndex} className="sudokuCell">
                                {number === null ? (
                                    <input
                                        type="text"
                                        className="sudokuInput"
                                        value={inputValues[rowIndex][colIndex] || ""}
                                        onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                                    />
                                ) : (
                                    number
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button className="checkSolutionButton" onClick={checkSolution}>
                    Lösung überprüfen
                </button>
            </div>
        </div>
    );
}