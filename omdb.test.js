const request = require("supertest");
const chai = require('chai');
const expect = require("chai").expect;
chai.use(require('chai-http'))

const getUrl = (queries) => {
    return request(`http://omdbapi.com/?&apikey=${process.env.omdb_key}&r=json`)
    .get('/')
    .query(queries)
}

describe('GET omdb movie API', function() {
    it('Should return status code 200 and content type JSON when searching with keyword', async function() {
        const queries = { 
            s: "avengers",
            type: 'movie',
        }
        const response = await getUrl(queries)
        expect(response).to.status(200);
        expect(response).to.be.json;
    });
    it('Should returns an array of 10 movies and title of each movie should contains the keyword when searching with keyword', async function() {
        const queries = { 
            s: "avengers",
            type: 'movie',
        }
        const response = await getUrl(queries)
        expect(response.body.Search).to.be.an('array').to.have.lengthOf(10);
        for(let i=0; i<response.body.Search.length; i++){
            expect(response.body.Search[i].Title.toLowerCase()).to.include('avengers');
        }
    });
    it('Should return one movie with the same title including plot when searching with exact title and querying plot=full', async function() {
        const queries = { 
            t: "planet hulk",
            type: 'movie',
            plot:'full'
        }
        const response = await getUrl(queries)
        expect(response.body.Title.toLowerCase()).to.equal("planet hulk");
        expect(response.body.Plot).to.not.be.empty;
    });
    it('Should returns an array of 10 series and title of each series should contains the keyword when searching with type series and keyword', async function() {
        const queries = { 
            s: "avengers",
            type: 'series',
        }
        const response = await getUrl(queries)
        expect(response.body.Search).to.be.an('array').to.have.lengthOf(10);
        for(let i=0; i<response.body.Search.length; i++){
            expect(response.body.Search[i].Title.toLowerCase()).to.include('avengers');
            expect(response.body.Search[i].Type).to.equal('series');
        }
    });
    it('Should returns "movie not found" error when searching with invalid keyword', async function() {
        const queries = { 
            s: "kjdkjfhjkah",
            type: 'movie',
        };
        const response = await getUrl(queries);
        expect(response.body.Error.toLowerCase()).to.equal("movie not found!");
    });
    it('Should returns appropriate movie title when search by valid id', async function() {
        const queries = { 
            i: "tt1483025",
            type: 'movie',
        };
        const response = await getUrl(queries);
        expect(response.body.Title).to.equal("Planet Hulk");
    });
    it('Should returns "Invalid IMDB id" error when search by invalid id', async function() {
        const queries = { 
            i: "tt1483025cbd775",
            type: 'movie',
        };
        const response = await getUrl(queries);
        expect(response.body.Error.toLowerCase()).to.equal("incorrect imdb id.");
    });
    it('should returns movies of same year when search by keyword and year', async function() {
        const queries = { 
            s: "panda",
            y: "2012",
            type: 'movie',
        };
        const response = await getUrl(queries);
        for(let i=0; i<response.body.Search.length; i++){
            expect(response.body.Search[i].Title.toLowerCase()).to.include('panda');
            expect(response.body.Search[i].Year).to.equal('2012');
        };
    });
    it('Should returns "movie not found" error when search with invalid year', async function() {
        const queries = { 
            s: "panda",
            y: "2046",
            type: 'movie',
        };
        const response = await getUrl(queries);
        expect(response.body.Error.toLowerCase()).to.equal("movie not found!")
    });
    it('Should returns genre, country, and language when search with valid title', async function() {
        const queries = { 
            t: "kung fu panda",
            type: 'movie',
        };
        const response = await getUrl(queries);
        expect(response.body.Genre).to.not.be.empty;
        expect(response.body.Country).to.not.be.empty;
        expect(response.body.Language).to.not.be.empty;
    })
})