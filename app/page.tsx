import { Interface } from "./Interface";
import { readFile } from "fs/promises"
import { languages, variants } from "./programs"

export default async function Main() {
  let programs = []
  for (const languageName in languages) {
    if (Object.prototype.hasOwnProperty.call(languages, languageName)) {
      const language = languages[languageName]
      let programVariants = []
      for (const variant in variants) {
        if (Object.prototype.hasOwnProperty.call(variants, variant)) {
          const program = await readFile(`./app/programs/${variant}.${language.extension}`, "utf-8")
          programVariants.push({
            variantName: variant,
            source: program,
            languageName: languageName
          })
        }
      }
      programs.push(programVariants)
    }
  }

  return <Interface programs={programs} />
}
