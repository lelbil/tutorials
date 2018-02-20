const { client, index, type } = require('./connection')

module.exports = {
    queryTerm (query, from = 0) {
        const body = {
            from, //offset
            query: {
                match: {
                    text: {
                        query,
                        operator: "and",
                        fuzziness: "auto",
                    }
                }
            },
            highlight: { fields: { text: {} }},
        }

        return client.search({index, type, body})
    }
}