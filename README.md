# Caricature Studio

A small Express 5 web app for generating caricatures from uploaded images. The server processes uploads in memory, sends the image to a provider adapter, and returns the generated image directly to the browser. It does not persist source images or generated results.

## Setup

```sh
npm install
cp .env.example .env
```

Set the API key for the provider you want to use. The UI lets users choose
between OpenAI and Google Gemini per generation request.

Optional environment variables:

- `OPENAI_IMAGE_MODEL`, defaults to `gpt-image-1.5`
- `IMAGE_PROVIDER`, supported values are `openai` and `google`; `.env.example` selects `openai`
- `OPENAI_API_KEY`, required when using OpenAI
- `GOOGLE_API_KEY`, required when `IMAGE_PROVIDER=google`
- `GOOGLE_IMAGE_MODEL`, defaults to `gemini-2.5-flash-image`
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

The integration tests use mocked generation providers and do not call OpenAI or Google.

## Styles

The style catalog is parsed from `prompt.txt`. Each `STYLE:` entry becomes a UI option with the bullet beneath it as the description.

## API

`POST /api/caricatures`

Multipart fields:

- `image`: JPEG, PNG, or WebP
- `provider`: `openai` or `google`
- `style`: one of the exact `STYLE` names from `prompt.txt`

Success response:

```json
{
  "imageBase64": "...",
  "mimeType": "image/png"
}
```
