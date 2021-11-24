import * as path from "https://deno.land/std@0.115.1/path/mod.ts";
export class OakFileSysRouting {
    methodsLetters = ["g_", "p_", "d_", "put_"]
    getCtrPathname(p: string) {
        let m = "" // method  
        if (p.startsWith("g_")) { m = "GET"; p = p.replace("g_", "") }

        if (p.startsWith("p_")) { m = "POST"; p = p.replace("p_", "") }

        if (p.startsWith("d_")) { m = "DELETE"; p = p.replace("d_", "") }

        if (p.startsWith("put_")) { m = "PUT"; p = p.replace("put_", "") }
        return {
            m,
            p
        }
    }

    getMatchPath(pp: string) {
        let isValideSyntaxe = true
        let { m, p } = this.getCtrPathname(pp)
        let mathPath = ""
        if (!m) {
            console.error(" pathname must start  by ", "g_", "p_", "d_", "put_")
        }
        if (m) {
            let ext = ""
            if(p && p == ".ts") {
                ext = ".ts" 
            } else{
                ext = path.extname(p)
            }

            
            console.log({ ext })
            if (ext == ".ts") {
                p = p.replace(".ts", "")
                // test if p contient [
                if (!p.includes("[")) {
                    mathPath = p
                    console.log({ mathPath })
                }
                if (p.includes("[")) {
                    // verifier que les [ sont ferme
                    const pSlashArray = p.split("[")
                    const pSlashArray1 = pSlashArray.slice(1)
                    console.log({ pSlashArray1 })
                    for (const item of pSlashArray1) {
                        // count le ] dans item
                        if (!item.includes("]", 1)) {
                            isValideSyntaxe = false
                        }

                    }
                    mathPath = p.replaceAll("[", "/:").replaceAll("]", "/")
                    if (mathPath.at(-1) == "/") {
                        mathPath = mathPath.slice(0, -1)
                    }
                    console.log({ mathPath })
                }
            }
            if (ext != ".ts") {
                console.log("ext supported are : .ts ")
                isValideSyntaxe = false
            }
        }

        return {
            mathPath,
            p,
            m,
            isValideSyntaxe
        }

    }

    getFullMapping(fileName: string, directoryPath: string) { 
        const f = fileName
        let { mathPath, m, isValideSyntaxe } = this.getMatchPath(fileName)
        if(isValideSyntaxe ){
            mathPath = path.join(directoryPath, mathPath) 
            m = m.toLowerCase() 
            const t = this.linkTemplate(
                f, m, mathPath, directoryPath
            )
            console.log(" just  befor export { routes } in server_routes/init_app.ts")
            console.log("copy and past the following code  ")
            console.log("")
            console.log(t)
            console.log("")
            const fPath = `${directoryPath}/${f}`
            const ctr = this.ctrTemplate(`./pagesCtrl/${fPath}`)
            try {
                Deno.writeTextFileSync(`./pagesCtrl/${fPath}`,ctr)
            } catch (e) {
                console.log(e)
            }
           
            // save params in sqlitedb then regenarate /pagesCtr.ts
            // write this in server_routes/pagesCtr.ts
        }else{
            console.log("invalid syntax, can't create route")
        }

    }

    private linkTemplate(f: string, m: string, mathPath: string, directoryPath: string) {
        // convert number to string et vice versa 
        // on doit verifier que le dossier parent exist
        const fPath = `${directoryPath}/${f}`
        const tsfPath = fPath
        .replaceAll("/","_s_")
        .replaceAll("[","_lb_")
        .replaceAll("]","_rb_")
        .replaceAll(".ts","_ts")
        this.ctrTemplate("")
     
        return `
//
// deno-lint-ignore camelcase
import { fn as fn${tsfPath} } from "../pagesCtrl/${fPath}"; 
routes.${m}("/${mathPath}", async (ctx: Context) => await fn${tsfPath}(ctx)); 
        `
    }
   private ctrTemplate(relativePath:string){
       return `
import { Context } from "https://deno.land/x/oak@v10.0.0/mod.ts"; 
// deno-lint-ignore require-await
export async function fn(ctx: Context) { 
  ctx.response.body = "<h1>  ${relativePath} </h1>";
  ctx.response.headers.append(
    "content-type",
    "text/html",
  );
}
       `
   }

}
