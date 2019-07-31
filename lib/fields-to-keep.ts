export module selectURLFields {
    const urlFieldsToKeep: string[] = [
        'protocol',
        'slashes',
        'auth',
        'host',
        'port',
        'hostname',
        'hash',
        'search',
        //'query',
        'pathname',
        'path',
        'href'
    ];
    export function getURLFieldsToKeep(assembler: any): string[] {
        return urlFieldsToKeep.reduce((previousValue: string[], currentValue: string) => {
            previousValue[currentValue] = assembler[currentValue];
            return previousValue;
        }, []);
    }
}
