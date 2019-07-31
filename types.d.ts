interface URLAssembler {
    param(key: any, value: any, strict?: any): URLAssembler;
    param(params: {[s: string]: any}, strict?: boolean): URLAssembler;


    query(param: any, value: any): URLAssembler;
    query(params: {[s: string]: any}): URLAssembler;

    segment(segment: any): URLAssembler;
    prefix(prefix: any): URLAssembler;
    template(fragment: string): URLAssembler;

    toJSON(): string;
    toString(): string;
    valueOf(): string;
}

interface URLAssemblerConstructor {
    (baseURL?: string): URLAssembler;
    (urlAssembler: URLAssembler): URLAssembler;
    new (baseURL?: string): URLAssembler;
    new (urlAssembler: URLAssembler): URLAssembler;
}

declare const URLAssembler: URLAssemblerConstructor;
export = URLAssembler;
