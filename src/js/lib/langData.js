const standartClass = 
`import java.util.Scanner;

public class Standart {
    public static in;
    {contentBefore}
    {main}
}
`;

const cppLibs = `
#include <iostream>
#include <string>
`;

const write = {
    key: /cout {1,}<<[A-z ":-<<=]{1,}/g,
    value: "System.out.println(",
    callBack: function(match) {
        match = match.replace(/cout {1,}<</g, this.value);
        match = match.replace('<<', ',');
        let index = match.lastIndexOf(';');
        match = match.slice(0, index) + ');';

        return match;
    }
}

const read = {
    regExp: /cin {1,}>> {0,}[A-z0-9_>> ]{1,} {0,};/g,
    callBack: function(match) {
        let matchCopy = match;
        let index = match.indexOf('>>');
        const arrIndexes = [];

        while(index !== -1) {
            arrIndexes.push(index);
            match = match.slice(0, index) + '  ' + match.slice(index+2);
            index = match.indexOf('>>');
        }

        let lastIndex = match.lastIndexOf(';');
        arrIndexes.push(lastIndex);

        if(lastIndex === -1 || arrIndexes.length ===0) {
            alert('SYNTAX ERROR');
        }

        let varr; const funcInfo = this.funcInfo[this.iteration];
        let res = ``;
        for(let i = 0; i < arrIndexes.length - 1; i++) {
            varr = matchCopy.slice(arrIndexes[i] + 2, arrIndexes[i+1]).trim();
            let el = funcInfo.variables.find(el => el.variable ===  varr);

            let str = el.variable + ' = in.next' + el.type[0].toUpperCase() + el.type.slice(1) + '(); \n';
            res += str;

        }
        console.log(res);
        return res;
    }

}

const funcReg = {
    regExp: /(int|float|double|char|string|bool) {1,}[A-z0-9_-]{1,} {0,}\([A-z0-9_\-, ]{0,}\)/g,
    info: [],
    callBack: function(match) {
        let in1 = match.search(/[A-z0-9_-]{1,} {0,}\(/g);
        let in2 = match.indexOf('(');
        let in3 = match.lastIndexOf(')');

        let inputVars = match.slice(in2 + 1, in3); //.split(/( {1,}|, {0,})/g);
        inputVars = inputVars.replace(',','').split(/ {1,}/g);

        let infoItem = {};
        infoItem.function = match.slice(in1, in2);
        infoItem.parameters = [];

        for(let i = 0; i < inputVars.length; i+=2) {
            if(inputVars[i+1]) {
                infoItem.parameters.push({type: inputVars[i], variable: inputVars[i+1]});
            }
        }

        this.info.push(infoItem);

        return 'public static ' + match;
    },
}

const allVars = {
    regExp: /(int|double|float|char|string) {1,}[A-z0-9=,_ ]{1,};/g,
    callBack: function(match) {

    }
}

const cppTypeData = ['int', 'float', 'double', 'short int', 'long int', 'char', 'string', 'bool'];

const mainJava = `
public static void main(String [] args) {
    in = new Scanner(System.in);
`

const cppToJavaMap = new Map();

cppToJavaMap.set(/int {1,}main\(\)(\n| )\{/g, mainJava);
cppToJavaMap.set('write', write);
cppToJavaMap.set(/printf {0,}\(/g, "System.out.println(");


export const langData = {
    standartClass: standartClass,
    cppLibs: cppLibs,
    cppMap: cppToJavaMap,
    cppTypeData: cppTypeData,
    cppFuncReg: funcReg,
    cppRead: read
};