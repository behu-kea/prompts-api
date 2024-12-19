const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// In-memory storage
let prompts = [];
let idCounter = 1; // Simple ID generator

// Create a prompt
app.post('/prompts', (req, res) => {
  const { title, description, promptText, model } = req.body;
  const newPrompt = { id: idCounter++, title, description, promptText, model };
  prompts.push(newPrompt);
  res.status(201).json(newPrompt);
});

// Get all prompts
app.get('/prompts', (req, res) => {
  res.json(prompts);
});

// Get a single prompt
app.get('/prompts/:id', (req, res) => {
  const prompt = prompts.find(p => p.id === parseInt(req.params.id));
  if (!prompt) return res.status(404).send('Prompt not found');
  res.json(prompt);
});

// Update a prompt
app.put('/prompts/:id', (req, res) => {
  const { title, description, promptText, model } = req.body;
  const promptIndex = prompts.findIndex(p => p.id === parseInt(req.params.id));
  if (promptIndex === -1) return res.status(404).send('Prompt not found');
  
  prompts[promptIndex] = { 
    ...prompts[promptIndex], 
    title: title ?? prompts[promptIndex].title, 
    description: description ?? prompts[promptIndex].description, 
    promptText: promptText ?? prompts[promptIndex].promptText,
    model: model ?? prompts[promptIndex].model
  };
  
  res.json(prompts[promptIndex]);
});

// Delete a prompt
app.delete('/prompts/:id', (req, res) => {
  const promptIndex = prompts.findIndex(p => p.id === parseInt(req.params.id));
  if (promptIndex === -1) return res.status(404).send('Prompt not found');
  
  const deleted = prompts.splice(promptIndex, 1)[0];
  res.json(deleted);
});

// Allow all requests
app.use((req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
