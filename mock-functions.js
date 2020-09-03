// Mocks the functionalities of some popular functions

// mocks the uuid() functions
const uuid = (function() {
    let uid = 0;
    
    return function() {
        uid += 1;
        return uid.toString();
    }
})();