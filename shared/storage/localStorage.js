function createBaseStorage() {
    var dataStorage = [];
    return {
        getItem: function (key) {
            return dataStorage[key];
        },
        setItem: function (key, value) {
            if( typeof dataStorage[key] == 'undefined'){
                this.length = this.length + 1;
            }

            dataStorage[key] = value;
        },
        removeItem: function (key) {
            delete dataStorage[key];
            this.length = this.length - 1;
        },
        clear: function () {
            dataStorage = [];
            this.length = 0;
        },
        key: function (index = 0) {
            let i = 0;
            for (var key in dataStorage) {
                if (i == index) {
                    return key;
                }
                i++;
            }
            return null;
        },
        length: dataStorage.length
    };
};

function getLocalStorage() {
    return window.localStorage || createBaseStorage();
};

export default getLocalStorage();
