const categories = [
    { code: "24642003", name: "Psychiatry procedure or service" },
    { code: "409063005", name: "Counselling" },
    { code: "409073007", name: "Education" },
    { code: "387713003", name: "Surgical procedure" },
    { code: "103693007", name: "Diagnostic procedure" },
    { code: "46947000", name: "Chiropractic manipulation" },
    { code: "410606002", name: "Social service procedure" }
]
var categoryName;
const givenCategoryCode = '103693007'
categories.forEach(element => {
    if (element.code === givenCategoryCode) {
        categoryName = element.name
    }
});
categoryName = categoryName == undefined ? 'Unknown' : categoryName
console.log(categoryName)