const vm = new Vue({
    el: "#vue-instance",
    data() {
        return {
            baseUrl: 'http://localhost:3000',
            searchTerm: 'Hello World',
            searchDebounce: null,
            searchResults: [],
            numHits: null,
            searchOffset: 0,
            selectedParagraph: null,
            bookOffset: 0,
            paragraphs: []
        }
    },
    async created () {
        this.searchResults = await this.search()
    },
    methods: {
        onSearchInput() {
            clearTimeout(this.searchDebounce)
            this.searchDebounce = setTimeout(async () => {
                this.searchOffset = 0
                this.searchResults = await this.search()
            }, 100)
        },
        async search() {
            const response = await axios.get(`${this.baseUrl}/search`, {
                params: { term: this.searchTerm, offset: this.searchOffset}
            })
            this.numHits = response.data.hits.total
            return response.data.hits.hits
        },
        async nextResultsPage () {
            if (this.numHits > 10) {
                this.searchOffset += 10
                if (this.searchOffset + 10 > this.numHits) this.searchOffset = this.numHits - 10
                this.searchResults = await this.search()
                document.documentElement.scrollTop = 0
            }
        },
        async prevResultsPage () {
            this.searchOffset -= 10
            if (this.searchOffset < 0) this.searchOffset = 0
            this.searchResults = await this.search()
            document.documentElement.scrollTop = 0
        }
    }
})