


export function capitalize(word){
    return word[0].toUpperCase()+word.slice(1,word.length)
}


export function ccapitalizer_3000(word){

    let wordCapitalizered 

    let splittedWords = word.split(" ")

    for(let i = 0; i < splittedWords.length ; i++){
        if(splittedWords[i] !== 'y' || splittedWords[i] !== 'a') {

            splittedWords[i] = splittedWords[i][0].toUpperCase() +splittedWords[i].slice(1) 
                                                                                 //slice(1) me toma hasta el final
        } 

        
    }

    wordCapitalizered = splittedWords.join(" ")
    //uno cuando detecta un " "
    return wordCapitalizered 
    
}

console.log(ccapitalizer_3000("lana y aurora"))