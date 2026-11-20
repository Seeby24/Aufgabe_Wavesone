# Notizen

> Fülle diese Datei während der Arbeit aus. Kurz und ehrlich ist besser als lang und poliert.

**Gewähltes Backend:** Node.js 
## Bugs

| #   | Symptom                                    | Ursache | Fix (Dateien / was geändert) |
| --- | ------------------------------------------ | ------- | ---------------------------- |
| 1   |  /tasks werden nicht angezeigt             | await hinzufügen | routes/tasks.js Zeile 20 await|
| 2   |  Priorität falsch herum  |Sort Absteigend & priority ist ein String| taskService(listTasks) & tasks.json                              |
| 3   | Datum um 1 Tag Falsch |  UTC-Zeitzonenumrechnung        | Models/tasks.js Date --> String; Zeitumrechnung in validateTaskInput geändert                             |
| 4   |                                            |         |                              |
| 5   |                                            |         |                              |
| 6   |                                            |         |                              |
| …   | _(alles, was du sonst noch gefunden hast)_ |         |                              |

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
