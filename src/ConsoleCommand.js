const HAS = Object.prototype.hasOwnProperty;

function raise(x) {

    x.name = "CommandError";
    throw x;
}

function has(obj, name) {

    return HAS.call(obj, name);
}

function parse(argv, params) {

    if (!params)
        return argv.slice(0);

    let pos = Object.keys(params),
        values = {},
        shorts = {},
        required = [],
        list = [values];

    // Create short-to-long mapping
    pos.forEach(name => {

        let p = params[name];

        if (p.short)
            shorts[p.short] = name;

        if (p.required)
            required.push(name);
    });

    // For each command line arg...
    for (let i = 0; i < argv.length; ++i) {

        let a = argv[i],
            param = null,
            value = null,
            name = "";

        if (a[0] === "-") {

            if (a.slice(0, 2) === "--") {

                // Long named parameter
                name = a.slice(2);
                param = has(params, name) ? params[name] : null;

            } else {

                // Short named parameter
                name = a.slice(1);
                name = has(shorts, name) ? shorts[name] : "";
                param = has(params, name) ? params[name] : null;
            }

            // Verify parameter exists
            if (!param)
                raise(new Error("Invalid command line option: " + a));

            if (param.flag) {

                value = true;

            } else {

                // Get parameter value
                value = argv[++i] || "";

                if (typeof value !== "string" || value[0] === "-")
                    raise(new Error("No value provided for option " + a));
            }

        } else {

            // Positional parameter
            do {

                name = pos.length > 0 ? pos.shift() : "";
                param = name ? params[name] : null;

            } while (param && !param.positional);

            value = a;
        }

        if (param)
            values[name] = value;
        else
            list.push(value);
    }

    required.forEach(name => {

        if (values[name] === void 0)
            raise(new Error("Missing required option: --" + name));
    });

    return list;
}

export class ConsoleCommand {

    constructor(cmd) {

        this.fallback = cmd;
        this.commands = {};
    }

    add(name, cmd) {

        this.commands[name] = cmd;
        return this;
    }

    run(args) {

        // Peel off the "node" and main module args
        args || (args = process.argv.slice(2));

        let name = args[0] || "",
            cmd = this.fallback;

        if (name && has(this.commands, name)) {

            cmd = this.commands[name];
            args = args.slice(1);
        }

        if (!cmd)
            raise(new Error("Invalid command"));

        return cmd.execute.apply(cmd, parse(args, cmd.params));
    }

}
