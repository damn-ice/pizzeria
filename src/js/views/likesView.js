import {elements} from './base';
import {limitTitle} from './searchView';

export const toggleLikeBtn = isLiked => {
    // <use href="img/icons.svg#icon-heart-outlined"></use>
    const iconHeart = isLiked ? 'icon-heart': 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconHeart}`);
}

export const toggleLikeMenu = (numLikes) => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible': 'hidden';
}

export const renderLike = like => {
    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${limitTitle(like.title)}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitTitle(like.title)}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>
    `
    elements.likesList.insertAdjacentHTML('beforeend', markup);
}

export const deleteLike = id => {
    const el = document.querySelector(`.likes__link[href="#${id}"]`).parentElement;
    if (el) el.parentElement.removeChild(el);
}