/*
   Utils - Utilitários de API
*/

// Utilitários
module.exports = {

    // forEach para async/await
    asyncForEach: async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }

}
