import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import * as searchView from "./views/searchView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import * as recipeView from "./views/recipeView";
import {elements, renderLoader, clearLoader} from "./views/base"
import Likes from "./models/Likes";


const state = {};
// window.state = state;
// window.l = new List();
/* 
    SEARCH FUNCTIONALITY...
*/
const controlSearch = async () => {
    // Get Query from view
    const query = searchView.getInput();
    // console.log(query);
    if (query) {
        // New Search Object added to state...
        state.search = new Search(query);
        // Prepare UI for Results...
        searchView.clearInput();
        searchView.clearResult();
        // recipeView.clearRecipe();
        renderLoader(elements.searchRes);
        // Search for recipes...
        try {
            await state.search.getData();
            clearLoader()
            // Render data to UI
            // console.log(state.search.result)
            searchView.renderResult(state.search.result);
            
        } catch (err){
            elements.searchResultList.insertAdjacentHTML('beforeend', '<h2 style="text-align:center">Something is Wrong!</h2>')
            console.log(err, 'Error Searching');
        }      
    }
}

elements.searchForm.addEventListener("submit", (event) => {
    // Prevents the page from reloading on submission...
    event.preventDefault();
    controlSearch();
})

// Event Delegation...
elements.resPages.addEventListener('click', event => {
    // Closest selector moving upwards...
    const btn = event.target.closest('.btn-inline')
    if (btn) {
        const goTo = parseInt(btn.dataset.goto, 10);
        searchView.clearResult();
        searchView.renderResult(state.search.result, goTo);
    }
})

/*
    RECIPE FUNCTIONALITY
*/

const controlRecipe = async () =>{
    const id = window.location.hash.replace('#', '');
    // console.log(id);
    if (id){
        // Prepare the UI for changes...
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        // HighLight selected
        if (state.search){
            searchView.highLighted(id);
        }
        // Create New Recipe object...
        state.recipe = new Recipe(id);
        // Get recipe data
        try {
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            // Calc Time and Servings...
            state.recipe.calcServings();
            state.recipe.calcTime();
            // state.recipe.parseIngredients();
            // Render Recipe...
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        }catch (err){
            console.log(err, 'Error Processing recipe');
        }
        
    }
}


// window.addEventListener('hashchange', controlRecipe);
['hashchange', 'load'].forEach(eve => window.addEventListener(eve, controlRecipe))
// let test = new Recipe(state.search.result[0].recipe_id)
// let test = new Recipe(47746);
// test.getRecipe();

/* List Controller*/
const controlList = () => {
    // if no list create new list obj..btn
    if (!state.list) state.list = new List();
    // Add each ingredient to the list and UI...
    state.recipe.ingredients.forEach(cur => {
        let {count, unit, ingredient} = cur;
        const item = state.list.addItem(count, unit, ingredient);
        listView.renderItem(item);
    })
}
// Handle delete and update list item events...
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle delete...
    if (e.target.matches('.shopping__delete, .shopping__delete *')){
        state.list.deleteItem(id);
        listView.deleteItem(id);
    }else if (e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
})


/*
LIKE CONTROLLER
*/ 
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    // const currentID = state.recipe.id;
    const {id, title, author, img} = state.recipe;
    if (!state.likes.isLiked(id)){
        // Add like to state
        const newLike = state.likes.addLike(id, title, author, img)
        // Toggle the button
        likesView.toggleLikeBtn(true);
        // Add like to UI
        likesView.renderLike(newLike);
    }else {
        // Remove like to state
        state.likes.deleteLike(id)
        // Toggle the button
        likesView.toggleLikeBtn(false);
        // Remove like from UI
        likesView.deleteLike(id);
        
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}

window.addEventListener('load', e => {
    state.likes = new Likes();
    state.likes.readStorage();
    // Display Heart if likes > 0...
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    // Add likes to UI
    state.likes.likes.forEach(likesView.renderLike);
})

// Handling Recipe button clicks... 
elements.recipe.addEventListener('click', e => {
    //   Closest method wasn't used here because we want to match more than one thing...
    if (e.target.matches('.btn-decrease, .btn-decrease *')){
        // Decrease Button
        if (state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingIngredient(state.recipe)
        }
    }else if (e.target.matches('.btn-increase, .btn-increase *')){
        // Increase Button
        state.recipe.updateServings('inc');
        recipeView.updateServingIngredient(state.recipe);
    }else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')){
        controlLike();
    }
})
