import URLAssembler = require("../types");
import extend = require("extend");
import qs = require("qs");
import url = require("url");


export class URLAssemblerFactory {
    query: object = {};
    methods = URLAssembler.prototype;

    pathname: string = '';
    _prefix: string = '';


    constructor(private request?: any) {
        this.methods._chain = () => {
            return new URLAssemblerFactory();
        };

        this.methods.template = (fragment: string) => {
            const chainable = this.methods._chain;

            chainable.pathname = this._prefix + encodeURI(fragment);
            return chainable;
        };

        this.methods.segment = (segment: string) => {
            const chainable = this.methods._chain;

            chainable.pathname = this.pathname + encodeURI(segment);
            return chainable;
        };

        this.methods.toString = () => {
            return url.format(this);
        };

        this.methods.valueOf = this.methods.toString;
        this.methods.toJSON = this.methods.toString;

        this.methods.query = (param: string, value: string) => {
            const chainable = this.methods._chain;

            chainable._query(param, value);
            return chainable;
        };

        this.methods.prefix = (prefix: string) => {
            const chainable = this.methods._chain;
            const pathToKeep = this.pathname.substr(this._prefix.length);

            chainable._prefix = this._prefix + encodeURI(prefix);
            chainable.pathname = chainable._prefix + pathToKeep;
            return chainable;
        };

        this.methods.param =  (key: string, value: any, strict?: boolean) => {
            if (typeof key === 'object') {
                return this._multiParam(this, key, (value === true));
            }

            const chainable = this.methods._chain;
            const previous = this.pathname;
            const symbol = ':' + key;

            chainable.pathname = this.pathname.replace(symbol, encodeURIComponent(value));
            if (!strict && chainable.pathname === previous) {
                return chainable.query(key, value);
            }
            return chainable;
        };
    }

    _multiParam(chainable: any, hash: object, strict: boolean): any {
        Object.keys(hash).forEach(key => {
            chainable.param(key, hash[key], strict);
        });

        return chainable;
    }

    URLAssembler(baseURLorURLAssembler: any) {
        if (!(this instanceof URLAssembler)) {
            return new URLAssembler(baseURLorURLAssembler);
        }

        //   this.getParsedQuery = clone.bind(null, query);

        Object.defineProperty(this, '_requestModule', {
            value: this.request, writable: true
        });

        if (baseURLorURLAssembler instanceof URLAssembler) {
            this.initWithInstance(this, baseURLorURLAssembler);
        } else if (baseURLorURLAssembler) {
            this.initWithBaseURL(this, baseURLorURLAssembler);
        }
    }

    initWithBaseURL(self: URLAssemblerFactory, baseURL: string) {
        extend(self, selectUrlFields(url.parse(baseUrl)));
        self._prefix = self.pathname;
        if (self._prefix === '/') {
            self._prefix = '';
            self.pathname = '';
        }
        if (self.search && self.search.length > 1) {
            const parsedQuery = qs.parse(self.search.substr(1))
            self._query(parsedQuery)
        }
    }

    initWithInstance(self: URLAssemblerFactory, instance: URLAssembler) {
        extend(self, selectUrlFields(instance));
        self._prefix = instance._prefix;
        self._query(instance.getParsedQuery());
        self._requestModule = instance._requestModule;
    }

    static nullOrUndefined(value: any) {
        return value === null || value === undefined;
    }

    static clone(obj: object) {
        return extend(true, {}, obj);
    }
}
