// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading.
const url = 'http://localhost:3000/quotes'
const addQuoteForm = document.querySelector('#new-quote-form')
const quoteList = document.querySelector('#quote-list')
document.addEventListener('DOMContentLoaded', fetchQuotes())
const sort = document.querySelector('#sort-quotes')
sort.addEventListener('click', sortQuotes)

function sortQuotes(){
    clearQuotes()
    fetch(url)
    .then(res => res.json())
    .then(quotes => quotes.sort(function(a, b){
        return b.likes - a.likes
    }))
    .then(quotes => quotes.forEach(quote => renderQuoteView(quote)))
}

function fetchQuotes(){
    clearQuotes()
    fetch(url)
    .then(res => res.json())
    .then(quotes => quotes.forEach(quote => renderQuoteView(quote)))
}

addQuoteForm.addEventListener('submit', handleForm)


function renderQuoteView(quote){

    let li = document.createElement('li')
    li.className = 'quote-card'
    li.dataset.id = quote.id

    let blockquote = document.createElement('blockquote')
    blockquote.className = 'blockquote'

    let p = document.createElement('p')
    p.className = 'mb-0'
    p.innerText = quote.quote

    let footer = document.createElement('footer')
    footer.className = 'blockquote-footer'
    footer.innerText = quote.author

    let likebtn = document.createElement('button')
    likebtn.className = 'btn-success'
    likebtn.innerText = 'Likes:'
    likebtn.addEventListener('click', handleLike)

    let span = document.createElement('span')
    span.innerText = quote.likes
    likebtn.appendChild(span)

    let delbtn = document.createElement('button')
    delbtn.className = 'btn-danger'
    delbtn.innerText = 'Delete'
    delbtn.addEventListener('click', handleDel)

    let editbtn = document.createElement('button')
    editbtn.className = 'btn-warning'
    editbtn.innerText = 'Edit'
    editbtn.addEventListener('click', handleEdit)

    let editDiv = document.createElement('div')
    editDiv.style = "display:none;"
    editDiv.className = "edit-form"
    let editForm = document.createElement('form')
    editForm.dataset.id = quote.id
    editForm.innerHTML =    `<label for="edit-quote">Quote:</label><br>`+
                            `<textarea id="edit-quote" rows="5" columns="20">${quote.quote}</textarea><br>`+
                            `<label for="edit-author">Author:</label><br>` +
                            `<input type="text" id="edit-author" value="${quote.author}"/><br>`
    let submitEdit = document.createElement('button')
    submitEdit.type = "submit"
    submitEdit.innerText = "Submit Changes"
    editForm.appendChild(submitEdit)
    editDiv.appendChild(editForm)

    editForm.addEventListener('submit', handleEditForm)
    
    
    blockquote.appendChild(p)
    blockquote.appendChild(footer)
    blockquote.appendChild(document.createElement('br'))
    blockquote.appendChild(likebtn)
    blockquote.appendChild(delbtn)
    blockquote.appendChild(editbtn)
    blockquote.appendChild(editDiv)
    li.appendChild(blockquote)
    quoteList.appendChild(li)
    
}

function handleForm(e){
    e.preventDefault()
    let form = e.target
    let newQuote = new Quote(form.querySelector('#new-quote').value, form.querySelector('#author').value)
    createQuote(newQuote)
    form.reset()
    fetchQuotes()
}

function createQuote(newQuote){
    renderQuoteView(newQuote)
    fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newQuote)
    })
}

function clearQuotes(){
    while (quoteList.firstChild){
        quoteList.removeChild(quoteList.firstChild)
    }
}

function handleDel(e){
    let quote =e.target.parentElement.parentElement
    let id = quote.dataset.id
    quote.remove()
    fetch(url +`/${id}`, {
        method: 'DELETE'
    })


}

function handleLike(e){
    e.preventDefault()
    let quote = e.target.parentElement.parentElement
    let id = quote.dataset.id
    let likes = e.target.querySelector('span').innerText
    likes = parseInt(likes) + 1
    e.target.querySelector('span').innerText = likes
    fetch(`http://localhost:3000/quotes/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'likes': likes
        })
    })
    .catch(errors => errors.forEach(error=>console.log("ERROR:", error)))
}

function handleEdit(e){
    let editForm = e.target.parentElement.querySelector('.edit-form')
    editForm.style = "display:block;"

}

function handleEditForm(e){
    e.preventDefault()
    let id = e.target.dataset.id
    let editQuote = e.target.querySelector('#edit-quote').value
    let editAuthor = e.target.querySelector('#edit-author').value
    e.target.parentElement.parentElement.querySelector('p').innerText = editQuote
    e.target.parentElement.parentElement.querySelector('footer').innerText = editAuthor
    
    fetch(url+`/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            quote: editQuote,
            author: editAuthor
        })
    })
}