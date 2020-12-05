import {elements } from "./base";

export const getInput = () => elements.searchInput.value;

export const clearInput = () =>{
    elements.searchInput.value = '';
} 

export const clearResult = () => {
    elements.searchResultList.innerHTML = '';
    elements.resPages.innerHTML = '';
}

export const highLighted = id => {
    const activeClass = document.querySelector('.results__link--active')
    if (activeClass){
        activeClass.classList.remove('results__link--active');
    }
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
}

export const limitTitle = (title, limit=17) => {
    let newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length
        }, 0)
        return `${newTitle.join(' ')}...`
    }
    return title;
}

const renderRecipe = (recipe) => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResultList.insertAdjacentHTML('beforeend', markup)
}

const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page-1: page+1}>
        <span>Page ${type === 'prev' ? page-1: page+1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left': 'right'}"></use>
        </svg>
        
    </button>
`

const renderButton = (page, numResult, number) => {
    const pages = Math.ceil(numResult/ number);
    let button;
    if (page === 1 && pages > 1){
        // Only display next page
        button = createButton(page, 'next');
    } else if(page === pages){
        // Only display previous page
        button = createButton(page, 'prev');
    }else {
        // display both next and previous page
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    }
    elements.resPages.insertAdjacentHTML('afterbegin', button);
}

export const renderResult = (recipes, page=1, number=10) => {
    const start = (page - 1) * 10;
    const end = page * 10;
    recipes.slice(start, end).forEach(renderRecipe);
    renderButton(page, recipes.length, number);
}