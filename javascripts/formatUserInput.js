"use strict";
let Formatter = {
	allReplace(string) { 
    console.log("string", string);
    let obj = {
    	'\@': '%40',
			'\#': '%23',
			'\$': '%24',
			'\%': '%25',
			'\^': '%5E',
			'\&': '%26',
			'\\+': '%2B',
			' ': '+',
			'\`': '%60',
			'\,': '%2C',
			'\/': '%2F',
			"\'": '%27',
			'\\[': '%5B',
			'\]': '%5D',
			'\<': '%3C',
			'\>': '%3E',
			'\\?': '%3F',
			'\"': '%22',
			'\{': '%7B',
			'\}': '%7D'
    };
    let retStr = string;
    
    for (var x in obj) {
        retStr = retStr.replace(new RegExp(x, 'g'), obj[x]);
    }
    
    return retStr;
	}
};

module.exports = Formatter;