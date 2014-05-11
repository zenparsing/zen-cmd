
export class ConsoleIO {

    constructor() {
    
        this._inStream = process.stdin;
        this._outStream = process.stdout;
        
        this._outEnc = "utf8";
        this._inEnc = "utf8";
        
        this.inputEncoding = "utf8";
        this.outputEncoding = "utf8";
    }
    
    get inputEncoding() { 
    
        return this._inEnc;
    }
    
    set inputEncoding(enc) {
    
        this._inStream.setEncoding(this._inEnc = enc);
    }
    
    get outputEncoding() {
    
        return this._outEnc;
    }
    
    set outputEncoding(enc) {
    
        this._outStream.setEncoding(this._outEnc = enc);
    }
    
    readLine() {
    
        return new Promise(resolve => {
        
            var listener = data => {
            
                resolve(data);
                this._inStream.removeListener("data", listener);
                this._inStream.pause();
            };
            
            this._inStream.resume();
            this._inStream.on("data", listener);
        });
    }
    
    writeLine(msg) {
    
        console.log(msg);
    }
    
    write(msg) {
    
        process.stdout.write(msg);
    }
    
}
