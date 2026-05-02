

const searchData = (data, searchInput, searchField) => {
    try {
        return data.filter((item) => {
            try {
                return item[searchField].match(searchInput);
            } catch {
                return false;
            }
        });
    } catch {
        return [];
    }
};

export {
    searchData
}