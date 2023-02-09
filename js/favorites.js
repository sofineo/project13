import { GithubUser } from "./githubsearch.js"

export class Favorites { 
  constructor(root)  {
    this.root = document.querySelector(root)
    this.tbody = this.root.querySelector('table tbody')

    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async toFavorite(username) {
    try {
      const userExits = this.entries.find(entry => entry.login === username)

      if (userExits) {
        throw new Error(`User's already favorited!`)
      }

      const user = await GithubUser.search(username)
      console.log(user)
      if (user.login === undefined) {
        throw new Error(`User not found.`)
      }
      this.entries = [user, ...this.entries]
      this.update()
      this.save()
    } catch (error) {
      alert(error.message)
    }    
  }

  delete(user) {
    const filteredEntries = this.entries.filter(entry => 
      entry.login !== user.login
    )

    this.entries = filteredEntries
    this.update()
    this.save()
  }
}

export class FavoriteView extends Favorites {
 constructor(root) {
  super(root)

   this.update()
   this.addFavorite()
 }

 addFavorite() {
  const btnFavorite = this.root.querySelector('.search-bar button')
  btnFavorite.onclick = () => {
    const { value } = this.root.querySelector('.search-bar input')
    this.toFavorite(value)
  }
  this.root.querySelector('.search-bar input').addEventListener('keydown', keyEnter => {
    if (keyEnter === 'Enter') {
      const { value } = this.root.querySelector('.search-bar input')
      this.toFavorite(value)
    }
  })
}

 update() {
  this.removeAlltr()
  this.hideToggle()

  this.entries.forEach( user => {
    const row = this.createRow()

    row.querySelector('.user img').src = `https://github.com/${user.login}.png`
    row.querySelector('.user img').alt = `Image of ${user.name}`
    row.querySelector('.username p').textContent = `${user.name}`
    row.querySelector('.username a').href = `${user.html_url}`
    row.querySelector('.username a span').textContent = `/${user.login}`
    row.querySelector('.repositories').textContent = `${user.public_repos}`
    row.querySelector('.followers').textContent = `${user.followers}`
    row.querySelector('.btn-remove').onclick = () => {
      const confirmDelete = confirm(`Are you sure you want to delete this favorite?`)

      if (confirmDelete) {
        this.delete(user)
      }
    }

    this.tbody.append(row)
  })
 }

 removeAlltr() {
  this.tbody.querySelectorAll('tr').forEach((tr) => {
    tr.remove()
  })
 }

 hideToggle() {
  const noFav = this.root.querySelector('.nofav')
  let index = Number(this.entries.length)

  if (index == 0) {
    noFav.classList.remove("hide")
    this.tbody.classList.add("hide")
  } else {    
    noFav.classList.add("hide")
    this.tbody.classList.remove("hide")
  }

 }

 createRow() {
  const tr = document.createElement('tr')
  tr.innerHTML = `
  <td class="user"> 
   <img src="https://avatars.githubusercontent.com/u/6643122?v=4" alt=""> 
     <div class="username">
       <p>Mayk Brito</p> 
      <a href="" target="_blank"> <span>/maykbrito</span> </a>
     </div>
   </td>
  <td class="repositories">123</td>
  <td class="followers">1234</td>
  <td class="btn-remove"> <button>Remove</button></td>`

  return tr
 }

}

