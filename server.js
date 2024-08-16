const fs = require("fs");
const express = require("express");
const path = require("path");
const {v4: uuid} = require("uuid"); 

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.static("public"));

app.get("/api/notes", (req, res) => {
	fs.readFile(path.join(__dirname, "db/db.json"), "utf-8", (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ error: "Error reading notes" });
		}

		return res.status(200).json(JSON.parse(data));
	});
});

app.post("/api/notes", (req, res) => {
	fs.readFile(path.join(__dirname, "db/db.json"), "utf8", (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ error: "Error reading notes" });
		}

		const notes = JSON.parse(data);
		const newNote = {
			id: uuid(),
			title: req.body.title,
			text: req.body.text,
		};
		notes.push(newNote);

		fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(notes), (err) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ error: "Error saving note" });
			}

			return res.status(201).json(newNote);
		});
	});
});

app.delete("/api/notes/:id", (req, res) => {
	fs.readFile(path.join(__dirname, "db/db.json"), "utf8", (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ error: "Error reading notes" });
		}

		let notes = JSON.parse(data);
		const noteId = req.params.id;
		const filteredNotes = notes.filter((note) => note.id !== noteId);

		fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(filteredNotes), (err) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ error: "Error reading notes" });
			}

			return res.status(204).send();
		});
	});
});

app.get("/notes", (req, res) => {
	res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
	console.log(`Notetaker app listening on port ${PORT}`);
});