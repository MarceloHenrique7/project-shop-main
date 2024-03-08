const menuItem = document.querySelectorAll('.item-menu')



function selectLink() {
    menuItem.forEach((item) => {
        item.classList.remove('active')
    })
    this.classList.add('active')
}



menuItem.forEach((item) => {
    item.addEventListener("click", selectLink)
})



const btnExp = document.querySelector('#btn-exp')
const menuSide = document.querySelector('.side-menu')


btnExp.addEventListener('click', function() {
    menuSide.classList.toggle('expandir')
})