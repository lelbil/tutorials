const fs = require('fs')
const path = require('path')

const esConnection = require('./connection')

const readAndInsertBooks = async () => {
    try {
        await esConnection.resetIndex()

        let files = fs.readdirSync('./books').filter(file => file.slice(-4) === '.txt')
        console.log(`Found ${files.length} files.`)

        for (let file of files) {
            console.log(`Reading ${file}`)

            const filePath = path.join('./books', file)
            const { title, author, paragraphs } = parseBookFile(filePath)

            await insertBookData(title, author, paragraphs)
        }

    } catch (error) {
        console.log('There has been an error while reading and inserting books:', error)
    }
}

const parseBookFile = filePath => {
    const book = fs.readFileSync(filePath, 'utf8')

    const title = book.match(/^Title:\s(.+)$/m)[1]
    const authorMatch = book.match(/^Author:\s(.+)$/m)
    const author = (!authorMatch || authorMatch[1].trim() === '')? 'Unknown Author' : authorMatch[1]

    console.log(`Reading book ${title} by ${author}`)

    const startOfBookMatch = book.match(/^\*{3}\s*START OF (THIS|THE) PROJECT GUTENBERG EBOOK.+\*{3}$/m)
    const startOfBookIndex = startOfBookMatch.index + startOfBookMatch[0].length
    const endOfBookIndex = book.match(/^\*{3}\s*END OF (THIS|THE) PROJECT GUTENBERG EBOOK.+\*{3}$/m).index

    const paragraphs = book
        .slice(startOfBookIndex, endOfBookIndex)
        .split(/\n\s+\n/g)
        .map(line => line.replace(/\r\n/g, ' ').trim())
        .map(line => line.replace(/_/g, ''))
        .filter(line => line && line.length !== '') //TODO: why not line.length === 0?

    console.log(`Parsed ${paragraphs.length} paragraphs`)

    return { title, author, paragraphs }
}

const insertBookData = async (title, author, paragraphs) => {
    let bulkOps = []

    for (let i = 0; i < paragraphs.length; i++) {
        bulkOps.push({ index: {_index: esConnection.index, _type: esConnection.type}})
        bulkOps.push({
            author,
            title,
            location: i,
            text: paragraphs[i],
        })

        if (i > 0 && i % 500 === 0 ) {
            await esConnection.client.bulk({ body: bulkOps })
            bulkOps = []
            console.log(`Paragraphs ${i - 499} - ${i} indexed`)
        }
    }

    await esConnection.client.bulk({ body: bulkOps })
    console.log(`Indexed Paragraphs ${paragraphs.length - (bulkOps.length / 2)} - ${paragraphs.length}\n\n\n`)

}

readAndInsertBooks()