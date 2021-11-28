export const StorageConfig = {
    slika: {
        destinacija: '../storage/slike/',
        urlPrefix: '/assets/slike',
        maxAge: 1000 * 60 * 60 * 24 * 7,
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