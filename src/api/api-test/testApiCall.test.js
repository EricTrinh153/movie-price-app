import fetchMock from 'fetch-mock';
import { fetchRetry } from '../fetchRetry';
import { CINEMAWORLD_URL } from '../filmState';
import { FILMWORLD_URL } from '../filmState';
import fs from 'fs';
import { mergeArray } from '../filmState';


test('Test cinema world API Call', () => {
    var cinemaworld = JSON.parse(fs.readFileSync('./src/api/__mockData__/cinemaworld.json', 'utf8'));
    fetchMock.get(`${CINEMAWORLD_URL}`, cinemaworld);
    var options = {
        method: "GET",
        redirect: "follow",
    };
    const cinemaResult = fetchRetry(`${CINEMAWORLD_URL}`, options).then(res => {
        expect(JSON.parse(res.body.toString())).toEqual(cinemaworld)
    })
    fetchMock.restore();
    return cinemaResult;
})

test('Test film world API Call', () => {
    var filmworld = JSON.parse(fs.readFileSync('./src/api/__mockData__/filmworld.json', 'utf8'));
    fetchMock.get(`${FILMWORLD_URL}`, filmworld);
    var options = {
        method: "GET",
        redirect: "follow",
    };
    const filmResult = fetchRetry(`${FILMWORLD_URL}`, options).then(res => {
        expect(JSON.parse(res.body.toString())).toEqual(filmworld)
    })
    fetchMock.restore();
    return filmResult;
})

test('Test merging function', () => {
    var cinemaworld = JSON.parse(fs.readFileSync('./src/api/__mockData__/cinemaworld.json', 'utf8')).Movies;
    var filmworld = JSON.parse(fs.readFileSync('./src/api/__mockData__/filmworld.json', 'utf8')).Movies;
    var unionArray = JSON.parse(fs.readFileSync('./src/api/__mockData__/unionArray.json', 'utf8'));
    var filmResult = expect(mergeArray(filmworld, cinemaworld)).toEqual(unionArray);
    return filmResult;
})
