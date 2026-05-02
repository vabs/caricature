# Caricature Studio

A small Express 5 web app for generating caricatures from uploaded images. The server processes uploads in memory, sends the image to a provider adapter, and returns the generated image directly to the browser. It does not persist source images or generated results.

<img width="1193" height="619" alt="UI" src="https://github.com/user-attachments/assets/1d963137-2af3-4a5f-9ee6-991b30714d1b" />



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

The supported caricature styles are:

- `Ink_Wash_Classic`: Expressive ink outlines with soft grayscale washes, paper texture, elegant brush strokes.
- `Bold_Vector_Pop`: Thick clean outlines, flat bold colors, high contrast, poster-like, minimal shading.
- `Pencil_Sketch_Studio`: Fine graphite lines, cross-hatching, subtle smudges, sketchbook feel.
- `Charcoal_Drama`: Deep blacks, smudged charcoal, heavy shadows, dramatic light.
- `Watercolor_Whimsy`: Loose watercolor blooms, soft edges, gentle color gradients, light paper texture.
- `Woodcut_Vintage`: Carved line texture, high-contrast black and white, vintage print look.
- `Comic_Strip_Satire`: Clean comic linework, simple cel shading, punchy expressions, speech-bubble-ready.
- `Claymation_3D`: Soft clay surfaces, rounded forms, subtle fingerprints, studio lighting.
- `Lowpoly_Faceted`: Geometric facets, angular planes, sharp edges, vivid but limited palette.
- `Neon_Retro_Chrome`: 80s airbrush feel, chrome highlights, neon accents, glossy finish.

Each style is exposed by the app and used as the exact `style` value in requests.

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
