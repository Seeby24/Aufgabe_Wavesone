# Notizen

> Fülle diese Datei während der Arbeit aus. Kurz und ehrlich ist besser als lang und poliert.

**Gewähltes Backend:** Node.js 
## Bugs

| #   | Symptom                                    | Ursache | Fix (Dateien / was geändert) |
| --- | ------------------------------------------ | ------- | ---------------------------- |
| 1   |  /tasks werden nicht angezeigt             | await hinzufügen | routes/tasks.js Zeile 20 await|
| 2   |  Priorität falsch herum  |Sort Absteigend & priority ist ein String| taskService(listTasks) & tasks.json                              |
| 3   | Datum um 1 Tag Falsch |  UTC-Zeitzonenumrechnung        | Models/tasks.js Date --> String; Zeitumrechnung in validateTaskInput geändert                             |
| 4   | Checkboxen erst nach refresh geändert| Backend gibt nach änderung das alte Document zurück |taskservice.updateTask --> {new: true}  |
| 5   | GET-Request mit ungültiger id macht einen 500 Error| Mongoose erwartet ObjectIds statt Zahlen ID's   | taskService.getTask(id) --> ID validierung hinzufügen |
| 6   | Beim Ändern des Titels über die API wurde das Fälligkeitsdatum gelöscht| validateTaskInput setzt fehlende dates auf null| taskService.validateTaskInput --> nur noch dueDate bearbeiten wenn mitgegeben oder ein Put ist|
| 7   | Delete und und update Task geben bei ungültiger ID einen 500 Error | Mongoose erwartet ObjectIds statt Zahlen ID's | taskService.updateTask & deleteTask --> ID validierung hinzufügen|
| 8   | priority wird nicht überprüft und ungültige eingabe gibt einen 500 error|serives/taskService --> validation für priority hinzufügen|

## Feature: Filtern und Sortieren

_Wie hast du es umgesetzt? Welche Entscheidungen hast du getroffen, und warum?_

## Tests

_Welche Tests hast du geschrieben, und was decken sie ab?_

## KI-Nutzung

- **Verwendete Tools:**
- **Wofür ich sie verwendet habe:**
- **Wo die KI falsch lag oder nicht geholfen hat, und wie ich es gemerkt habe:**

## Zeitaufwand

| Aufgabe   | Zeit |
| --------- | ---- |
| Setup     |      |
| Bugs      |      |
| Feature   |      |
| Tests     |      |
| NOTES.md  |      |
| **Total** |      |

## Offene Punkte / was ich mit mehr Zeit machen würde
