# GPT Network (name WIP)

## Features

1. Search for people or topics
2. Click nodes to expand them and continue searching
3. Use the context menu (on graph nodes or in the side pane) to look up definitions and remove nodes from your graph
4. Clear your graph and start over (watch out! single graphs are stored locally, data persistence coming soon!)

## Coming soon

1. Sharing and data persistance
2. Ask your own specific questions of nodes
3. Build and inspect complex relations

## Hacking

Make a `.env.local` in the project root and add your OPENAI_API_KEY:

```.env
# .env.local
OPENAI_API_KEY=...
```

Run the development server using npm:

```bash
npm run dev
```
