import axios from "axios";

export default class Search {
    constructor(query){
        this.query = query;
    }

    async getData(){
        try{
            const test = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
            this.result = test.data.recipes;
            // console.log(this.result);
        } catch (err) {
            console.log(err);
        }

    }
}