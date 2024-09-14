

const searchData = (data, searchInput, searchField) => {
    try {
        let newData = data.filter((item) => {
            if (item[searchField].match(searchInput)) {
                return item;
            }
        })
        return newData;
    } catch {
        return []
    }
}

export {
    searchData
}