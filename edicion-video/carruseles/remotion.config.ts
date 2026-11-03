import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
// Si Remotion no puede descargar su navegador, se puede usar uno instalado:
// REMOTION_BROWSER="C:\Program Files\Google\Chrome\Application\chrome.exe"
if (process.env.REMOTION_BROWSER) Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
