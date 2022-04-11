export const handleCase = (str) => {
    let words = str.split(/_/).map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    })
    return words.join(' ');
}