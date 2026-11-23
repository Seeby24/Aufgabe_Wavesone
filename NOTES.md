# Notizen

> Fülle diese Datei während der Arbeit aus. Kurz und ehrlich ist besser als lang und poliert.

**Gewähltes Backend:** Node.js 
## Bugs

| #   | Symptom                                    | Ursache | Fix (Dateien / was geändert) |
| --- | ------------------------------------------ | ------- | ---------------------------- |
| 1   | /tasks werden nicht angezeigt | In der Route fehlte `await`, es kam ein Promise statt der Liste zurück | routes/tasks.js → await hinzugefügt |
| 2   | Priorität 10 steht ganz unten | `priority` war im Model und in den Seed-Daten ein String, "10" sortiert alphabetisch vor "2" | models/task.js String → Number; seed/tasks.json Zahlen statt Strings |
| 3   | Datum um 1 Tag falsch | Frontend schickte `startOfDay().toISOString()` (UTC-Umrechnung), Backend speicherte ein Date | TaskForm.jsx schickt `YYYY-MM-DD`; models/task.js Date → String; validateTaskInput prüft das Format |
| 4   | Checkboxen erst nach Refresh geändert | Backend gibt nach der Änderung das alte Document zurück | taskService.updateTask → `{ new: true }`; App.jsx lädt die Liste nach dem Abhaken neu |
| 5   | GET-Request mit ungültiger ID macht einen 500 Error | Mongoose wirft einen CastError, weil `123` keine ObjectId ist | taskService.getTask → ID-Validierung (400) hinzugefügt |
| 6   | Beim Ändern des Titels über die API wurde das Fälligkeitsdatum gelöscht | validateTaskInput setzte ein fehlendes dueDate immer auf null | taskService.validateTaskInput → dueDate nur ändern, wenn es mitgeschickt wird |
| 7   | Delete und Update geben bei ungültiger ID einen 500 Error | Gleiche Ursache wie bei 5 | taskService.updateTask & deleteTask → ID-Validierung hinzugefügt |
| 8   | Ungültige Priorität gibt einen 500 Error | Priorität wurde nicht geprüft | taskService.validateTaskInput → Priorität muss eine Ganzzahl von 1 bis 10 sein |
| 9   | Formulardaten verschwinden, obwohl der Task nicht erstellt wurde | setForm(EMPTY) wurde auch bei einem API-Fehler ausgeführt | App.jsx handleCreate gibt true/false zurück; TaskForm.jsx leert das Formular nur bei Erfolg |
| 10  | Leerer String als Fälligkeitsdatum wird akzeptiert | `body.dueDate \|\| null` machte aus `""`, `0` und `false` null | taskService.validateTaskInput → nur noch null oder ein gültiges Datum (YYYY-MM-DD), sonst 400 |


## Feature: Filtern und Sortieren

_Wie hast du es umgesetzt? Welche Entscheidungen hast du getroffen, und warum?_  

Ich habe das Filtern und Sortieren mit vier Dropdowns umgesetzt. Im ersten wählt man den Status (alle, offene oder erledigte Tasks). Bei `minPriority` wählt man, ab welcher Priorität die Tasks angezeigt werden. Bei `Sort by` wählt man, wonach sortiert wird: Priorität, Fälligkeitsdatum oder Erstellungsdatum. Zum Schluss wählt man, ob auf- oder absteigend sortiert wird. Standardmässig wird nach Priorität absteigend sortiert.

Die Filter werden in React in `useState` gespeichert. Sobald sich einer ändert, löst `useEffect` eine neue GET-Anfrage aus. `api.js` baut daraus mit `URLSearchParams` die Query-Parameter und lässt leere Werte weg.

Im Backend prüft `validateTaskQuery` die Werte und gibt bei ungültigen Eingaben 400 zurück (Ausser für `status`, `sort` und `order`, `minPriority`). Gefiltert und sortiert wird direkt in der Mongo-Abfrage (`Task.find(filter).sort(...)`)


## Tests

_Welche Tests hast du geschrieben, und was decken sie ab?_
Ich habe folgende Tests gemacht:

1. **PATCH behält dueDate:** Titel ändern darf nicht das Fälligkeitsdatum löschen (Bug 6).
2. **Ungültige ID:** GET, PATCH und DELETE geben 400 statt 500 (Bug 5 & 7).
3. **Sortierung nach Priorität:** Die Reihenfolge ist 10, 5, 2, (Bug 2).
4. **Filter und Sortierung geprüft:** `status`, `minPriority` und `sort=dueDate` zusammen geprüft.

## KI-Nutzung

- **Verwendete Tools:** Claude, ChatGPT
- **Wofür ich sie verwendet habe:** Zum generieren von Code z.B im Frontend die Filter
- **Wo die KI falsch lag oder nicht geholfen hat, und wie ich es gemerkt habe:** Bei der Priorität lag sie erst falsch

## Zeitaufwand

| Aufgabe   | Zeit |
| --------- | ---- |
| Setup     | 20 min|
| Bugs      | 2-3h|
| Feature   | 1.5h|
| Tests     | 45 min|
| NOTES.md  |  1h|
| **Total** | ~6h|

## Offene Punkte / was ich mit mehr Zeit machen würde
- Bearbeiten von Tasks im Frontend
- Suche Task nach Name
- Sortiere nach abgelaufenen Tasks