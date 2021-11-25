export const StorageConfig = {
    slika: {
        destinacija: '../storage/slike/',
        maxSize: 1024 * 1024 * 5,
        resize: {
            thumb: {
                width: 120,
                height: 100,
                directory: 'thumb/'
            },
            small: {
                width: 320,
                height: 240,
                directory: 'small/'
            }
        }
    }
};