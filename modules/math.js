/** 1. 화살표 함수 exports **/
// 모듈을 호출했을 때, add 키 값에는 add 변수 함수가 가지고 있는 값이 할당된다.
// const add = (a, b) => {
//     return a + b;
// }
// exports.add = add;


/** 2. 익명함수 exports **/
// 모듈을 호출했을 때, add 키 값에는 (a,b){return a + b;} 익명함수가 할당되는 방법
// exports.add = function (a, b) {
//     return a + b;
// }


/** 3. module.exports = Object **/
// 모듈을 호출했을 때, add 키 값에는 add 함수가 들어가는 방법이다.
// function add(a, b) {
//     return a + b;
// }
// module.exports = { add: add };


/** 4. module.exports = Function **/
// 모듈 그 자체를 add 함수로 할당
function add(a, b) {
    return a + b;
}
module.exports = add;