const storage = new Map();

export function store(key: string | Symbol, value: any) {
    storage.set(key, value)
}

export function retrieve(key: string | Symbol) {
    return storage.get(key)
}