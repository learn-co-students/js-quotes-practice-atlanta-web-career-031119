const quoteList = document.querySelector('#quote-list')
const newQuoteForm = document.querySelector('#new-quote-form')

function initPage(){
  //this is a replacement for domcontentloaded since we're using defer
  fetchQuotes()

  newQuoteForm.addEventListener('submit', createQuote)
  quoteList.addEventListener('click', handleQuote)
}
initPage()

function fetchQuotes() {
  fetch ('http://localhost:3000/quotes')
    .then(res => res.json())
    .then(quotes => quotes.forEach(renderQuote))
}

function renderQuote(quote) {
  let quoteCard = document.createElement('li')
  quoteCard.className = 'quote-card'
  quoteCard.innerHTML = `
  <blockquote class='blockquote'>
    <p class='mb-0'> ${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
    <button data-likes='${quote.likes}' class='btn-success'>Likes: <span id='like-count'>${quote.likes}</span></button>
    <button data-id='${quote.id}'class='btn-danger'>Delete</button>
  </blockquote>`
  quoteList.appendChild(quoteCard)
}

function createQuote(e) {
  e.preventDefault()
  let data = {
    quote: e.target[0].value,
    author: e.target[1].value,
    likes: 0
  }

  fetch('http://localhost:3000/quotes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(res => renderQuote(res))
    e.target.reset()
}

function handleQuote(e) {
  if (e.target.className == 'btn-danger'){
    //delete quote off dom
    e.target.parentElement.parentElement.remove()
    //make delete request (deletes quote from database)
    fetch(`http://localhost:3000/quotes/${e.target.dataset.id}`, {
      method: 'DELETE'
    })
  }
  if (e.target.className == 'btn-success'){
    //update the dom
    let likeCountSpan = e.target.querySelector('#like-count')
    likeCountSpan.innerText = parseInt(likeCountSpan.innerText, 10) + 1
    e.target.dataset.likes = likeCountSpan.innerText
    //update the database
    fetch(`http://localhost:3000/quotes/${e.target.nextElementSibling.dataset.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        likes: likeCountSpan.innerText
      })
    })
  }
}
