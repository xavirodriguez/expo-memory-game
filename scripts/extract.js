import scanner from "i18next-scanner";
import { Transform } from "stream";

const config = {
  input: ["src/**/*.{ts,tsx}"],
  output: "./src/i18n/locales/",
  options: {
    func: { list: ["t"], extensions: [".ts", ".tsx"] },
    lngs: ["en", "es"],
    defaultLng: "en",
    resource: {
      loadPath: "{{lng}}/{{ns}}.json",
      savePath: "{{lng}}/{{ns}}.json",
      jsonIndent: 2,
    },
  },
};

// Ejecutar scanner
scanner.createStream(config.options).pipe(
  new Transform({
    objectMode: true,
    transform(chunk, encoding, done) {
      console.log("Extracted:", chunk.toString());
      done(null, chunk);
    },
  })
);
