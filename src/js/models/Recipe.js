import axios from 'axios';

export default class Recipe {
    constructor (id) {
        this.id = id;
    }

    async getRecipe (){
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.ingredients = res.data.recipe.ingredients;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
        }catch (err){
            console.log(err);
            alert('Something went wrong...')
        }
    }
    calcTime() {
        // Assuming we need 15 mins for every 3 ingredient...
        const numIng = this.ingredients.length;
        this.time =  Math.ceil(numIng / 3) * 15;
    }
    calcServings() {
        this.servings = 4;
    }
    parseIngredients() {
        // unit to be replaced and replacement...
        const unitLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitShort, 'g', 'kg'];
        // Looping through the array of ingredients...
        const newIng = this.ingredients.map(el => {
            // Convert everything to lower...
            let ingredient = el.toLowerCase();
            // Looping through items to be replaced on the ingredient and replacing it...
            unitLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitShort[i]);
            })
            // Remove Parenthesis using regex...
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ") 
            // Parse Ingredient into count, unit and ingredient...
            // Splitting the formatted string into Array using ' ' as delimiter...
            const arrIng = ingredient.split(' ');
            // Finding the index of unit ...
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
            
            let objIng;
            if (unitIndex > -1){
                // There is a unit
                // Assuming everything before the unit is the count...
                const arrCount = arrIng.slice(0, unitIndex);
                let count;
                if (arrCount.length === 1){
                    count = eval(arrCount[0].replace('-', '+'));
                }else {
                    count = eval(arrCount.join('+'));
                }
                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex+1).join(' ')
                }
            }
            else if (parseInt(arrIng[0], 10)) {
                // Just a number at first position
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    // ingredient: arrIng.slice(1).join(' ');
                    ingredient: ingredient.slice(1)
                }
            }
            else if (unitIndex === -1) {
                // There is no unit...
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient,
                }
            }
            return objIng;
        })
        this.ingredients = newIng
    }
    updateServings(type) {
        const newServings = type === 'dec'? this.servings -1: this.servings + 1;

        this.ingredients.forEach(ing => {
            ing.count *= (newServings/ this.servings);
        });
        this.servings = newServings;
    }
}