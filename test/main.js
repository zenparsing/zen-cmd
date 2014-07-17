import { runTests } from "package:moon-unit";
import { ConsoleCommand } from "../src/ConsoleCommand.js";

export function main() {

    return runTests({
    
        "Special Names" (test) {
        
            test
            ._("Object prototype names aren't interpreted as parameter names")
            .throws($=> {
            
                new ConsoleCommand({
            
                    params: {},
                    execute() {}
                
                }).run([ "--constructor", "foobar" ]);
            });
        },
    
        "Rest Args" (test) {
        
            new ConsoleCommand({
            
                params: {
                
                    "first": {
                    
                        positional: true
                    }
                },
                
                execute(params, ...args) {
                
                    test
                    ._("Positional params are parsed")
                    .equals(params, { first: "a" })
                    ._("Args after positional params are included in rest")
                    .equals(args, [ "b", "c", "d" ])
                    ;
                }
                
            }).run([ "a", "b", "c", "d" ]);
            
            new ConsoleCommand({
            
                params: null,
                
                execute(...args) {
                
                    test
                    ._("When no params, only args are passed")
                    .equals(args, [ "a", "b", "c", "d" ])
                    ;
                }
                
            }).run([ "a", "b", "c", "d" ]);
        }
        
    });
}