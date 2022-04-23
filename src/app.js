// CONSTANTS

const OPERATORS = {
    "!" : 3, // Negation
    "|" : 2, // Disjunction
    "&" : 2, // Conjunction
    ">" : 1, // Conditional
    "-" : 1, // Biconditional
}

const SEPARATORS = {
    "(" : 1,
    ")" : 1,
}

function func(){
    let expre = document.getElementById("expre").value;

    let [tokens, propositions] = tokenizator(expre);
    let rpn = shunting_yard(tokens);
    let res = evaluate(rpn, propositions);
    console.log(res);
    create_table(propositions.length, table);
}

// Trigger enter button to the submit entry
document.getElementById("expre")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("sub-btn").click();
    }
});

function create_table(num_prop, prop_table){

    // Get the previus table
    let old_table = document.getElementById("prop-table")

    // Assert that old_table exist and remove
    if (old_table){
        old_table.remove();
    }

    let table = document.createElement("table");

    // Create the basic rows
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");

    // Add an attribute to the table
    table.setAttribute("id", "prop-table");

    // Add the basic rows to the table
    table.appendChild(thead);
    table.appendChild(tbody);

    // Creating and adding data to first row of the table
    let headers = document.createElement('tr');

    // Row of headers
    for (const prop in prop_table){
        let heading = document.createElement('th');
        heading.innerHTML ="{0}".format(prop);
        headers.appendChild(heading);
    }

    thead.appendChild(headers);

    // Fill the table with the true values
    for (let i = 0; i < Math.pow(2, num_prop); i++){
        let row = document.createElement('tr');
        for (const prop in prop_table){
            let value = document.createElement('td');
            value.innerHTML = "{0}".format(prop_table[prop][i]);
            row.appendChild(value);
        }
        tbody.appendChild(row);
    }

    // Adding the entire table to the body tag
    document.getElementById("container").appendChild(table);
}

function isalpha(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}

String.prototype.format = function () {
    // store arguments in an array
    var args = arguments;
    // use replace to iterate over the string
    // select the match and check if related argument is present
    // if yes, replace the match with the argument
    return this.replace(/{([0-9]+)}/g, function (match, index) {
        // check if the argument is present
        return typeof args[index] == "undefined" ? match : args[index];
  });
};


function tokenizator(expre){

    // Arrays
    let tokens = [];
    let propositions = [];

    for (let i = 0; i < expre.length; i++){
        if (isalpha(expre[i])){
            tokens.push([expre[i] ,"prop"]);
            if (!propositions.includes(expre[i])){
                propositions.push(expre[i])
            }
        }else if (OPERATORS[expre[i]]){
            tokens.push([expre[i] ,"ope"])
        }else if (SEPARATORS[expre[i]]){
            tokens.push([expre[i] ,"sep"])
        }
    }

    return [tokens, propositions];
}

function shunting_yard(tokens){
    let rpn = [];
    let ope = [];

    for (let i = 0; i < tokens.length; i++){

        // Propositions
        if (tokens[i][1] == "prop"){
            rpn.push(tokens[i]);
        }

        // Operators
        else if (tokens[i][1] == "ope"){
            while (ope.length != 0 && ope[ope.length - 1][0] != "(" && OPERATORS[ope[ope.length - 1][0]] > OPERATORS[tokens[i][0]]){
                rpn.push(ope.pop());
            }
            ope.push(tokens[i]);
        }

        // Open parenthesis
        else if (tokens[i][0] == "("){
            ope.push(tokens[i]);
        }

        // Close parenthesis
        else if (tokens[i][0] == ")"){
            while (ope.length != 0 && ope[ope.length - 1][0] != "("){
                rpn.push(ope.pop());
            }
            if (ope[ope.length - 1][0] == "("){
                ope.pop();
            }
        }
    }

    // Add the remainers operators in the output list
    while (ope.length != 0){
        if (ope.length != 0 && ope[ope.length - 1] != "("){
            rpn.push(ope.pop());
        }
    }

    return rpn;
}

function permutations(propositions){

    table = {};
    let swicth = 1;

    for (let i = 0; i < propositions.length; i++){
        // table[propositions[i]] = 
        let sub = [];
        for (let j = 0; j < Math.pow(2, i + 1); j++){
            for (let k = 0; k < Math.pow(2, propositions.length - i -1); k++){
                if (swicth < 0){
                    sub.push(0);
                }else{
                    sub.push(1);
                }
            } 
            swicth *= -1;
        }

        table[propositions[i]] = sub;
    }

    return table;
}

function conjunction(prop1, prop2){
    let res = [];
    for (let i = 0; i < prop1.length; i++){
        if (prop1[i] == 1 && prop2[i] == 1){
            res.push(1);
        }
        else{
            res.push(0);
        }
    }
    return res;
}

function disjunction(prop1, prop2){
    let res = [];
    for (let i = 0; i < prop1.length; i++){
        if (prop1[i] == 1 || prop2[i] == 1){
            res.push(1);
        }
        else{
            res.push(0);
        }
    }
    return res;
}

function conditional(prop1, prop2){
    let res = [];

    for (let i = 0; i < prop1.length; i++){
        if (prop1[i] == 1 && prop2[i] == 0){
            res.push(0);
        }else{
            res.push(1);
        }
    }
    return res;
}

function biconditional(prop1, prop2){
    let res = [];

    for (let i = 0; i < prop1.length; i++){
        if (prop1[i] == 1 && prop2[i] == 1 || prop1[i] == 0 && prop2[i] == 0){
            res.push(0);
        }else{
            res.push(1);
        }
    }
    return res;
    }

function negation(prop1){
    let res = [];
    for (let i = 0; i < prop1.length; i++){
        if (prop1[i] == 0){
            res.push(1);
        }else{
            res.push(0);
        }
    }
    return res;
}

function evaluate(rpn, propositions){
    let stack = [];

    // Find only one token
    if (rpn.length <= 1){
        return rpn;
    }

    // Get the table of true for each proposition
    let table = permutations(propositions);

    for (let i = 0; i < rpn.length; i++){
        if (!OPERATORS[rpn[i][0]]){
            stack.push(rpn[i]);
        }
        // Assert operation different to the negation
        else if (rpn[i][0] != "!"){
            // Get the propositions
            let ope2 = stack.pop();
            let ope1 = stack.pop(); 

            // Apply the operations
            if (rpn[i][0] == "&"){
                table["{0}&{1}".format(ope1[0], ope2[0])] = conjunction(table[ope1[0]], table[ope2[0]]);
                stack.push(["{0}&{1}".format(ope1[0], ope2[0]), "prop"]);
            }
            else if (rpn[i][0] == "|"){
                table["{0}|{1}".format(ope1[0], ope2[0])] = disjunction(table[ope1[0]], table[ope2[0]]);
                stack.push(["{0}|{1}".format(ope1[0], ope2[0]), "prop"]);
            }
            else if (rpn[i][0] == ">"){
                table["{0}>{1}".format(ope1[0], ope2[0])] = conditional(table[ope1[0]], table[ope2[0]]);
                stack.push(["{0}>{1}".format(ope1[0], ope2[0]), "prop"]);
            }
            else if (rpn[i][0] == "-"){
                table["{0}-{1}".format(ope1[0], ope2[0])] = biconditional(table[ope1[0]], table[ope2[0]]);
                stack.push(["{0}-{1}".format(ope1[0], ope2[0]), "prop"]);
            }
        }

        else{
            // Get the proposition
            ope1 = stack.pop();

            table["!{0}".format(ope1[0])] = negation(table[ope1[0]]);
            stack.push(["!{0}".format(ope1[0]), "prop"]);
        }
    }
    return table[stack.pop()[0]];
} 