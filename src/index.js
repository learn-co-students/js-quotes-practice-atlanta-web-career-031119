
const quotesUrl = 'http://localhost:3000/quotes'

document.addEventListener('DOMContentLoaded', 
    getQuoteData(),
    document.querySelector('#new-quote-form').addEventListener('submit', addQuote)

)

function getQuoteData() {
    fetch(quotesUrl)
    .then(res => res.json())
    .then(quoteData => renderQuotes(quoteData))
}

function renderQuotes(quoteData) {
    quoteData.forEach(renderQuote)
}

function renderQuote(quote) {
    let list = document.querySelector('#quote-list')
    let quoteCard = document.createElement('li')
    quoteCard.className = "quote-card"
    quoteCard.dataset.id = quote.id

    let block = document.createElement('blockquote')
    block.className = "blockquote"

    let text = document.createElement('p')
    text.className = 'mb-0'
    text.innerText = quote.quote

    let foot = document.createElement('footer')
    foot.className = 'blockquote-footer'
    foot.innerText = quote.author

    let likBtn = document.createElement('button')
    likBtn.className = 'btn-success'
    likBtn.dataset.id = quote.likes
    likBtn.innerText = 'Likes:'
    likBtn.addEventListener('click', handleLike)

    let span = document.createElement('span')
    span.innerText = quote.likes

    let delBtn = document.createElement('button')
    delBtn.className = 'btn-danger'
    delBtn.innerText = 'Delete'
    delBtn.addEventListener('click', handleDelete )

    let space = document.createElement('br')


    likBtn.appendChild(span)
    block.appendChild(text)
    block.appendChild(foot)
    block.appendChild(space)
    block.appendChild(likBtn)
    block.appendChild(delBtn)
    quoteCard.appendChild(block)
    list.appendChild(quoteCard)
    

}

function handleLike(e) {
    let likeCount = e.target.querySelector('span')
    likeCount.innerText = parseInt(likeCount.innerText) + 1
    fetch(`http://localhost:3000/quotes/${e.target.parentElement.dataset.id}`, {
        method: "patch",
        headers: {
            "Content-Type": "application/json",  
        },
        body: JSON.stringify({
            likes: likeCount.innerText
        })
    })
}

function updateLikes(newLikes) {
    console.log(newLikes)

}

function handleDelete(e) {
    console.log('delete', e.target)
    e.target.parentElement.parentElement.remove()
   fetch(`http://localhost:3000/quotes/${e.target.parentElement.parentElement.dataset.id}`, {
        
        method: "delete"
    })
        
}

function addQuote(e) {
    console.log(e)
    e.preventDefault()
    let newQuote = {
        quote: e.target[0].value,
        author: e.target[1].value,
        likes: 0
    }
    renderQuote(newQuote)
    fetch(quotesUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newQuote)
    })
    e.target.reset
}
