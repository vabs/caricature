# Caricature Studio

A small Express 5 web app for generating caricatures from uploaded images. The server processes uploads in memory, sends the image to a provider adapter, and returns the generated image directly to the browser. It does not persist source images or generated results.

## Setup

```sh
npm install
cp .env.example .env
```

Set `OPENAI_API_KEY` in `.env`.

Optional environment variables:

- `OPENAI_IMAGE_MODEL`, defaults to `gpt-image-1.5`
- `PORT`, defaults to `3000`
- `MAX_UPLOAD_MB`, defaults to `10`

## Run

```sh
npm run dev
```

Open `http://localhost:3000`.

## Test

```sh
npm test
```

The integration tests use a mocked generation provider and do not call OpenAI.

## API

`POST /api/caricatures`

Multipart fields:

- `image`: JPEG, PNG, or WebP
- `style`: one of `friendly-cartoon`, `editorial-exaggeration`, `vintage-comic`, `studio-mascot`

Success response:

```json
{
  "imageBase64": "...",
  "mimeType": "image/png"
}
```
