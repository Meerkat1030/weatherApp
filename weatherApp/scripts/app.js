// 1. 변수선언
const locationBtn = document.querySelector('button')
    , inputFiled = document.querySelector('input')
    ,wrapper = document.querySelector('.wrapper')
    ,weatherPart = wrapper.querySelector('.weather-part')
    ,inputPart = wrapper.querySelector('.input-part')
    ,arrowBack = wrapper.querySelector('header i')
    ,infoTxt = inputPart.querySelector('.info-txt');



// 2. api (1) 도시명 검색 api 호출 하는 함수
//        (2) 위도, 경도로 api 호출 하는 함수
let api;

// (1) 도시명 검색
inputFiled.addEventListener('keyup', function (e){
    if(e.key =='Enter' && inputFiled.value != ''){
        requestApi(inputFiled.value);
    }
})
function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=19e51183d03bb03a4434f9f161d707aa`;
    fetchData();

}
// (2) 위도 경도 검색
locationBtn.addEventListener('click', function (){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert('이 브라우저는 위치 정보를 제공하지 않습니다.')
    }
})

function onSuccess(position){
    console.log(position);
    const{latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&&appid=19e51183d03bb03a4434f9f161d707aa`
    fetchData();
}

function onError(error){
    if(error.code == 1){
        infoTxt.innerText = '현재 위치 요청을 거부 했습니다.';
    }else if(error.code == 2){
        infoTxt.innerText = '위치 정보를 사용할 수 없습니다.';
    }else{
        infoTxt.innerText = '알 수 없는 오류가 발생했습니다.'
    }

    infoTxt.classList.add('error');
}

function fetchData(){
    infoTxt.innerText = '날씨 정보를 가져오는 중입니다...';
    infoTxt.classList.add('pending');

    // $.get(api)
    //     .done(function (res){
    //         weatherDetails(res);
    //     }).fail(function (error){ //api 관련 err가 낫을때
    //         infoTxt.innerText = '오류발생';
    //         infoTxt.classList.replace('pending', 'error');
    //         console.log(error);
    // })

    fetch(api)
        .then(res => res.json())
        .then(result => weatherDetails(result))
        .catch(()=> {
            infoTxt.innerText = '오류가 발생 했습니다.';
            infoTxt.classList.replace('pending','error');
        })

}

// 3. input 이벤트

// 4. button click 이벤트
// 5. 오류 발생시 호출 함수
// 6. 호출 완료 후에 날씨 정보 표시하기
function weatherDetails(info){
    console.log(info);
    if(info.cod == '404'){
        infoTxt.innerText = '그런 지명은 없습니다.';
        infoTxt.classList.replace('pending', 'error');
    }else {
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0]; //구조분해할당
        const {temp, feels_like, humidity} = info.main;
        const icon = info.weather[0].icon;

        weatherPart.querySelector('.temp .numb').innerText = temp.toFixed(1);
        weatherPart.querySelector('.weather').innerText = description;
        weatherPart.querySelector('.location span').innerText = `${city}, ${country}`;
        weatherPart.querySelector('.temp .numb-2').innerText = feels_like.toFixed(1);
        weatherPart.querySelector('.humidity span').innerText = `${humidity}%`;

        weatherPart.querySelector('img').src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        infoTxt.classList.remove('pending', 'error');
        infoTxt.innerText = '';
        inputFiled.value = '';
        wrapper.classList.add('active');
    }


}
// 7. 되돌아가는 함수
arrowBack.addEventListener('click', function (){
    wrapper.classList.remove('active');
})
