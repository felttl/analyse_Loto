
import { readFileSync } from './fs';
// import Chart from '/chart.js/auto';

// parse test
export function csv2json() {


    //const csv = readFileSync(filename, 'utf-8');

    // Reading the file using default (fs npm package)
    filename = '../donnees/normal_loto/1 normal_mai1976-oct2008.csv'
    const fs = require("fs");
    csv = fs.readFileSync(filename)
    const array = csv.toString().split("\r");
    let result = [];
    let headers = array[0].split(", ")
    for (let i = 1; i < array.length - 1; i++) {
        let obj = {}
        let str = array[i]
        let s = ''
        let flag = 0
        for (let ch of str) {
            if (ch === '"' && flag === 0) {
                flag = 1
            }
            else if (ch === '"' && flag == 1) flag = 0
            if (ch === ', ' && flag === 0) ch = '|'
            if (ch !== '"') s += ch
        }
        let properties = s.split("|")
        for (let j in headers) {
            if (properties[j].includes(", ")) {
                obj[headers[j]] = properties[j]
                    .split(", ")
                    .map(item => item.trim())
            }
            else obj[headers[j]] = properties[j]
        }
        result.push(obj)
    }
    let json = JSON.stringify(result);
    fs.writeFileSync('output.json', json);
}




console.log("inscript included !!")



// end page