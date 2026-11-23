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

Ich habe das Filtern und Sortieren mit vier Dropdowns umgesetzt. Im ersten wählt man aus, welchen Status die Tasks haben sollen, also alle, offene oder geschlossene. Bei `minPriority` kann man auswählen, ab welcher Priorität die Tasks angezeigt werden sollen. Bei `Sort by` wählt man aus, wonach sortiert werden soll, also nach Datum, Priorität oder Erstellungsdatum. Zum Schluss kann man auswählen, ob aufsteigend oder absteigend sortiert werden soll.

Standardmässig wird nach Priorität absteigend sortiert.

Die Filter werden in React in `useState` gespeichert. Sobald sich etwas ändert, wird durch den `useEffect` eine neue GET-Anfrage mit den ausgewählten Sortier- und Filtereinstellungen gemacht. In `api.js` werden die Filter- und Sortiereinstellungen mitgegeben. Mithilfe von `URLSearchParams` werden diese als Query-Parameter an das Backend übergeben. Durch diese Lösung kann der Benutzer die Tasks nach seinen Vorgaben filtern und sortieren. Ich finde, dass dies die effizienteste Lösung ist.


## Tests

_Welche Tests hast du geschrieben, und was decken sie ab?_
Ich habe folgende Tests gemacht:

1. **Ungültige ID testen:** Hier teste ich, ob eine ungültige ID immer noch einen 500-Fehler gibt oder ob ein 400-Fehler zurückgegeben wird.
2. **Priorität testen:** Hier teste ich, ob die Sortierung nach Priorität richtig funktioniert.
3. **Ungültige Filter testen:** Hiermit teste ich, wie mein Filtern und Sortieren bei fehlerhaften Eingaben reagiert.
4. **Fehlendes Fälligkeitsdatum nach änbdern des Titels:** Ich teste, ob das Fälligkeitsdatum immernoch fehlt wenn ich den Titel ändere.

## KI-Nutzung

- **Verwendete Tools:** Claude, ChatGPT
- **Wofür ich sie verwendet habe:** Zum generieren von Code z.B im Frontend die Filter
- **Wo die KI falsch lag oder nicht geholfen hat, und wie ich es gemerkt habe:** 

## Zeitaufwand

| Aufgabe   | Zeit |
| --------- | ---- |
| Setup     | 20 min|
| Bugs      | 2-3h|
| Feature   | 1.5h|
| Tests     | 45 min|
| NOTES.md  |  40min|
| **Total** | ~6h|

## Offene Punkte / was ich mit mehr Zeit machen würde
- Bearbeiten von Tasks im Frontend
- Suche Task nach Name
- Sortiere nach abgelaufenen Tasks