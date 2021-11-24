// deno run --allow-all cli.ts

// deno run --allow-all cli.ts  g_[id].ts todos
// deno run --allow-all cli.ts g_.ts todos
// deno run --allow-all cli.ts  g_test[id].ts child/todo
import { OakFileSysRouting } from "./cli/oakFileSysRouting.ts";
let isMatch = false 
if( !isMatch && Deno.args.length == 2 ){
    isMatch = true 
    console.log(Deno.args)
    const o = new OakFileSysRouting()
    o.getFullMapping(  Deno.args[0] ,  Deno.args[1]  ) 
}

 

 
 if(!isMatch){
     console.log(" you need to write command with right pararams")
     console.log("only one command ")
     console.log(" deno run --allow-all cli.ts   {filename} {relative directory path} ")
     console.log(" example : ")
     console.log("deno run --allow-all cli.ts g_.ts todos")
     console.log("todos directory must exist in pagesCtrl")
     console.log("start template will be in ... github")
     console.log(" deno run --allow-all cli.ts  g_[id].ts todos")
 }