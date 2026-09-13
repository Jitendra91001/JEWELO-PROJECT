import { Router, Request, Response } from "express";
import { openapiSpec } from "../docs/openapiSpec";

const router = Router();

router.get("/swagger.json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  return res.json(openapiSpec);
});

router.get("/", (req: Request, res: Response) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jewelo API Documentation | Haute Horlogerie & High Jewellery</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --jewelo-gold: #c5a880;
      --jewelo-dark: #0f172a;
      --jewelo-bg: #faf9f6;
    }
    body {
      margin: 0;
      padding: 0;
      background: var(--jewelo-bg);
      font-family: 'Montserrat', sans-serif;
    }
    .topbar-header {
      background: #0b0f19;
      color: #fff;
      padding: 1.25rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid var(--jewelo-gold);
    }
    .topbar-header h1 {
      margin: 0;
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.85rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #f8fafc;
    }
    .topbar-header span {
      color: var(--jewelo-gold);
      font-size: 0.85rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      font-weight: 500;
    }
    .swagger-ui .topbar { display: none; }
    .swagger-ui {
      max-width: 1300px;
      margin: 0 auto;
      padding: 1.5rem 2rem 4rem 2rem;
    }
    .swagger-ui .info .title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 2.4rem;
      color: var(--jewelo-dark);
    }
    .swagger-ui .btn.authorize {
      background: var(--jewelo-gold) !important;
      border-color: var(--jewelo-gold) !important;
      color: #0b0f19 !important;
      font-weight: 600;
      border-radius: 4px;
    }
    .swagger-ui .opblock.opblock-post { border-color: #10b981; background: rgba(16, 185, 129, 0.05); }
    .swagger-ui .opblock.opblock-get { border-color: #3b82f6; background: rgba(59, 130, 246, 0.05); }
    .swagger-ui .opblock.opblock-patch { border-color: #f59e0b; background: rgba(245, 158, 11, 0.05); }
    .swagger-ui .opblock.opblock-delete { border-color: #ef4444; background: rgba(239, 68, 68, 0.05); }
  </style>
</head>
<body>
  <div class="topbar-header">
    <div>
      <h1>JEWELO MAISON</h1>
    </div>
    <div>
      <span>Official API Documentation & Specification</span>
    </div>
  </div>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      window.ui = SwaggerUIBundle({
        url: "/api/v1/docs/swagger.json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "BaseLayout"
      });
    };
  </script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html");
  return res.send(html);
});

export default router;
